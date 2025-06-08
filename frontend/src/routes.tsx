import { createBrowserRouter } from 'react-router-dom'
import { Home } from './pages/Home'
import { Play } from './pages/Play'
import App from './App'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'play',
        element: <Play />,
      },
    ],
  },
]) 