import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export function useProgress(year, month) {
  const [daysState, setDaysState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const daysInMonth = new Date(year, month, 0).getDate();

  const fetchProgress = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/progress/${year}/${month}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setDaysState(data.days);
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Cannot connect to backend server. Running in beautiful offline demo mode.");
      // Fallback UI to show the design if backend is down
      setDaysState(new Array(daysInMonth).fill('none'));
    } finally {
      setLoading(false);
    }
  }, [year, month, daysInMonth]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const toggleDay = async (dayIndex) => {
    const currentState = daysState[dayIndex] || 'none';
    let nextState = 'none';
    if (currentState === 'none') nextState = 'ticked';
    else if (currentState === 'ticked') nextState = 'wasted';
    else if (currentState === 'wasted') nextState = 'none';

    // Optimistic UI update
    const newDaysState = [...daysState];
    newDaysState[dayIndex] = nextState;
    setDaysState(newDaysState);
    
    // API Call
    if (!error) {
      try {
        const dayNum = dayIndex + 1;
        const res = await fetch(`${API_BASE}/progress/${year}/${month}/${dayNum}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextState })
        });
        if (!res.ok) throw new Error('Update failed');
      } catch (err) {
        console.error('Failed to update progress', err);
        // Revert on failure
        const revertState = [...daysState];
        revertState[dayIndex] = currentState;
        setDaysState(revertState);
        setError("Failed to save progress to database.");
      }
    }
  };

  let maxStreak = 0;
  let tempStreak = 0;
  for (let i = 0; i < daysState.length; i++) {
    if (daysState[i] === 'ticked') {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  let currentStreak = 0;
  const today = new Date();
  if (year === today.getFullYear() && month === today.getMonth() + 1) {
    let idx = today.getDate() - 1;
    if (daysState[idx] === 'ticked') {
      while(idx >= 0 && daysState[idx] === 'ticked') { currentStreak++; idx--; }
    } else if (idx - 1 >= 0 && daysState[idx - 1] === 'ticked') {
      idx--;
      while(idx >= 0 && daysState[idx] === 'ticked') { currentStreak++; idx--; }
    }
  }

  return { daysState, loading, error, toggleDay, daysInMonth, currentStreak, maxStreak };
}
