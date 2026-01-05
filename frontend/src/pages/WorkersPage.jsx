import { useEffect, useState } from "react";

const TASKS_URL = "/api/tasks";
const WORKERS_URL = "/api/workers";


function WorkersPage() {
  const [workers, setWorkers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function loadWorkers() {
    try {
      setError(null);
      setLoading(true);

      const res = await fetch(WORKERS_URL);
      if (!res.ok) throw new Error("Kunde inte hämta workers");
      const data = await res.json();
      setWorkers(data);
    } catch (err) {
      setError(err.message || "Okänt fel");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkers();
  }, []);

  async function createWorker(e) {
    e.preventDefault();

    if (!name.trim()) {
      setError("Fyll i namn");
      return;
    }

    try {
      setError(null);

      const res = await fetch(WORKERS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Kunde inte skapa worker");

      const created = await res.json();
      setWorkers((prev) => [...prev, created]);

      setName("");
      setEmail("");
    } catch (err) {
      setError(err.message || "Okänt fel");
    }
  }

  async function deleteWorker(workerId) {
    try {
      setError(null);

      const res = await fetch(`${WORKERS_URL}/${workerId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Kunde inte ta bort worker");

      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    } catch (err) {
      setError(err.message || "Okänt fel");
    }
  }

  return (
    <div>
      <h2>Workers</h2>

      <form onSubmit={createWorker} style={{ marginBottom: "1.5rem" }}>
        <h3>Skapa worker</h3>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Namn
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="t.ex. Anna"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "0.75rem" }}>
          <label style={{ display: "block", marginBottom: "0.25rem" }}>
            Email (valfritt)
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="t.ex. anna@example.com"
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <button type="submit" style={{ padding: "0.6rem 1rem" }}>
          Skapa
        </button>
        <button
          type="button"
          onClick={loadWorkers}
          style={{ padding: "0.6rem 1rem", marginLeft: "0.5rem" }}
        >
          Ladda om
        </button>
      </form>

      {loading && <p>Laddar...</p>}
      {error && <p style={{ color: "crimson" }}>Fel: {error}</p>}

      {!loading && !error && (
        <>
          {workers.length === 0 ? (
            <p>Inga workers.</p>
          ) : (
            <ul>
              {workers.map((w) => (
                <li key={w.id} style={{ marginBottom: "0.75rem" }}>
                  <div>
                    <strong>{w.name}</strong>
                    {w.email ? ` (${w.email})` : ""}
                  </div>
                  <div style={{ marginTop: "0.35rem" }}>
                    <button type="button" onClick={() => deleteWorker(w.id)}>
                      Delete
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

export default WorkersPage;
