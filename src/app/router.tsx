import { Navigate, createBrowserRouter } from "react-router"
import { type RouteObject } from "react-router"

import { PricePlans } from "@/pages/pricePlans"
import { Products } from "@/pages/products"

import { Layout } from "./Layout/Layout"

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Products />,
      },
      {
        path: "/price-plans",
        element: <PricePlans />,
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
