import { useEffect, useState } from "react";

const TASKS_URL = "/api/tasks";
const WORKERS_URL = "/api/workers";

const STATUS = [
  { value: "OPEN", label: "Tillgänglig" },
  { value: "IN_PROGRESS", label: "Pågående" },
  { value: "DONE", label: "Avslutad" },
];

async function getErrorMessage(res) {
  const contentType = res.headers.get("content-type") || "";

  try {
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return data?.message || data?.error || "Request failed";
    }

    const text = await res.text();
    return text || "Request failed";
  } catch {
    return "Request failed";
  }
}

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [workers, setWorkers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  async function fetchTasks(signal) {
    const res = await fetch(TASKS_URL, { signal });
    if (!res.ok) throw new Error(await getErrorMessage(res));
    return res.json();
  }

  async function fetchWorkers(signal) {
    const res = await fetch(WORKERS_URL, { signal });
    if (!res.ok) throw new Error(await getErrorMessage(res));
    return res.json();
  }

  async function loadAll(signal) {
    try {
      setError(null);
      setLoading(true);

      const [tasksData, workersData] = await Promise.all([
        fetchTasks(signal),
        fetchWorkers(signal),
      ]);

      setTasks(tasksData);
      setWorkers(workersData);
    } catch (err) {
      if (err?.name === "AbortError") return;
      setError(err?.message || "Okänt fel");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadAll(controller.signal);
    return () => controller.abort();
  }, []);

  async function createTask(e) {
    e.preventDefault();

    const trimmed = title.trim();
    if (!trimmed) {
      setError("Fyll i titel");
      return;
    }

    if (!selectedWorkerId) {
      setError("Välj en worker");
      return;
    }

    try {
      setError(null);
      setBusy(true);

      const res = await fetch(TASKS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmed,
          status: "OPEN",
          worker: { id: Number(selectedWorkerId) },
        }),
      });

      if (!res.ok) throw new Error(await getErrorMessage(res));

      const created = await res.json();
      setTasks((prev) => [created, ...prev]);

      setTitle("");
      setSelectedWorkerId("");
    } catch (err) {
      setError(err?.message || "Okänt fel");
    } finally {
      setBusy(false);
    }
  }

  async function setTaskStatus(taskId, statusValue) {
    try {
      setError(null);
      setBusy(true);

      const res = await fetch(`${TASKS_URL}/${taskId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusValue }),
      });

      if (!res.ok) throw new Error(await getErrorMessage(res));

      const updated = await res.json();
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(err?.message || "Okänt fel");
    } finally {
      setBusy(false);
    }
  }

  async function deleteTask(taskId) {
    const ok = window.confirm("Vill du radera uppgiften?");
    if (!ok) return;

    try {
      setError(null);
      setBusy(true);

      const res = await fetch(`${TASKS_URL}/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await getErrorMessage(res));

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err) {
      setError(err?.message || "Okänt fel");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2>Uppgifter</h2>

      <form onSubmit={createTask} style={{ marginBottom: "1.5rem" }}>
        <h3>Skapa ny uppgift</h3>

        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="task-title">Titel</label>
          <input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="t.ex. Skriv rapport"
            disabled={busy}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="task-worker">Worker</label>
          <select
            id="task-worker"
            value={selectedWorkerId}
            onChange={(e) => setSelectedWorkerId(e.target.value)}
            disabled={busy}
          >
            <option value="">Välj</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={busy}>
          Skapa
        </button>
        <button
          type="button"
          onClick={() => loadAll()}
          disabled={busy}
          style={{ marginLeft: "0.5rem" }}
        >
          Ladda om
        </button>
      </form>

      {loading && <p>Laddar...</p>}
      {error && <p className="error">Fel: {error}</p>}

      {!loading && !error && (
        <>
          {tasks.length === 0 ? (
            <p>Inga uppgifter.</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <li key={task.id} style={{ marginBottom: "1rem" }}>
                  <div>
                    <strong>{task.title}</strong> ({task.status})
                  </div>

                  <div style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                    Worker: {task.worker?.name || "Ingen"}
                  </div>

                  <div style={{ marginTop: "0.4rem" }}>
                    {STATUS.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setTaskStatus(task.id, s.value)}
                        disabled={busy}
                        style={{ marginRight: "0.5rem" }}
                      >
                        {s.label}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      disabled={busy}
                    >
                      Radera
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default TasksPage;
