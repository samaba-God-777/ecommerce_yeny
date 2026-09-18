import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
  Phone,
  User,
  Home,
  Globe,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Address {
  id: string
  fullName: string
  street: string
  apt: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  isDefault: boolean
}

const defaultAddresses: Address[] = [
  {
    id: '1',
    fullName: 'Maria Garcia',
    street: '1234 Sunset Boulevard',
    apt: 'Apt 5B',
    city: 'Los Angeles',
    state: 'California',
    zip: '90028',
    country: 'United States',
    phone: '+1 (323) 555-0147',
    isDefault: true,
  },
  {
    id: '2',
    fullName: 'Maria Garcia',
    street: '5678 Oak Avenue',
    apt: '',
    city: 'Beverly Hills',
    state: 'California',
    zip: '90210',
    country: 'United States',
    phone: '+1 (323) 555-0199',
    isDefault: false,
  },
  {
    id: '3',
    fullName: 'Maria Garcia',
    street: '910 Maple Drive',
    apt: 'Suite 200',
    city: 'Santa Monica',
    state: 'California',
    zip: '90401',
    country: 'United States',
    phone: '+1 (323) 555-0233',
    isDefault: false,
  },
]

const emptyAddress: Address = {
  id: '',
  fullName: '',
  street: '',
  apt: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  phone: '',
  isDefault: false,
}

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Mexico',
  'Brazil',
  'Argentina',
  'France',
  'Germany',
  'Spain',
  'Italy',
  'Japan',
  'Australia',
]

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>(defaultAddresses)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<Address>(emptyAddress)

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyAddress)
    setShowForm(true)
  }

  const openEditForm = (addr: Address) => {
    setEditingId(addr.id)
    setForm({ ...addr })
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(emptyAddress)
  }

  const saveAddress = () => {
    if (!form.fullName || !form.street || !form.city || !form.state || !form.zip || !form.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    if (editingId) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingId ? { ...form, id: editingId } : a))
      )
      toast.success('Address updated successfully')
    } else {
      const newAddr: Address = {
        ...form,
        id: Date.now().toString(),
        isDefault: addresses.length === 0,
      }
      setAddresses((prev) => [...prev, newAddr])
      toast.success('Address added successfully')
    }
    closeForm()
  }

  const deleteAddress = () => {
    if (!deletingId) return
    const wasDefault = addresses.find((a) => a.id === deletingId)?.isDefault
    setAddresses((prev) => {
      const remaining = prev.filter((a) => a.id !== deletingId)
      if (wasDefault && remaining.length > 0) {
        remaining[0].isDefault = true
      }
      return remaining
    })
    setDeletingId(null)
    toast.success('Address deleted')
  }

  const setAsDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    )
    toast.success('Default address updated')
  }

  const updateField = (field: keyof Address, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
              <MapPin size={22} className="text-gold-dark" />
            </div>
            <div>
              <h1 className="font-serif text-3xl text-brown">Address Book</h1>
              <p className="text-sm text-brown/60">
                Manage your shipping and billing addresses
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-full bg-gold-dark px-6 py-2.5 text-sm font-semibold text-cream shadow-md shadow-gold-dark/20 transition-colors hover:bg-gold-dark/90"
          >
            <Plus size={18} />
            Add New Address
          </motion.button>
        </motion.div>

        {/* Address List */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {addresses.map((addr) => (
            <motion.div
              key={addr.id}
              variants={fadeUp}
              layout
              className={`relative rounded-2xl border-2 p-5 transition-all ${
                addr.isDefault
                  ? 'border-gold bg-gold/5 shadow-lg shadow-gold/10'
                  : 'border-border bg-beige hover:border-gold/40 hover:shadow-md'
              }`}
            >
              {addr.isDefault && (
                <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-gold-dark px-3 py-1 text-xs font-semibold text-cream shadow-sm">
                  <Star size={12} fill="currentColor" />
                  Default
                </div>
              )}

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-brown">
                  <User size={14} className="text-gold-dark" />
                  {addr.fullName}
                </div>
                <div className="mt-2 space-y-1 text-sm text-brown/70">
                  <p className="flex items-start gap-2">
                    <Home size={14} className="mt-0.5 shrink-0 text-brown/40" />
                    <span>
                      {addr.street}
                      {addr.apt && `, ${addr.apt}`}
                    </span>
                  </p>
                  <p>
                    {addr.city}, {addr.state} {addr.zip}
                  </p>
                  <p className="flex items-center gap-2">
                    <Globe size={14} className="shrink-0 text-brown/40" />
                    {addr.country}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="shrink-0 text-brown/40" />
                    {addr.phone}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 border-t border-border pt-3">
                {!addr.isDefault && (
                  <button
                    onClick={() => setAsDefault(addr.id)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gold-dark transition-colors hover:bg-gold/10"
                  >
                    <Star size={12} />
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => openEditForm(addr)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-brown/60 transition-colors hover:bg-brown/5 hover:text-brown"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  onClick={() => setDeletingId(addr.id)}
                  className="ml-auto flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {addresses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-beige py-16"
          >
            <MapPin size={48} className="mb-4 text-brown/20" />
            <p className="font-serif text-xl text-brown/40">No addresses saved yet</p>
            <p className="mt-1 text-sm text-brown/30">
              Add your first address to get started
            </p>
          </motion.div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/30 p-4 backdrop-blur-sm"
            onClick={closeForm}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-cream shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="font-serif text-xl text-brown">
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button
                  onClick={closeForm}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-brown/40 transition-colors hover:bg-beige hover:text-brown"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Maria Garcia"
                      className="w-full rounded-lg border border-border bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={form.street}
                      onChange={(e) => updateField('street', e.target.value)}
                      placeholder="1234 Sunset Boulevard"
                      className="w-full rounded-lg border border-border bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Apartment / Suite
                    </label>
                    <input
                      type="text"
                      value={form.apt}
                      onChange={(e) => updateField('apt', e.target.value)}
                      placeholder="Apt 5B"
                      className="w-full rounded-lg border border-border bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brown">
                        City *
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => updateField('city', e.target.value)}
                        placeholder="Los Angeles"
                        className="w-full rounded-lg border border-border bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brown">
                        State / Province *
                      </label>
                      <input
                        type="text"
                        value={form.state}
                        onChange={(e) => updateField('state', e.target.value)}
                        placeholder="California"
                        className="w-full rounded-lg border border-border bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brown">
                        ZIP / Postal Code *
                      </label>
                      <input
                        type="text"
                        value={form.zip}
                        onChange={(e) => updateField('zip', e.target.value)}
                        placeholder="90028"
                        className="w-full rounded-lg border border-border bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-brown">
                        Country
                      </label>
                      <select
                        value={form.country}
                        onChange={(e) => updateField('country', e.target.value)}
                        className="w-full rounded-lg border border-border bg-beige px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-brown">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+1 (323) 555-0147"
                      className="w-full rounded-lg border border-border bg-beige px-4 py-2.5 text-sm text-brown placeholder:text-brown/30 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                    />
                  </div>

                  <label className="flex items-center gap-3 rounded-lg border border-border bg-beige px-4 py-3">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => updateField('isDefault', e.target.checked)}
                      className="h-4 w-4 rounded border-border text-gold-dark focus:ring-gold"
                    />
                    <span className="text-sm text-brown">Set as default address</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 border-t border-border px-6 py-4">
                <button
                  onClick={closeForm}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-brown/70 transition-colors hover:bg-beige"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={saveAddress}
                  className="flex-1 rounded-lg bg-gold-dark px-4 py-2.5 text-sm font-semibold text-cream shadow-md shadow-gold-dark/20 transition-colors hover:bg-gold-dark/90"
                >
                  {editingId ? 'Save Changes' : 'Add Address'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deletingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/30 p-4 backdrop-blur-sm"
            onClick={() => setDeletingId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-cream p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-serif text-lg text-brown">Delete Address?</h3>
              <p className="mt-2 text-sm text-brown/60">
                This address will be permanently removed from your address book. This action
                cannot be undone.
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeletingId(null)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-brown/70 transition-colors hover:bg-beige"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteAddress}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
