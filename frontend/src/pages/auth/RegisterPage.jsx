import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight } from 'lucide-react'
import { authApi } from '../../api/authApi'
import { useUI } from '../../context/UIContext'
import { useAsync } from '../../hooks/useAsync'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Alert } from '../../components/ui/Alert'

export default function RegisterPage() {
  const { pushAlert } = useUI()
  const navigate = useNavigate()
  const { loading, error, run } = useAsync()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    const { confirmPassword, ...payload } = data
    await run(async () => {
      await authApi.register(payload)
      pushAlert('Account created! Please sign in.', 'success')
      navigate('/login')
    })
  }

  return (
    <div className="card p-8 animate-slide-up">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-bold text-ink-50 mb-1.5">Create account</h1>
        <p className="text-sm text-ink-500">Join ShopArc for exclusive deals</p>
      </div>

      {error && <div className="mb-5"><Alert message={error} type="error" /></div>}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Full name"
          type="text"
          icon={User}
          placeholder="John Doe"
          error={errors.fullName?.message}
          {...register('fullName', {
            required: 'Full name is required',
            minLength: { value: 2, message: 'Minimum 2 characters' },
          })}
        />

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
          hint="At least 8 characters"
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Minimum 8 characters' },
          })}
        />

        <Input
          label="Confirm password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (val) => val === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
          Create account <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  )
}