import { Navigate, createBrowserRouter } from "react-router"
import { type RouteObject } from "react-router"

import { Layout } from "./Layout/Layout"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <h1>Products Page</h1>,
      },
      {
        path: "/price-plans",
        element: <h1>Price Plans Page</h1>,
      },
      {
        path: "/pages",
        element: <h1>Pages Page</h1>,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
