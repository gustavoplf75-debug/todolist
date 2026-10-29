// Aceita "2026-10-29" ou "2026-10-29T03:00:00.000Z" e devolve um Date local à meia-noite.
export function parseDate(value) {
  if (!value) return null
  const s = String(value)
  if (s.includes('T')) {
    const d = new Date(s)
    if (isNaN(d)) return null
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }
  const [y, m, d] = s.slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

// "YYYY-MM-DD" para o <input type="date">
export function toInputDate(value) {
  const d = parseDate(value)
  if (!d) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function isOverdue(task) {
  const due = parseDate(task.dueDate)
  if (!due || task.completed) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

export function formatDate(value) {
  const d = parseDate(value)
  return d ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''
}

// Data mais próxima primeiro; sem data vai para o final.
export function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const da = parseDate(a.dueDate)
    const db = parseDate(b.dueDate)
    if (da && db) return da - db
    if (da) return -1
    if (db) return 1
    return 0
  })
}
