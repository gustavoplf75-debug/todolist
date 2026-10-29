// Camada de acesso ao backend (Fastify + MySQL).
// Rotas: GET/POST /api/tasks, PATCH/DELETE /api/tasks/:id

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'
const TASKS_PATH = import.meta.env.VITE_TASKS_PATH || '/api/tasks'
const URL_TASKS = `${BASE_URL}${TASKS_PATH}`

// backend (due_date, completed 0/1) -> frontend
function fromApi(t) {
  return {
    id: t.id,
    title: t.title ?? '',
    completed: Boolean(Number(t.completed)),
    dueDate: t.due_date ?? null,
  }
}

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    let msg = `Erro ${res.status} ao falar com o servidor`
    try {
      const body = await res.json()
      if (body?.message) msg = body.message
    } catch { /* sem corpo */ }
    throw new Error(msg)
  }
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

// A busca é feita no servidor: GET /api/tasks?search=...
export async function listTasks(search = '') {
  const data = await request(`${URL_TASKS}?search=${encodeURIComponent(search)}&status=all`)
  return {
    tasks: (data?.tasks ?? []).map(fromApi),
    total: data?.total ?? 0,
    completed: data?.completed ?? 0,
  }
}

export async function createTask({ title, dueDate }) {
  return fromApi(await request(URL_TASKS, {
    method: 'POST',
    body: JSON.stringify({ title, dueDate: dueDate || null }),
  }))
}

// PATCH aceita { completed?, title?, dueDate? } (dueDate null remove a data)
export async function updateTask(id, changes) {
  return fromApi(await request(`${URL_TASKS}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  }))
}

export async function deleteTask(id) {
  await request(`${URL_TASKS}/${id}`, { method: 'DELETE' })
}
