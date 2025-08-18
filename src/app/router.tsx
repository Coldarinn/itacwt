import { Navigate, createBrowserRouter } from "react-router"
import { type RouteObject } from "react-router"

import { Pages } from "@/pages/pages"
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
        element: <Pages />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
