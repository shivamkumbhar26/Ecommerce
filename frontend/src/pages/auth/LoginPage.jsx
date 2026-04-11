import { useForm } from 'react-hook-form'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { authApi } from '../../api/authApi'
import { useAsync } from '../../hooks/useAsync'
import { ROLE_REDIRECT } from '../../constants'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Alert } from '../../components/ui/Alert'

export default function LoginPage() {
  const { login } = useAuth()
  const { pushAlert } = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, error, run } = useAsync()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    await run(async () => {
      const res = await authApi.login(data)
      const { jwt, role, email, fullName } = res.data
      login(jwt, { role, email, fullName })
      pushAlert(`Welcome back, ${fullName || email}!`, 'success')
      const from = location.state?.from?.pathname
      const dest = from || ROLE_REDIRECT[role] || '/'
      navigate(dest, { replace: true })
    })
  }

  return (
    <div className="card p-8 animate-slide-up">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold text-ink-50 mb-1.5">Welcome back</h1>
        <p className="text-sm text-ink-500">Sign in to continue shopping</p>
      </div>

      {error && <div className="mb-5"><Alert message={error} type="error" /></div>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Email address"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
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

        <Button
          type="submit"
          loading={loading}
          className="w-full mt-2"
          size="lg"
        >
          Sign in <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  )
}