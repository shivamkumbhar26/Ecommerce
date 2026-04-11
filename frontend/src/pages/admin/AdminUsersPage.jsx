import { useEffect, useState } from 'react'
import { Users, UserCheck, Trash2, Search, ShieldCheck } from 'lucide-react'
import { usersApi } from '../../api/usersApi'
import { useUI } from '../../context/UIContext'
import { useAsync } from '../../hooks/useAsync'
import { safeArray, getInitials } from '../../utils'
import { ROLES } from '../../constants'
import Button from '../../components/ui/Button'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'

const roleBadge = {
  [ROLES.ADMIN]: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  [ROLES.EMPLOYEE]: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  [ROLES.USER]: 'bg-ink-700/50 text-ink-400 border-ink-700',
}

const roleLabel = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.EMPLOYEE]: 'Employee',
  [ROLES.USER]: 'User',
}

export default function AdminUsersPage() {
  const { pushAlert } = useUI()
  const { loading: acting, run } = useAsync()
  const [users, setUsers] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [promoteTarget, setPromoteTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const load = () => {
    setFetchLoading(true)
    usersApi.getAll()
      .then((r) => setUsers(safeArray(r.data)))
      .finally(() => setFetchLoading(false))
  }

  useEffect(() => { load() }, [])

  const handlePromote = async () => {
    await run(async () => {
      await usersApi.promote(promoteTarget.id)
      pushAlert(`${promoteTarget.fullName || promoteTarget.email} promoted to Employee`, 'success')
      setPromoteTarget(null)
      load()
    })
  }

  const handleDelete = async () => {
    await run(async () => {
      await usersApi.delete(deleteTarget.id)
      pushAlert('User deleted', 'success')
      setDeleteTarget(null)
      load()
    })
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      !q ||
      u.email?.toLowerCase().includes(q) ||
      u.fullName?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Users</h1>
          <p className="text-sm text-ink-500 mt-0.5">Manage registered users and roles</p>
        </div>
        <div className="badge bg-ink-800 border-ink-700 text-ink-400 text-sm">
          {users.length} total
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users…"
          className="input-field pl-10"
        />
      </div>

      {fetchLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : !filtered.length ? (
        <EmptyState icon={Users} title="No users found" />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-800">
                  {['User', 'Email', 'Role', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800/60">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-ink-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0">
                          {getInitials(u.fullName || u.email)}
                        </div>
                        <span className="font-medium text-ink-100">{u.fullName || '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge className={roleBadge[u.role] || roleBadge[ROLES.USER]}>
                        {roleLabel[u.role] || u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {u.role === ROLES.USER && (
                          <button
                            onClick={() => setPromoteTarget(u)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-sky-400 hover:bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/40 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Promote
                          </button>
                        )}
                        {u.role !== ROLES.ADMIN && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Promote modal */}
      <ConfirmModal
        isOpen={Boolean(promoteTarget)}
        onClose={() => setPromoteTarget(null)}
        onConfirm={handlePromote}
        loading={acting}
        title="Promote to Employee"
        message={`Promote ${promoteTarget?.fullName || promoteTarget?.email} to Employee? They will gain access to the delivery portal.`}
        confirmLabel="Promote"
        variant="primary"
      />

      {/* Delete modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={acting}
        title="Delete user"
        message={`Permanently delete ${deleteTarget?.email}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  )
}