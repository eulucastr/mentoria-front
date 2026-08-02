import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { TooltipProvider } from '@/components/atoms/tooltip';

function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  );
}

export { App }