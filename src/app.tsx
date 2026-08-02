import { RouterProvider } from 'react-router-dom';
import { TooltipProvider } from '@/components/atoms/tooltip';
import { AuthProvider } from '@/contexts/auth-context';
import { router } from './routes';
import { useEffect } from 'react';

function App() {
    useEffect(() => {

    document.documentElement.classList.add('dark');

  }, []); 

  return (
    <AuthProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </AuthProvider>
  );
}

export { App }