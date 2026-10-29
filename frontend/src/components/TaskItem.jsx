import { formatDate, isOverdue } from '../utils'

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task)
  return (
    <li className={`task ${task.completed ? 'done' : ''}`}>
      <button
        className={`check ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task)}
        aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
      >
        {task.completed && '✓'}
      </button>

      <div className="task-body">
        <span className={`task-title ${overdue ? 'overdue' : ''}`}>{task.title}</span>
        <div className="task-meta">
          {task.dueDate && <span className="due">{formatDate(task.dueDate)}</span>}
          {overdue && <span className="badge">Em atraso</span>}
        </div>
      </div>

      <div className="actions">
        <button onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">✏️</button>
        <button onClick={() => onDelete(task)} aria-label="Delete task" title="Delete">🗑️</button>
      </div>
    </li>
  )
}
