"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProfile } from "@/services/userService";
import { UserProfile } from "@/types/database";

export function useUserProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setLoading(false);
        return;
      }

      const data = await getUserProfile(user.uid);
      setProfile(data);
      setLoading(false);
    }

    loadProfile();
  }, [user]);

  return { profile, loading };
}