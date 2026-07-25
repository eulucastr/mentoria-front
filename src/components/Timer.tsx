import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatTime } from '../utils/formatTime';
import { Button } from './shadcn/button';
import { useTimer } from 'react-timer-hook';
import { getExpiryTimestamp } from '@/utils/getExpiryTimestamp';

const TIMER_SETTINGS = {
  focus: 0.1,
  shortBreak: 0.1,
  longBreak: 0.1,
  cicles: 4,
  autoStartFocus: true,
  autoStartBreaks: true,
};

type Mode = 'focus' | 'shortBreak' | 'longBreak';

export function Timer() {
  const [mode, setMode] = useState<Mode>('focus');
  const [cicleCount, setCicleCount] = useState<number>(1);
  const { totalSeconds, pause, resume, restart, isRunning } = useTimer({
    expiryTimestamp: getExpiryTimestamp(TIMER_SETTINGS[mode]),
    onExpire: () => { handleExpire() },
    autoStart: false,
  });

  useEffect(() => {
    console.log('Timer is running:', isRunning);
  }, [isRunning])

  const toggleTimer = () => {
    if (isRunning) pause(); 
    else resume();
  };

  const currentCycleDuration = TIMER_SETTINGS[mode] * 60;
  const cycleProgress = Math.max(
    0,
    Math.min(100, (totalSeconds / currentCycleDuration) * 100),
  );
  const elapsedProgress = 100 - cycleProgress;
  
  const handleExpire = () => {
    let newMode: Mode | undefined;

    if (mode === 'focus') {
      newMode = cicleCount === TIMER_SETTINGS.cicles ? 'longBreak' : 'shortBreak';
    } else if (mode === 'longBreak') {
      // newMode = 'focus'
      // setCicleCount(1)
    } else if (mode === 'shortBreak') {
      newMode = 'focus'
      setCicleCount((prevCount) => prevCount + 1)
    }

    if (!newMode) return;
    restart(getExpiryTimestamp(TIMER_SETTINGS[newMode]), true);
  }

  const resetTimer = () => {
    setMode('focus')
    setCicleCount(1)
    restart(getExpiryTimestamp(TIMER_SETTINGS['focus']), false)
  }
  
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
        {Array.from({ length: TIMER_SETTINGS.cicles }).map((_, index) => (
          (() => {
            const isActiveCycle = index + 1 === cicleCount;
            const cycleBarProgress = isActiveCycle && mode === 'focus' ? elapsedProgress : 100;

            return (
          <div
            key={index}
            style={
              isActiveCycle
                ? ({ '--cycle-progress': `${cycleBarProgress}%` } as CSSProperties)
                : undefined
            }
            className={`${isActiveCycle && !(cicleCount === 1 && !isRunning) && mode === 'focus' ? 'w-8' : 'w-3'} h-3 transition-all ease-in-out duration-300 rounded-full ${index + 1 < cicleCount || (isActiveCycle && mode !== 'focus') ? 'bg-sky-500' : 'bg-gray-700'} ${isActiveCycle ? "relative overflow-hidden before:absolute before:inset-y-0 before:left-0 before:rounded-[inherit] before:bg-sky-500 before:content-[''] before:w-(--cycle-progress) before:transition-[width] before:duration-200 before:ease-linear" : ''}`}
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
