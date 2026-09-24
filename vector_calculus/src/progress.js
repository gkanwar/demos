const storageKey = 'vector-calculus-progress-v1';
let memoryProgress = {};
let loaded = false;

function validScore(score) {
  return score && Number.isInteger(score.correct) &&
    Number.isInteger(score.total) && score.total > 0 &&
    score.correct >= 0 && score.correct <= score.total;
}

export function getProgress() {
  if (!loaded) {
    loaded = true;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          memoryProgress = Object.fromEntries(Object.entries(parsed).filter(
            ([, entry]) => entry && Number.isInteger(entry.attempts) &&
              validScore(entry.latest) && validScore(entry.best) &&
              typeof entry.completed === 'boolean',
          ));
        }
      }
    } catch {
      // Keep the in-memory summary if storage is unavailable.
    }
  }
  return memoryProgress;
}

export function updateProgress(progress, key, score) {
  const previous = progress[key];
  const best = !previous?.best ||
    score.correct * previous.best.total >
      previous.best.correct * score.total ? score : previous.best;
  return {
    ...progress,
    [key]: {
      attempts: (previous?.attempts || 0) + 1,
      latest: score,
      best,
      completed: Boolean(previous?.completed || score.correct === score.total),
    },
  };
}

export function recordAttempt(key, score) {
  memoryProgress = updateProgress(getProgress(), key, score);
  try {
    localStorage.setItem(storageKey, JSON.stringify(memoryProgress));
    return true;
  } catch {
    return false;
  }
}
