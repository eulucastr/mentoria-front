import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/app-layout';
// import { DashboardPage } from './pages/DashboardPage';
import { TimerPage } from './pages/TimerPage';

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
    ],
  },
]);