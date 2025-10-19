import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Landing from './pages/Landing'
import Work from './pages/Work'

const router = createBrowserRouter([
  { path: "/", element: <App/>, children: [
    { index: true, element: <Landing/> },
    { path: "work", element: <Work/> },
    { path: "contact", element: <Landing contactMode/> },
  ]}
])

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><RouterProvider router={router}/></React.StrictMode>)