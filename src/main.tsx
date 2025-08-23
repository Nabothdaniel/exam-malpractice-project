import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "react-toastify/dist/ReactToastify.css"
import { ToastContainer } from 'react-toastify'
import Layout from "./components/Layout"
import DashboardPage from "./pages/DashboardPage"
import CasesPage from "./pages/CasesPage"
import StudentsPage from "./pages/StudentsPage"
import InvestigatorsPage from "./pages/InvestigatorsPage"
import SettingsPage from "./pages/SettingsPage"
import SupportPage from "./pages/SupportPage"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/ProtectedRoute"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "cases",
        element: <CasesPage />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
      {
        path: "investigators",
        element: <InvestigatorsPage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <ToastContainer autoClose={3000} />
  </React.StrictMode>,
)
