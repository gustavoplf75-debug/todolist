import TaskItem from './TaskItem'

export default function TaskList({ tasks, ...handlers }) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <div className="empty-icon">📋</div>
        <p>You have no pending tasks.</p>
      </div>
    )
  }
  return (
    <ul className="task-list">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} {...handlers} />
      ))}
    </ul>
  )
}
