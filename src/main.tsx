import { createRoot } from "react-dom/client"

import { App } from "./app/App"
import "./shared/styles"

createRoot(document.getElementById("root")!).render(<App />)
