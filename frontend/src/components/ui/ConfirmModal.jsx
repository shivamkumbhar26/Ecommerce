import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

/**
 * Generic confirmation modal for destructive actions.
 *
 * Usage:
 *   <ConfirmModal
 *     isOpen={Boolean(target)}
 *     onClose={() => setTarget(null)}
 *     onConfirm={handleDelete}
 *     loading={loading}
 *     title="Delete product"
 *     message={`Are you sure you want to delete "${target?.name}"?`}
 *     confirmLabel="Delete"
 *     variant="danger"
 *   />
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-5">
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-sm text-ink-400 leading-relaxed pt-1.5">{message}</p>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}