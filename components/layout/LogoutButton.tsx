"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/authService";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logoutUser();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
    >
      Logout
    </button>
  );
}