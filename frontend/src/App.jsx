import { useState } from "react";
import TasksPage from "./pages/TasksPage.jsx";
import WorkersPage from "./pages/WorkersPage.jsx";

const PAGES = {
  TASKS: "tasks",
  WORKERS: "workers",
};

const styles = {
  container: { padding: "2rem", fontFamily: "sans-serif", maxWidth: 900 },
  nav: { marginBottom: "1.5rem", display: "flex", gap: "0.5rem" },
  button: { padding: "0.5rem 0.75rem", cursor: "pointer" },
  activeButton: { fontWeight: 700, textDecoration: "underline" },
};

function App() {
  // Enkel sidväxling
  const [page, setPage] = useState(PAGES.TASKS);

  const isTasks = page === PAGES.TASKS;

  return (
    <div style={styles.container}>
      <h1>Task system</h1>

      <nav aria-label="Huvudmeny" style={styles.nav}>
        <button
          type="button"
          onClick={() => setPage(PAGES.TASKS)}
          aria-current={isTasks ? "page" : undefined}
          style={{
            ...styles.button,
            ...(isTasks ? styles.activeButton : null),
          }}
        >
          Uppgifter
        </button>

        <button
          type="button"
          onClick={() => setPage(PAGES.WORKERS)}
          aria-current={!isTasks ? "page" : undefined}
          style={{
            ...styles.button,
            ...(!isTasks ? styles.activeButton : null),
          }}
        >
          Workers
        </button>
      </nav>

      {isTasks ? <TasksPage /> : <WorkersPage />}
    </div>
  );
}

export default App;
