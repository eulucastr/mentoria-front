import { RouterProvider } from 'react-router-dom';
import { TooltipProvider } from '@/components/atoms/tooltip';
import { AuthProvider } from '@/contexts/auth-context';
import { router } from './routes';

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  );
}

export { App }