/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/home/Home'
import Cart from './pages/cart/Cart'
import MainLayout from './layouts/MainLayout'
import NoMatch from './error/NoMatch'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ItemProduct from './pages/home/ItemProduct'
import SearchPage from './pages/home/SearchPage'
import Dashboard from './pages/dashboard/Dashboard'
import ResetPassword from './pages/auth/ResetPassword'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      Component: MainLayout,
      children: [
        {
          path:'',
          element: <Navigate to="/home" replace />
        },
        {
          path: "home",
          Component: Home
        },
        {
          path: "cart/:cid",
          Component: Cart
        },
        {
          path: "product/:pid",
          Component: ItemProduct
        },
        {
          path:"search/:term",
          Component:SearchPage
        },
        {
          path: "dashboard",
          Component: Dashboard
        }
      ]
    },
    //Autenticacion
    {
      path:'/auth',
      children: [
        {
          path:'',
          element: <Navigate to="/auth/login" replace />
        },
        {
          path:'login',
          Component: Login
        },
        {
          path:'register',
          Component: Register
        },
        {
          path:'reset-password',
          Component:ResetPassword
        }
      ]
    },
    //Rutas no encontradas
    {
      path: "*",
      Component: NoMatch
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App
