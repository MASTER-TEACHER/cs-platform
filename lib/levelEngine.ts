export function getLevelFromXP(xp: number) {
  const xpPerLevel = 500;

  const level = Math.floor(xp / xpPerLevel) + 1;
  const currentLevelXP = xp % xpPerLevel;
  const progress = Math.round((currentLevelXP / xpPerLevel) * 100);
  const xpToNextLevel = xpPerLevel - currentLevelXP;

  return {
    level,
    currentLevelXP,
    xpPerLevel,
    progress,
    xpToNextLevel,
  };
}