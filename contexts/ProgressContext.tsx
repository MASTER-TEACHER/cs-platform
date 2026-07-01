"use client";

import { createContext, useContext, useState } from "react";

type ProgressContextType = {
  xp: number;
  completedLessons: number;
  addXP: (amount: number) => void;
  completeLesson: () => void;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [xp, setXP] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);

  function addXP(amount: number) {
    setXP((prev) => prev + amount);
  }

  function completeLesson() {
    setCompletedLessons((prev) => prev + 1);
  }

  return (
    <ProgressContext.Provider
      value={{
        xp,
        completedLessons,
        addXP,
        completeLesson,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);

  if (!context) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }

  return context;
}