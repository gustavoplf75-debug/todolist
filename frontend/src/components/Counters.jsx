export default function Counters({ total, done }) {
  return (
    <div className="counters">
      <span>Tasks <b>{total}</b></span>
      <span>Completed <b>{done}</b></span>
    </div>
  )
}
