import { LEVEL_CONFIG } from '../data/levelConfig';
import { useProgress } from '../contexts/ProgressContext';

export function useLevel(levelId) {
  const { selectedLevel } = useProgress();
  const id = levelId !== undefined ? levelId : selectedLevel;
  const config = LEVEL_CONFIG[id] || LEVEL_CONFIG[0];
  return { config, levelId: id };
}
