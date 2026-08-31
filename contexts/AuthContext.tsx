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

import {
  auth,
} from "@/lib/firebase";

import {
  getUserProfile,
} from "@/services/userService";

import type {
  UserProfile,
} from "@/types/database";

type AuthContextType = {
  user: User | null;

  profile:
    UserProfile | null;

  loading: boolean;

  profileReady: boolean;

  profileError: string;

  refreshProfile:
    () =>
      Promise<UserProfile | null>;
};

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(
    undefined,
  );

const PROFILE_LOAD_ATTEMPTS =
  12;

const PROFILE_RETRY_DELAY_MS =
  250;

function wait(
  milliseconds: number,
): Promise<void> {
  return new Promise(
    (resolve) => {
      window.setTimeout(
        resolve,
        milliseconds,
      );
    },
  );
}

async function loadProfileWithRetry(
  uid: string,
): Promise<UserProfile | null> {
  for (
    let attempt = 0;
    attempt <
    PROFILE_LOAD_ATTEMPTS;
    attempt += 1
  ) {
    const loadedProfile =
      await getUserProfile(
        uid,
      );

    if (
      loadedProfile
    ) {
      return loadedProfile;
    }

    if (
      attempt <
      PROFILE_LOAD_ATTEMPTS -
        1
    ) {
      await wait(
        PROFILE_RETRY_DELAY_MS,
      );
    }
  }

  return null;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null,
    );

  const [
    profile,
    setProfile,
  ] =
    useState<UserProfile | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    profileReady,
    setProfileReady,
  ] =
    useState(false);

  const [
    profileError,
    setProfileError,
  ] =
    useState("");

  const refreshProfile =
    useCallback(
      async (): Promise<UserProfile | null> => {
        const currentUser =
          auth.currentUser;

        if (
          !currentUser
        ) {
          setProfile(
            null,
          );

          setProfileReady(
            false,
          );

          setProfileError(
            "",
          );

          return null;
        }

        try {
          setProfileError(
            "",
          );

          const loadedProfile =
            await loadProfileWithRetry(
              currentUser.uid,
            );

          if (
            !loadedProfile
          ) {
            setProfile(
              null,
            );

            setProfileReady(
              false,
            );

            setProfileError(
              "Your CS Master user profile could not be found.",
            );

            return null;
          }

          setProfile(
            loadedProfile,
          );

          setProfileReady(
            true,
          );

          return loadedProfile;
        } catch (
          error
        ) {
          console.error(
            "Unable to refresh the user profile:",
            error,
          );

          setProfile(
            null,
          );

          setProfileReady(
            false,
          );

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
    let active =
      true;

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          firebaseUser,
        ) => {
          if (!active) {
            return;
          }

          setLoading(
            true,
          );

          setUser(
            firebaseUser,
          );

          setProfile(
            null,
          );

          setProfileReady(
            false,
          );

          setProfileError(
            "",
          );

          if (
            !firebaseUser
          ) {
            if (active) {
              setLoading(
                false,
              );
            }

            return;
          }

          try {
            /*
             * A newly registered Firebase Auth user can exist
             * a fraction of a second before our secure server
             * route creates users/{uid}.
             *
             * Retry quietly instead of throwing a false profile
             * error during that legitimate creation window.
             */
            const loadedProfile =
              await loadProfileWithRetry(
                firebaseUser.uid,
              );

            if (!active) {
              return;
            }

            if (
              !loadedProfile
            ) {
              setProfile(
                null,
              );

              setProfileReady(
                false,
              );

              setProfileError(
                "Your CS Master user profile could not be found.",
              );

              return;
            }

            setProfile(
              loadedProfile,
            );

            setProfileReady(
              true,
            );
          } catch (
            error
          ) {
            if (!active) {
              return;
            }

            console.error(
              "Unable to load the user profile:",
              error,
            );

            setProfile(
              null,
            );

            setProfileReady(
              false,
            );

            setProfileError(
              error instanceof Error
                ? error.message
                : "Your profile could not be loaded.",
            );
          } finally {
            if (active) {
              setLoading(
                false,
              );
            }
          }
        },
      );

    return () => {
      active =
        false;

      unsubscribe();
    };
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
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context =
    useContext(
      AuthContext,
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}