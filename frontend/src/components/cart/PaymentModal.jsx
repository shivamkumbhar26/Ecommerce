import { useState } from 'react'
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { formatCurrency, generatePaymentId } from '../../utils'

export default function PaymentModal({ isOpen, onClose, total, onSuccess }) {
  const [step, setStep] = useState('form') // form | processing | success
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cardName: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  })

  const onSubmit = async () => {
    setStep('processing')
    // Simulate payment processing delay
    await new Promise((r) => setTimeout(r, 2000))
    const paymentId = generatePaymentId()
    setStep('success')
    setTimeout(() => {
      onSuccess(paymentId)
      setStep('form')
    }, 1500)
  }

  const formatCardNumber = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16)
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2)
    e.target.value = v
  }

  return (
    <Modal isOpen={isOpen} onClose={step === 'form' ? onClose : undefined} title="Secure Checkout">
      {step === 'success' ? (
        <div className="flex flex-col items-center py-8 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-ink-50">Payment Successful!</h3>
            <p className="text-sm text-ink-400 mt-1">Placing your order…</p>
          </div>
        </div>
      ) : step === 'processing' ? (
        <div className="flex flex-col items-center py-8 text-center gap-4">
          <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
          <div>
            <h3 className="font-display text-lg font-semibold text-ink-100">Processing payment…</h3>
            <p className="text-sm text-ink-500 mt-1">Please wait</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Order summary */}
          <div className="flex items-center justify-between px-4 py-3 bg-brand-500/10 border border-brand-500/20 rounded-xl mb-2">
            <span className="text-sm text-ink-300">Order total</span>
            <span className="text-lg font-bold text-brand-400">{formatCurrency(total)}</span>
          </div>

          <Input
            label="Cardholder name"
            placeholder="John Doe"
            error={errors.cardName?.message}
            {...register('cardName', { required: 'Name is required' })}
          />

          <div>
            <label className="text-sm font-medium text-ink-300 block mb-1.5">Card number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                className={`input-field pl-10 font-mono ${errors.cardNumber ? 'border-red-500' : ''}`}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                onInput={formatCardNumber}
                {...register('cardNumber', {
                  required: 'Card number is required',
                  validate: (v) => v.replace(/\s/g, '').length === 16 || 'Enter 16-digit card number',
                })}
              />
            </div>
            {errors.cardNumber && <p className="text-xs text-red-400 mt-1">{errors.cardNumber.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-ink-300 block mb-1.5">Expiry</label>
              <input
                className={`input-field font-mono ${errors.expiry ? 'border-red-500' : ''}`}
                placeholder="MM/YY"
                maxLength={5}
                onInput={formatExpiry}
                {...register('expiry', {
                  required: 'Required',
                  pattern: { value: /^\d{2}\/\d{2}$/, message: 'MM/YY format' },
                })}
              />
              {errors.expiry && <p className="text-xs text-red-400 mt-1">{errors.expiry.message}</p>}
            </div>
            <Input
              label="CVV"
              type="password"
              placeholder="•••"
              maxLength={4}
              className="font-mono"
              error={errors.cvv?.message}
              {...register('cvv', {
                required: 'Required',
                pattern: { value: /^\d{3,4}$/, message: '3–4 digits' },
              })}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-ink-500 pt-1">
            <Lock className="w-3.5 h-3.5 flex-shrink-0" />
            <span>256-bit SSL encryption. This is a simulated payment.</span>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Pay {formatCurrency(total)}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}