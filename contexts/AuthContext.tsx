"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  onAuthStateChanged,
  type User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/services/userService";

import type { UserProfile } from "@/types/database";

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;

  loading: boolean;
  profileReady: boolean;
  profileError: string;

  refreshProfile: () => Promise<UserProfile | null>;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [profileReady, setProfileReady] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  const refreshProfile =
    useCallback(
      async (): Promise<UserProfile | null> => {
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setProfile(null);
          setProfileReady(false);
          setProfileError("");

          return null;
        }

        try {
          setProfileError("");

          /*
           * IMPORTANT:
           *
           * We only READ the existing Firestore profile here.
           *
           * We deliberately do NOT call ensureUserProfile(),
           * because that function can attempt automatic
           * Firestore repair writes.
           */
          const loadedProfile =
            await getUserProfile(
              currentUser.uid,
            );

          if (!loadedProfile) {
            throw new Error(
              "Your CS Master user profile could not be found.",
            );
          }

          setProfile(loadedProfile);
          setProfileReady(true);

          return loadedProfile;
        } catch (error) {
          console.error(
            "Unable to load the user profile:",
            error,
          );

          setProfile(null);
          setProfileReady(false);

          setProfileError(
            error instanceof Error
              ? error.message
              : "Your profile could not be loaded.",
          );

          return null;
        }
      },
      [],
    );

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          setLoading(true);

          setUser(firebaseUser);

          setProfile(null);
          setProfileReady(false);
          setProfileError("");

          if (!firebaseUser) {
            setLoading(false);
            return;
          }

          try {
            /*
             * Load only.
             *
             * No automatic migration or repair write
             * is performed during authentication.
             */
            const loadedProfile =
              await getUserProfile(
                firebaseUser.uid,
              );

            if (!loadedProfile) {
              throw new Error(
                "Your CS Master user profile could not be found.",
              );
            }

            setProfile(loadedProfile);
            setProfileReady(true);
          } catch (error) {
            console.error(
              "Unable to load the user profile:",
              error,
            );

            setProfile(null);
            setProfileReady(false);

            setProfileError(
              error instanceof Error
                ? error.message
                : "Your profile could not be loaded.",
            );
          } finally {
            setLoading(false);
          }
        },
      );

    return unsubscribe;
  }, []);

  const value =
    useMemo<AuthContextType>(
      () => ({
        user,
        profile,

        loading,
        profileReady,
        profileError,

        refreshProfile,
      }),
      [
        user,
        profile,
        loading,
        profileReady,
        profileError,
        refreshProfile,
      ],
    );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}