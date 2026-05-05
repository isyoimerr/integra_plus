import { createContext, useContext, useState, useCallback } from 'react';
import { levelService } from '../services/level.service';
import { useAuth } from './AuthContext';

const ProgressContext = createContext(null);

// LEVEL_CONFIG key (0,1,2) → DB nivelId (1,2,3)
export const toDbId = (levelKey) => levelKey + 1;

export function ProgressProvider({ children }) {
  const { token } = useAuth();

  const [levels,           setLevels]           = useState([]);
  const [progress,         setProgress]         = useState([]);
  const [currentExercises, setCurrentExercises] = useState([]);
  const [selectedLevel,    setSelectedLevel]    = useState(0);
  const [exerciseIdx,      setExerciseIdx]      = useState(0);
  const [lives,            setLives]            = useState(3);
  const [lastWrong,        setLastWrong]        = useState(null);

  // Carga niveles + progreso en paralelo
  const fetchAll = useCallback(async () => {
    if (!token) return;
    try {
      const [lvls, prog] = await Promise.all([
        levelService.getAll(token),
        levelService.getProgress(token),
      ]);
      setLevels(lvls);
      setProgress(prog);
    } catch { /* silencio */ }
  }, [token]);

  // Progreso de un nivel (por LEVEL_CONFIG key)
  const getProgreso = useCallback(
    (levelKey) => progress.find(p => p.nivelId === toDbId(levelKey)) || null,
    [progress],
  );

  // ¿Está desbloqueado? (prerequisito completado o sin prerequisito)
  const isUnlocked = useCallback(
    (levelKey) => {
      const nivel = levels.find(l => l.id === toDbId(levelKey));
      if (!nivel) return levelKey === 0; // Nivel 0 siempre disponible
      if (!nivel.prerequisito) return true;
      return !!progress.find(p => p.nivelId === nivel.prerequisito && p.completado);
    },
    [levels, progress],
  );

  // Estrellas ganadas (0 si no completado)
  const getStars = useCallback(
    (levelKey) => {
      const prog = getProgreso(levelKey);
      if (!prog?.completado) return 0;
      return prog.errores === 0 ? 3 : prog.errores <= 2 ? 2 : 1;
    },
    [getProgreso],
  );

  const completeLevel = async (levelKey, errores) => {
    if (!token) return;
    const result = await levelService.complete(token, toDbId(levelKey), errores);
    await fetchAll();
    return result;
  };

  const resetLives = () => setLives(3);

  return (
    <ProgressContext.Provider value={{
      levels, progress,
      currentExercises, setCurrentExercises,
      selectedLevel, setSelectedLevel,
      exerciseIdx, setExerciseIdx,
      lives, setLives, resetLives,
      lastWrong, setLastWrong,
      fetchAll, completeLevel,
      getProgreso, isUnlocked, getStars,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress debe usarse dentro de ProgressProvider');
  return ctx;
};
