import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { UserPlus, Users, Mail, Lock, User, Trash2 } from 'lucide-react'
import { adminApi, usersApi } from '../../api/usersApi'
import { useUI } from '../../context/UIContext'
import { useAsync } from '../../hooks/useAsync'
import { safeArray, getInitials } from '../../utils'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Spinner from '../../components/ui/Spinner'
import { Alert } from '../../components/ui/Alert'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminEmployeesPage() {
  const { pushAlert } = useUI()
  const { loading: saving, error: saveError, run } = useAsync()
  const [employees, setEmployees] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setFetchLoading(true)
    adminApi.getEmployees()
      .then((r) => setEmployees(safeArray(r.data)))
      .catch(() => {
        // fallback: filter employees from all users
        usersApi.getAll()
          .then((r) => setEmployees(safeArray(r.data).filter(u => u.role === 'ROLE_EMPLOYEE')))
      })
      .finally(() => setFetchLoading(false))
  }

  useEffect(() => { load() }, [])

  const onSubmit = async (data) => {
    await run(async () => {
      await adminApi.addEmployee(data)
      pushAlert(`Employee ${data.fullName} added successfully`, 'success')
      reset()
      load()
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-50">Employee Management</h1>
        <p className="text-sm text-ink-500 mt-0.5">Add new employees and view the current team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Employee Form */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-5">
              <UserPlus className="w-5 h-5 text-brand-400" />
              <h2 className="font-display text-lg font-semibold text-ink-100">Add Employee</h2>
            </div>

            {saveError && (
              <div className="mb-4">
                <Alert message={saveError} type="error" />
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                icon={User}
                placeholder="John Doe"
                error={errors.fullName?.message}
                {...register('fullName', { required: 'Full name is required' })}
              />
              <Input
                label="Email"
                type="email"
                icon={Mail}
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                })}
              />
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />
              <Button type="submit" loading={saving} className="w-full">
                <UserPlus className="w-4 h-4" />
                Add Employee
              </Button>
            </form>
          </div>
        </div>

        {/* Employee List */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-ink-400" />
            <h2 className="font-display text-lg font-semibold text-ink-100">
              Current Employees
            </h2>
            <span className="ml-auto badge bg-ink-800 border-ink-700 text-ink-400">
              {employees.length} total
            </span>
          </div>

          {fetchLoading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : !employees.length ? (
            <EmptyState
              icon={Users}
              title="No employees yet"
              description="Add your first employee using the form."
            />
          ) : (
            <div className="space-y-3">
              {employees.map((emp) => (
                <div key={emp.id} className="card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 font-mono text-sm font-bold flex items-center justify-center flex-shrink-0">
                    {getInitials(emp.fullName || emp.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-100 truncate">
                      {emp.fullName || '—'}
                    </p>
                    <p className="text-sm text-ink-500 truncate">{emp.email}</p>
                  </div>
                  <span className="badge bg-sky-500/10 text-sky-400 border-sky-500/20">
                    Employee
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}