export default function Badge({ children, className = '' }) {
  return (
    <span className={`badge border ${className}`}>
      {children}
    </span>
  )
}