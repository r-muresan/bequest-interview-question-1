import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import DataForm from './pages/app/DataForm'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Rollback from './pages/app/Rollback'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'app',
        element: <DataForm />,
      },
      {
        path: 'rollback',
        element: <Rollback />,
      },
    ],
  },
])

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 5000,
      refetchOnWindowFocus: true,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}></RouterProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
