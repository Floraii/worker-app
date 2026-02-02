import { useState } from "react"
import TasksPage from "./pages/TasksPage.jsx"
import WorkersPage from "./pages/WorkersPage.jsx"

const PAGES = { TASKS: "tasks", WORKERS: "workers" }

export default function App() {
  const [page, setPage] = useState(PAGES.TASKS)
  const isTasks = page === PAGES.TASKS

  return (
    <div className="app">
      <h1>Task system</h1>

      <nav
      className="navBar"
      aria-label="Huvudmeny"
      
    >
      <button
        type="button"
        className="navBtn"
        aria-current={isTasks ? "page" : undefined}
        onClick={() => setPage(PAGES.TASKS)}
      >
        Uppgifter
      </button>

      <button
        type="button"
        className="navBtn"
        aria-current={!isTasks ? "page" : undefined}
        onClick={() => setPage(PAGES.WORKERS)}
      >
        Workers
      </button>
    </nav>


      {isTasks ? <TasksPage /> : <WorkersPage />}
    </div>
  )
}
