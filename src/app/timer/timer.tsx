import type { CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatTime } from '../../utils/formatTime';
import { Button } from '../../components/ui/button';
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
  const [focusHasStarted, setFocusHasStarted] = useState<boolean>(false);
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

    if (mode === 'focus' && !focusHasStarted) {
      setFocusHasStarted(true);
    } else if (mode !== 'focus' && focusHasStarted) {
      setFocusHasStarted(false);
    }

    if (isRunning) pause(); 
    else resume();
  };
  
  const handleExpire = () => {
    const finishedMode = mode;
    let newMode: Mode;
    let shouldAutoStart: boolean;

    if (mode === 'focus') {
      setFocusHasStarted(false);
      newMode = cycleCount === TIMER_SETTINGS.cycles ? 'longBreak' : 'shortBreak';
      shouldAutoStart = TIMER_SETTINGS.autoStartBreaks;
    } else if (mode === 'longBreak') {
      newMode = 'focus';
      if (TIMER_SETTINGS.autoStartFocus) setFocusHasStarted(true);
      shouldAutoStart = TIMER_SETTINGS.autoStartFocus;
      setCycleCount(1);
    } else {
      newMode = 'focus';
      if (TIMER_SETTINGS.autoStartFocus) setFocusHasStarted(true);
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
    setFocusHasStarted(false)
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
  const elapsedProgress = cycleProgress ? 100 - cycleProgress : 0;

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-8 p-8 transition-all duration-300 bg-radial dark:from-zinc-900 dark:to-zinc-950 from-zinc-50 to-zinc-100 text-foreground`}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          mode === 'focus' ? 'opacity-0' : 'opacity-100'
        } bg-radial from-sky-700/20 to-primary/10 dark:from-sky-500/20 dark:to-primary/10`}
      />
      <div className="relative z-10 flex flex-col items-center gap-8">
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
                  className={`
                    w3 h-3 transition-all ease-in-out duration-300 rounded-full 
                    ${isActiveCycle && focusHasStarted ? 'w-8' : 'w-3'}
                    ${mode === 'focus' ? 'bg-sky-200/20' : 'bg-sky-200/30'}
                    ${index + 1 < cycleCount ? `${mode === 'focus' ? 'bg-sky-500' : 'bg-white'}` : ''}
                    ${isActiveCycle ? `
                      before:transition-[width] relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:content-[''] before:w-(--cycle-progress) before:duration-200 before:ease-linear before:rounded-full
                      ${mode === 'focus' ? 'before:bg-sky-500' : 'before:bg-white'}` 
                      : ''}`}
                />
              );
            })()
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleTimer}
            variant={`${mode === 'focus' ? 'default' : 'default'}`}
            className={`
              w-15 h-15 rounded-full transition-all duration-300 ease-in-ou
              ${mode === 'focus' ? 'bg-sky-200/15' : 'bg-sky-200/20'} 
              ${mode === 'focus' ? 'text-foreground' : 'text-white'}
              ${mode === 'focus' ? 'hover:bg-sky-200/20' : 'hover:bg-sky-200/25'}
            `}
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
            variant={`${mode === 'focus' ? 'default' : 'default'}`}
            className={`
              w-15 h-15 rounded-full transition-all duration-300 ease-in-out 
              ${mode === 'focus' ? 'bg-sky-200/15' : 'bg-sky-200/20'} 
              ${mode === 'focus' ? 'text-foreground' : 'text-white'}
              ${mode === 'focus' ? 'hover:bg-sky-200/20' : 'hover:bg-sky-200/25'}
            `}
            title="Reiniciar Temporizador"
          >
            <RotateCcw className="size-7" />
          </Button>
        </div>
      </div>
    </div>
  );
}
