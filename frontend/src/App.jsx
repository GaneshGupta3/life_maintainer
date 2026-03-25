import React, { useState } from 'react';
import { useProgress } from './hooks/useProgress';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-12
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  const { daysState, loading, error, toggleDay, daysInMonth, currentStreak, maxStreak } = useProgress(year, month);

  // 0 = Sunday, 1 = Monday, etc.
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => setCurrentDate(new Date(year, month - 2, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month, 1));

  return (
    <div className="app-container">
      <div className="header">
        <h1>Monthly Progress</h1>
        <p>Tick your boxes. Forge your chain.</p>
      </div>

      <div className="calendar-glass">
        <div className="month-selector">
          <button onClick={prevMonth} aria-label="Previous Month">{"<"}</button>
          <h2>{monthName} {year}</h2>
          <button onClick={nextMonth} aria-label="Next Month">{">"}</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Syncing progress...</div>
        ) : (
          <>
            <div className="weekdays-grid">
              {weekDays.map(day => (
                <div key={day} className="weekday-header">{day}</div>
              ))}
            </div>
            <div className="grid-container calendar-grid">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="empty-day-box"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => (
                <div 
                  key={i} 
                  className={`day-box ${daysState[i] === 'ticked' ? 'ticked' : daysState[i] === 'wasted' ? 'wasted' : ''}`}
                  onClick={() => toggleDay(i)}
                >
                  <span className="day-number">{i + 1}</span>
                  <div className="tick-icon">
                    {daysState[i] === 'wasted' ? '✗' : '✓'}
                  </div>
                </div>
              ))}
            </div>

            <div className="streak-container">
              <div className="streak-box">
                <span className="streak-label">Current Streak</span>
                <span className="streak-value">{currentStreak} <span className="fire">🔥</span></span>
              </div>
              <div className="streak-box">
                <span className="streak-label">Max Streak</span>
                <span className="streak-value">{maxStreak} <span className="star">⭐</span></span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
