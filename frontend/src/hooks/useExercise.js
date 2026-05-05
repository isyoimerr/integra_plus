import { useState } from 'react';
import { exerciseService } from '../services/exercise.service';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { LEVEL_CONFIG } from '../data/levelConfig';

export function useExercise(levelId) {
  const { token } = useAuth();
  const { exerciseIdx, setExerciseIdx, lives, setLives, setLastWrong } = useProgress();
  const config = LEVEL_CONFIG[levelId] || LEVEL_CONFIG[0];
  const ex = config.exercises[exerciseIdx] || config.exercises[0];
  const [selected,   setSelected]   = useState(null);
  const [verifying,  setVerifying]  = useState(false);

  const verify = async (onCorrect, onWrong) => {
    if (!selected) return;
    setVerifying(true);
    try {
      let correcto;
      if (token) {
        const result = await exerciseService.verify(token, ex, selected);
        correcto = result.correcto;
      } else {
        correcto = selected === ex.correct;
      }

      if (correcto) {
        onCorrect();
      } else {
        const newLives = Math.max(0, lives - 1);
        setLives(newLives);
        setLastWrong({ hint: ex.hint, explain: ex.explain, selectedId: selected });
        onWrong();
      }
    } finally {
      setVerifying(false);
      setSelected(null);
    }
  };

  const nextExercise = () => {
    const next = exerciseIdx + 1;
    if (next < config.exercises.length) {
      setExerciseIdx(next);
      return 'next';
    }
    return 'complete';
  };

  return { ex, exerciseIdx, selected, setSelected, verifying, verify, nextExercise, total: config.exercises.length };
}
