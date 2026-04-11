import { useEffect, useState, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Pencil, Trash2, Search, Tag, X, PlusCircle, MinusCircle } from 'lucide-react'
import { productsApi } from '../../api/productsApi'
import { useUI } from '../../context/UIContext'
import { useAsync } from '../../hooks/useAsync'
import { formatCurrency, safeArray } from '../../utils'
import { CATEGORIES, PAGE_SIZE } from '../../constants'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'
import Pagination from '../../components/ui/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { useDebounce } from '../../hooks/useDebounce'

const CURRENCIES = [
  { value: 'INR', label: 'INR — Indian Rupee' },
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
]

// ── Product Form ───────────────────────────────────────────────────────────────
function ProductForm({ defaultValues, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      sku: '',
      name: '',
      brand: '',
      description: '',
      category: '',
      currency: 'INR',
      price: '',
      salePrice: '',
      stockQuantity: '',
      imageUrlsRaw: '',
      specifications: [],
    },
  })

  // Dynamic specifications key-value pairs
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'specifications',
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">

      {/* Row 1: SKU + Name */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="SKU"
          placeholder="IPH-15-PRO"
          error={errors.sku?.message}
          {...register('sku', { required: 'SKU is required' })}
        />
        <Input
          label="Product Name"
          placeholder="iPhone 15 Pro"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
      </div>

      {/* Row 2: Brand + Category */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Brand"
          placeholder="Apple"
          error={errors.brand?.message}
          {...register('brand', { required: 'Brand is required' })}
        />
        <Select
          label="Category"
          options={CATEGORIES.map((c) => ({ value: c, label: c }))}
          error={errors.category?.message}
          {...register('category', { required: 'Category is required' })}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-300">Description</label>
        <textarea
          rows={3}
          placeholder="Latest Apple flagship with Titanium body…"
          className={`input-field resize-none leading-relaxed ${errors.description ? 'border-red-500' : ''}`}
          {...register('description')}
        />
      </div>

      {/* Row 3: Price + Sale Price + Currency */}
      <div className="grid grid-cols-3 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          placeholder="120000"
          error={errors.price?.message}
          {...register('price', {
            required: 'Price is required',
            min: { value: 0, message: 'Must be ≥ 0' },
            valueAsNumber: true,
          })}
        />
        <Input
          label="Sale Price"
          type="number"
          step="0.01"
          placeholder="Optional"
          hint="Leave blank for none"
          error={errors.salePrice?.message}
          {...register('salePrice', {
            min: { value: 0, message: 'Must be ≥ 0' },
            setValueAs: (v) => (v === '' || v == null ? null : Number(v)),
          })}
        />
        <Select
          label="Currency"
          options={CURRENCIES}
          error={errors.currency?.message}
          {...register('currency', { required: 'Currency is required' })}
        />
      </div>

      {/* Stock Quantity */}
      <Input
        label="Stock Quantity"
        type="number"
        placeholder="5"
        error={errors.stockQuantity?.message}
        {...register('stockQuantity', {
          required: 'Stock quantity is required',
          min: { value: 0, message: 'Must be ≥ 0' },
          valueAsNumber: true,
        })}
      />

      {/* Image URLs */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink-300">Image URLs</label>
        <textarea
          rows={3}
          className="input-field resize-none font-mono text-xs"
          placeholder={"https://example.com/front.jpg\nhttps://example.com/back.jpg"}
          {...register('imageUrlsRaw')}
        />
        <p className="text-xs text-ink-500">One URL per line</p>
      </div>

      {/* ── Dynamic Specifications ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-medium text-ink-300">Specifications</label>
            <p className="text-xs text-ink-600 mt-0.5">
              Add variable key-value attributes (Color, Storage, etc.)
            </p>
          </div>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' })}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-400 hover:text-brand-300 border border-brand-500/30 hover:border-brand-500/60 px-3 py-1.5 rounded-lg transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add Specification
          </button>
        </div>

        {fields.length === 0 && (
          <div className="text-center py-6 border border-dashed border-ink-800 rounded-xl text-ink-600 text-xs">
            No specifications yet. Click "Add Specification" to add one.
          </div>
        )}

        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                className="input-field flex-1 text-sm"
                placeholder="Key (e.g. Color)"
                {...register(`specifications.${index}.key`, { required: true })}
              />
              <span className="text-ink-700 flex-shrink-0">:</span>
              <input
                className="input-field flex-1 text-sm"
                placeholder="Value (e.g. Natural Titanium)"
                {...register(`specifications.${index}.value`, { required: true })}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex-shrink-0 p-1.5 rounded-lg text-ink-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <MinusCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2 border-t border-ink-800">
        <Button type="submit" loading={loading}>
          {defaultValues?.name ? 'Save changes' : 'Create product'}
        </Button>
      </div>
    </form>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const { pushAlert } = useUI()
  const { loading: saving, run } = useAsync()

  const [products, setProducts] = useState([])
  const [fetchLoading, setFetchLoading] = useState(false)
  const [modalMode, setModalMode] = useState(null)
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const pagination = usePagination()

  const fetchProducts = useCallback(async (q, page) => {
    setFetchLoading(true)
    try {
      const res = q
        ? await productsApi.search(q, page, PAGE_SIZE)
        : await productsApi.getAll(page, PAGE_SIZE)
      const data = res.data
      if (Array.isArray(data)) {
        setProducts(data)
        pagination.setTotalPages(1)
      } else {
        setProducts(safeArray(data.content))
        pagination.setTotalPages(data.totalPages ?? 1)
      }
    } finally {
      setFetchLoading(false)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    fetchProducts(debouncedSearch, pagination.page)
  }, [debouncedSearch, pagination.page]) // eslint-disable-line

  // Convert form data → backend JSON shape
  const buildPayload = (data) => {
    const imageUrls = (data.imageUrlsRaw || '')
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    // Convert [{key, value}] array → { Color: "Titanium", Storage: "256GB" }
    const specifications = {}
    ;(data.specifications || []).forEach(({ key, value }) => {
      if (key?.trim()) specifications[key.trim()] = value?.trim() || ''
    })

    return {
      sku:           data.sku,
      name:          data.name,
      brand:         data.brand,
      description:   data.description || '',
      category:      data.category,
      currency:      data.currency || 'INR',
      price:         data.price,
      salePrice:     data.salePrice || null,
      stockQuantity: data.stockQuantity,
      imageUrls,
      specifications,
    }
  }

  // Convert backend product → form default values (for edit)
  const toFormValues = (product) => ({
    ...product,
    imageUrlsRaw: safeArray(product.imageUrls).join('\n'),
    currency: product.currency || 'INR',
    // Convert { Color: "Titanium" } → [{key: "Color", value: "Titanium"}]
    specifications: Object.entries(product.specifications || {}).map(
      ([key, value]) => ({ key, value })
    ),
  })

  const handleCreate = async (data) => {
    await run(async () => {
      await productsApi.create(buildPayload(data))
      pushAlert('Product created successfully', 'success')
      setModalMode(null)
      fetchProducts(debouncedSearch, pagination.page)
    })
  }

  const handleEdit = async (data) => {
    await run(async () => {
      await productsApi.update(selected.id, buildPayload(data))
      pushAlert('Product updated successfully', 'success')
      setModalMode(null)
      setSelected(null)
      fetchProducts(debouncedSearch, pagination.page)
    })
  }

  const handleDelete = async () => {
    await run(async () => {
      await productsApi.delete(deleteTarget.id)
      pushAlert('Product deleted', 'success')
      setDeleteTarget(null)
      fetchProducts(debouncedSearch, pagination.page)
    })
  }

  const openEdit = (product) => {
    setSelected(toFormValues(product))
    setModalMode('edit')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-50">Products</h1>
          <p className="text-sm text-ink-500 mt-0.5">Manage your product catalog</p>
        </div>
        <Button onClick={() => { setSelected(null); setModalMode('create') }}>
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); pagination.reset() }}
          placeholder="Search products…"
          className="input-field pl-10"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table */}
      {fetchLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-800 text-left">
                  {['Product', 'SKU', 'Brand', 'Category', 'Stock', 'Price', 'Sale', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-medium text-ink-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-800/60">
                {!products.length ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-ink-600">
                      <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      No products found
                    </td>
                  </tr>
                ) : products.map((p) => (
                  <tr key={p.id} className="hover:bg-ink-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-ink-800 border border-ink-700 overflow-hidden flex-shrink-0">
                          {safeArray(p.imageUrls)[0] ? (
                            <img src={safeArray(p.imageUrls)[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Tag className="w-4 h-4 text-ink-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-ink-100 truncate max-w-[160px]">{p.name}</p>
                          {p.description && (
                            <p className="text-xs text-ink-600 truncate max-w-[160px]">{p.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-ink-500">{p.sku || '—'}</td>
                    <td className="px-4 py-3 text-ink-400">{p.brand}</td>
                    <td className="px-4 py-3">
                      <span className="badge bg-ink-800 border-ink-700 text-ink-400">{p.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-sm ${
                        p.stockQuantity === 0
                          ? 'text-red-400'
                          : p.stockQuantity <= 5
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                      }`}>
                        {p.stockQuantity ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-200 font-mono whitespace-nowrap">
                      {formatCurrency(p.price, p.currency || 'INR')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {p.salePrice
                        ? <span className="text-brand-400 font-mono">{formatCurrency(p.salePrice, p.currency || 'INR')}</span>
                        : <span className="text-ink-700">—</span>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-ink-100 hover:bg-ink-800 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg text-ink-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPrev={pagination.prevPage}
        onNext={pagination.nextPage}
        onPage={pagination.goToPage}
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={() => { setModalMode(null); setSelected(null) }}
        title={modalMode === 'create' ? 'Add Product' : 'Edit Product'}
        size="xl"
      >
        <ProductForm
          defaultValues={modalMode === 'edit' ? selected : undefined}
          onSubmit={modalMode === 'edit' ? handleEdit : handleCreate}
          loading={saving}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={saving}
        title="Delete product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  )
}