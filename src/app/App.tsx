import { StrictMode } from "react"
import { RouterProvider } from "react-router"

import { router } from "./router"

export const App = () => {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}
