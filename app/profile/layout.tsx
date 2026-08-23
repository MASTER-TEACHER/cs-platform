import type { ReactNode } from "react";

import AccountMembershipCard from "@/components/profile/AccountMembershipCard";
import ProfileCourseRepair from "@/components/profile/ProfileCourseRepair";

export default function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <ProfileCourseRepair />

      <AccountMembershipCard />

      {children}
    </div>
  );
}
