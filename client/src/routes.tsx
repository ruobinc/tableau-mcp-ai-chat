import { Route } from 'react-router';

import HomePage from './pages/HomePage';
import PerformancePage from './pages/PerformancePage';
import PulsePage from './pages/PulsePage';

const routes = [
  {
    title: 'ホーム',
    path: '/home',
    element: <HomePage />,
  },
  {
    title: '業績一覧',
    path: '/performance',
    element: <PerformancePage />,
  },
  {
    title: 'メトリクス',
    path: '/pulse',
    element: <PulsePage />,
  },
];

export function getMainRoutes() {
  return routes.map(({ element, path }) => <Route key={path} path={path} element={element} />);
}

export { routes };
