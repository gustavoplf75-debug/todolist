import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from './services/api'
import useDebounce from './hooks/useDebounce'
import { sortTasks } from './utils'
import Counters from './components/Counters'
import SearchBar from './components/SearchBar'
import TaskList from './components/TaskList'
import TaskModal from './components/TaskModal'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [totals, setTotals] = useState({ total: 0, completed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400) // só busca depois que para de digitar
  const [modal, setModal] = useState({ open: false, task: null })

  const load = useCallback(async () => {
    try {
      const data = await api.listTasks(debouncedSearch.trim())
      setTasks(data.tasks)
      setTotals({ total: data.total, completed: data.completed })
      setError('')
    } catch (e) {
      setError(e.message === 'Failed to fetch'
        ? 'Não foi possível conectar ao backend (http://localhost:3333). Ele está rodando?'
        : e.message)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => { load() }, [load])

  const visible = useMemo(() => sortTasks(tasks), [tasks])

  async function handleSave(data) {
    try {
      if (modal.task) {
        await api.updateTask(modal.task.id, { title: data.title, dueDate: data.dueDate })
      } else {
        await api.createTask(data)
      }
      setModal({ open: false, task: null })
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleToggle(task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))
    try {
      await api.updateTask(task.id, { completed: !task.completed })
    } catch (e) {
      setError(e.message)
    }
    await load()
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"?`)) return
    try {
      await api.deleteTask(task.id)
      await load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>TODOLIST</h1>
        <Counters total={totals.total} done={totals.completed} />
      </header>

      <SearchBar value={search} onChange={setSearch} />

      {error && (
        <div className="error">
          {error} <button onClick={load}>Try again</button>
        </div>
      )}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <TaskList
          tasks={visible}
          onToggle={handleToggle}
          onEdit={(task) => setModal({ open: true, task })}
          onDelete={handleDelete}
        />
      )}

      <button className="fab" aria-label="Create task" onClick={() => setModal({ open: true, task: null })}>
        +
      </button>

      {modal.open && (
        <TaskModal
          key={modal.task?.id ?? 'new'}
          task={modal.task}
          onSave={handleSave}
          onClose={() => setModal({ open: false, task: null })}
        />
      )}
    </div>
  )
}
