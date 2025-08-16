import { Outlet, useLocation } from "react-router"

import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

const useTitle = () => {
  const { pathname } = useLocation()

  if (pathname === "/price-plans") return "Price Plans"
  if (pathname === "/pages") return "Pages"

  return "Products"
}

export const Layout = () => {
  const title = useTitle()

  return (
    <div className="grid [grid-template-columns:220px_1fr] min-h-screen">
      <Sidebar />
      <main>
        <Header title={title} />
        <div className="p-6 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
