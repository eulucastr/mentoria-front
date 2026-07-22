import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Armchair } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

// Tempos em segundos
const TIMER_MODES = {
  focus: 25 * 60,      // 25 minutos
  shortBreak: 5 * 60,  // 5 minutos
  longBreak: 15 * 60,  // 15 minutos
};

type Mode = 'focus' | 'shortBreak' | 'longBreak';

export function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(TIMER_MODES.focus);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;

    if (isActive) {
        interval = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              setIsActive(false); // Chamado de forma assíncrona dentro do callback
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, setIsActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(TIMER_MODES[mode]);
  };

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(TIMER_MODES[newMode]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900 text-white rounded-2xl shadow-2xl max-w-md mx-auto border border-slate-800">
      {/* Selector de Modos */}
      <div className="flex gap-2 p-1.5 bg-slate-800 rounded-xl mb-8">
        <button
          onClick={() => changeMode('focus')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'focus'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Brain className="w-4 h-4" />
          Foco
        </button>

        <button
          onClick={() => changeMode('shortBreak')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'shortBreak'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Pausa Curta
        </button>

        <button
          onClick={() => changeMode('longBreak')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'longBreak'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Armchair className="w-4 h-4" />
          Pausa Longa
        </button>
      </div>

      {/* Display do Tempo */}
      <div className="text-7xl font-mono font-bold tracking-tighter my-4 drop-shadow-md">
        {formatTime(timeLeft)}
      </div>

      {/* Rótulo do Modo Atual */}
      <p className="text-slate-400 text-sm font-medium mb-8">
        {mode === 'focus' && 'Hora de focar no edital! 🚀'}
        {mode === 'shortBreak' && 'Descanse os olhos um pouco. ☕'}
        {mode === 'longBreak' && 'Pausa maior, recarregue as energias! 🔋'}
      </p>

      {/* Botões de Ação */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTimer}
          className={`p-4 rounded-full font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-0.5" />}
        </button>

        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all transform hover:scale-105 active:scale-95"
          title="Reiniciar Temporizador"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
