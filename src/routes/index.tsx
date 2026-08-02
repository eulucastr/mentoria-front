import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layouts/app-layout';
import { TimerPage } from '@/pages/timer';
import { DashboardPage } from '@/pages/dashboard';
import { ProtectedRoute } from './protected';
import { LoginPage } from '@/pages/login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/timer',
        element: <TimerPage />,
      },
      {
        path: '/',
        element: <TimerPage />,
      },
    ],
  },
]);