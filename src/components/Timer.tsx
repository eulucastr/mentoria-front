import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatTime } from '../utils/formatTime';
import { Button } from './shadcn/button';
import { useTimer } from 'react-timer-hook';
import { getExpiryTimestamp } from '@/utils/getExpiryTimestamp';

const TIMER_SETTINGS = {
  focus: 30,
  shortBreak: 5,
  longBreak: 15,
  cycles: 4,
  autoStartFocus: false,
  autoStartBreaks: false,
};

type Mode = 'focus' | 'shortBreak' | 'longBreak';

export function Timer() {
  const [mode, setMode] = useState<Mode>('focus');
  const [cycleCount, setCycleCount] = useState<number>(1);
  const pendingAutoStartRef = useRef<boolean | null>(null);
  const { totalSeconds, pause, resume, restart, isRunning } = useTimer({
    expiryTimestamp: getExpiryTimestamp(TIMER_SETTINGS[mode]),
    onExpire: () => { handleExpire() },
    autoStart: false,
  });

  const requestNotificationPermission = () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'default') return;

    Notification.requestPermission().catch(() => {});
  };

  const notifyTurnEnd = (finishedMode: Mode, nextMode: Mode) => {
    playAlertSound();

    if (typeof window === 'undefined' || !('Notification' in window)) return;

    const title = finishedMode === 'focus' ? 'Turno de foco finalizado' : 'Turno de pausa finalizado';
    const body = nextMode === 'focus' ? 'Hora de voltar ao foco.' : 'Hora de fazer uma pausa.';

    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  };

  const playAlertSound = () => {
    const audio = new Audio('/sounds/bell.mp3'); 
    audio.play().catch(() => {});
  };

  const toggleTimer = () => {
    requestNotificationPermission();

    if (isRunning) pause(); 
    else resume();
  };
  
  const handleExpire = () => {
    const finishedMode = mode;
    let newMode: Mode;
    let shouldAutoStart: boolean;

    if (mode === 'focus') {
      newMode = cycleCount === TIMER_SETTINGS.cycles ? 'longBreak' : 'shortBreak';
      shouldAutoStart = TIMER_SETTINGS.autoStartBreaks;
    } else if (mode === 'longBreak') {
      newMode = 'focus';
      shouldAutoStart = TIMER_SETTINGS.autoStartFocus;
      setCycleCount(1);
    } else {
      newMode = 'focus';
      shouldAutoStart = TIMER_SETTINGS.autoStartFocus;
      setCycleCount((prevCount) => prevCount + 1);
    }

    notifyTurnEnd(finishedMode, newMode);
    pendingAutoStartRef.current = shouldAutoStart;
    setMode(newMode);
  }

  const resetTimer = () => {
    pendingAutoStartRef.current = null;
    setMode('focus')
    setCycleCount(1)
    restart(getExpiryTimestamp(TIMER_SETTINGS['focus']), false)
  }

  useEffect(() => {
    if (pendingAutoStartRef.current === null) return;

    const shouldAutoStart = pendingAutoStartRef.current;
    pendingAutoStartRef.current = null;

    restart(getExpiryTimestamp(TIMER_SETTINGS[mode]), shouldAutoStart);
  }, [mode, restart]);

  useEffect(() => {
    const modeLabel = mode === 'focus' ? 'Foco' : 'Pausa';
    document.title = `${formatTime(totalSeconds)} - ${modeLabel} | Mentoria`;
  }, [totalSeconds, mode]);
  
  // For current cycle progress calculation
  const currentCycleDuration = TIMER_SETTINGS[mode] * 60;
  const cycleProgress = Math.max(
    0,
    Math.min(100, (totalSeconds / currentCycleDuration) * 100),
  );
  const elapsedProgress = 100 - cycleProgress;

  return (
    <div
      className={`flex flex-col w-screen h-screen items-center justify-center gap-8 transition-all duration-300 p-8 ${mode === 'focus' ? 'bg-zinc-800' : ' bg-sky-950'} text-white`}
    >
      <div className="text-2xl font-normal tracking-wide drop-shadow-md">
        {mode === 'focus' ? 'Foco' : 'Pausa'}
      </div>
      {/* Display do Tempo */}
      <div className="text-7xl font-normal tracking-wide">
		    {formatTime(totalSeconds)}
      </div>

      {/* Indicador de Ciclos */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TIMER_SETTINGS.cycles }).map((_, index) => (
          (() => {
            const isActiveCycle = index + 1 === cycleCount;
            const cycleBarProgress = isActiveCycle && mode === 'focus' ? elapsedProgress : 100;

            return (
          <div
            key={index}
            style={
              isActiveCycle
                ? ({ '--cycle-progress': `${cycleBarProgress}%` } as CSSProperties)
                : undefined
            }
            className={`${isActiveCycle && !(cycleCount === 1 && !isRunning) && mode === 'focus' ? 'w-8' : 'w-3'} h-3 transition-all ease-in-out duration-300 rounded-full ${index + 1 < cycleCount || (isActiveCycle && mode !== 'focus') ? 'bg-sky-500' : 'bg-gray-700'} ${isActiveCycle ? "relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:rounded-[inherit] before:bg-sky-500 before:content-[''] before:w-(--cycle-progress) before:transition-[width] before:duration-200 before:ease-linear" : ''}`}
          />
            );
          })()
        ))}
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleTimer}
          variant={`${mode === 'focus' ? 'default' : 'secondary'}`}
          className={`w-15 h-15 rounded-full transition-all duration-300 ease-in-out`}
          title={isRunning ? 'Pausar Temporizador' : 'Iniciar Temporizador'}
        >
          {isRunning ? (
            <Pause className="size-7" />
          ) : (
            <Play className="size-7" />
          )}
        </Button>

        <Button
          onClick={resetTimer}
          variant={`${mode === 'focus' ? 'default' : 'secondary'}`}
          className={`w-15 h-15 rounded-full transition-all duration-300 ease-in-out`}
          title="Reiniciar Temporizador"
        >
          <RotateCcw className="size-7" />
        </Button>
      </div>
    </div>
  );
}
