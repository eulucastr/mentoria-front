import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
// import { DashboardPage } from './pages/DashboardPage';
import { TimerPage } from './pages/TimerPage';
import { DashboardPage } from './pages/DashboardPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <TimerPage />,
      },
      {
        path: '/timer',
        element: <TimerPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
    ],
  },
]);