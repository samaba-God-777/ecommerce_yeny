import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Megaphone,
  Ticket,
  Mail,
  Image,
  Gift,
  Plus,
  Settings,
  BarChart3,
  Star,
  Copy,
  Trash2,
  Eye,
  MousePointerClick,
  X,
  MailOpen,
  Send,
} from 'lucide-react'
import Modal from './ui/Modal'
import { toast } from 'react-hot-toast'
import api from '../lib/api'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

const initialBanners = [
  { id: '1', title: 'Summer Sale', status: 'active', views: 12400, clicks: 890 },
  { id: '2', title: 'Nueva Colección', status: 'active', views: 8900, clicks: 654 },
  { id: '3', title: 'Flash Sale - 48h', status: 'scheduled', views: 0, clicks: 0 },
]

const initialCampaigns = [
  { name: 'Summer Collection', type: 'Email', status: 'active', sent: 1240, opened: 890, clicked: 342 },
  { name: 'Flash Sale Alert', type: 'Push', status: 'completed', sent: 2100, opened: 1650, clicked: 890 },
  { name: 'Bienvenida VIP', type: 'Auto', status: 'active', sent: 45, opened: 42, clicked: 28 },
]

interface Coupon {
  id: string
  code: string
  discount: number
  type: string
  uses: number
  maxUses: number
  expires: string
  active: boolean
}

export default function MarketingPage() {
  const [activeSection, setActiveSection] = useState('coupons')

  // States
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [banners, setBanners] = useState(initialBanners)
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [couponsLoading, setCouponsLoading] = useState(true)

  // Newsletter form states
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [newsletterPreviewOpen, setNewsletterPreviewOpen] = useState(false)

  // Modal control states
  const [couponModalOpen, setCouponModalOpen] = useState(false)
  const [bannerModalOpen, setBannerModalOpen] = useState(false)
  const [campaignModalOpen, setCampaignModalOpen] = useState(false)

  // Modal form states
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount: 10,
    type: 'percent',
    maxUses: 100,
    expires: '',
    active: true,
  })

  const [editingBanner, setEditingBanner] = useState<any | null>(null)
  const [bannerForm, setBannerForm] = useState({
    id: '',
    title: '',
    status: 'active',
  })

  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: 'Email',
    sent: 100,
  })

  // Fetch coupons from API
  const fetchCoupons = async () => {
    setCouponsLoading(true)
    try {
      const { data } = await api.get('/coupons')
      setCoupons(Array.isArray(data) ? data : data.coupons || [])
    } catch {
      // keep existing data on error
    } finally {
      setCouponsLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  // Clipboard functionality
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Código "${code}" copiado al portapapeles`)
  }

  // Coupon Actions
  const handleToggleCoupon = async (id: string) => {
    const coupon = coupons.find(c => c.id === id)
    if (!coupon) return
    try {
      await api.patch(`/coupons/${id}`, { active: !coupon.active })
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
      toast.success(`Cupón ${!coupon.active ? 'activado' : 'desactivado'}`)
    } catch {
      toast.error('Error al cambiar estado del cupón')
    }
  }

  const handleDeleteCoupon = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cupón?')) return
    try {
      await api.delete(`/coupons/${id}`)
      setCoupons(prev => prev.filter(c => c.id !== id))
      toast.success('Cupón eliminado')
    } catch {
      toast.error('Error al eliminar el cupón')
    }
  }

  const handleOpenNewCouponModal = () => {
    setEditingCoupon(null)
    setCouponForm({
      code: '',
      discount: 10,
      type: 'percent',
      maxUses: 100,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
    })
    setCouponModalOpen(true)
  }

  const handleOpenEditCouponModal = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setCouponForm({
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type,
      maxUses: coupon.maxUses,
      expires: coupon.expires,
      active: coupon.active,
    })
    setCouponModalOpen(true)
  }

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!couponForm.code.trim()) {
      toast.error('El código es requerido')
      return
    }

    const codeUpper = couponForm.code.trim().toUpperCase()

    try {
      if (editingCoupon) {
        await api.put(`/coupons/${editingCoupon.id}`, {
          ...couponForm,
          code: codeUpper,
        })
        toast.success('Cupón actualizado exitosamente')
      } else {
        await api.post('/coupons', {
          ...couponForm,
          code: codeUpper,
        })
        toast.success('Cupón creado exitosamente')
      }
      fetchCoupons()
      setCouponModalOpen(false)
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Error al guardar el cupón')
    }
  }

  // Banner Actions
  const handleToggleBanner = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? {
      ...b,
      status: b.status === 'active' ? 'scheduled' : 'active'
    } : b))
    toast.success('Estado del banner cambiado')
  }

  const handleDeleteBanner = (id: string) => {
    if (window.confirm('¿Deseas eliminar este banner publicitario?')) {
      setBanners(prev => prev.filter(b => b.id !== id))
      toast.success('Banner eliminado')
    }
  }

  const handleOpenNewBannerModal = () => {
    setEditingBanner(null)
    setBannerForm({ id: '', title: '', status: 'active' })
    setBannerModalOpen(true)
  }

  const handleOpenEditBannerModal = (banner: any) => {
    setEditingBanner(banner)
    setBannerForm({ id: banner.id, title: banner.title, status: banner.status })
    setBannerModalOpen(true)
  }

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bannerForm.title.trim()) {
      toast.error('El título es requerido')
      return
    }

    if (editingBanner) {
      setBanners(prev => prev.map(b => b.id === editingBanner.id ? {
        ...b,
        title: bannerForm.title.trim(),
        status: bannerForm.status
      } : b))
      toast.success('Banner actualizado')
    } else {
      const newBanner = {
        id: Date.now().toString(),
        title: bannerForm.title.trim(),
        status: bannerForm.status,
        views: 0,
        clicks: 0,
      }
      setBanners(prev => [newBanner, ...prev])
      toast.success('Banner creado exitosamente')
    }
    setBannerModalOpen(false)
  }

  // Campaign Actions
  const handleOpenNewCampaignModal = () => {
    setCampaignForm({ name: '', type: 'Email', sent: 100 })
    setCampaignModalOpen(true)
  }

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaignForm.name.trim()) {
      toast.error('El nombre de la campaña es requerido')
      return
    }

    const newCampaign = {
      name: campaignForm.name.trim(),
      type: campaignForm.type,
      status: 'active',
      sent: Number(campaignForm.sent) || 0,
      opened: 0,
      clicked: 0,
    }
    setCampaigns(prev => [newCampaign, ...prev])
    toast.success('Campaña iniciada exitosamente')
    setCampaignModalOpen(false)
  }

  // Newsletter Actions
  const handleSendNewsletter = () => {
    if (!subject.trim()) {
      toast.error('Ingresa un asunto para el boletín')
      return
    }
    if (!message.trim()) {
      toast.error('Escribe el mensaje para el boletín')
      return
    }

    const loadId = toast.loading('Enviando boletín informativo a los suscriptores...')

    setTimeout(() => {
      toast.dismiss(loadId)
      toast.success('Boletín enviado con éxito a 854 suscriptores activos')
      setSubject('')
      setMessage('')
    }, 2000)
  }

  const handleOpenNewsletterPreview = () => {
    if (!subject.trim()) {
      toast.error('Ingresa un asunto para poder previsualizar')
      return
    }
    if (!message.trim()) {
      toast.error('Escribe un mensaje para poder previsualizar')
      return
    }
    setNewsletterPreviewOpen(true)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1 w-fit">
        {[
          { id: 'coupons', label: 'Cupones', icon: Ticket },
          { id: 'banners', label: 'Banners', icon: Image },
          { id: 'campaigns', label: 'Campañas', icon: Megaphone },
          { id: 'newsletter', label: 'Newsletter', icon: Mail },
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeSection === tab.id ? 'bg-market text-white shadow-lg shadow-market/25' : 'text-muted-foreground hover:bg-muted'}`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Coupons */}
      {activeSection === 'coupons' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground font-serif">Cupones de Descuento</h3>
            <button onClick={handleOpenNewCouponModal} className="flex items-center gap-2 px-4 py-2.5 bg-market text-white rounded-xl text-sm font-semibold hover:bg-market-deep transition-colors shadow-lg shadow-market/25 cursor-pointer">
              <Plus className="h-4 w-4" /> Nuevo Cupón
            </button>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Código</th>
                    <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Descuento</th>
                    <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Usos</th>
                    <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Expira</th>
                    <th className="text-left text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Estado</th>
                    <th className="text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-5 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {couponsLoading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-sm text-muted-foreground">Cargando cupones...</td>
                    </tr>
                  ) : coupons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-sm text-muted-foreground">No hay cupones registrados. ¡Crea uno nuevo!</td>
                    </tr>
                  ) : (
                    coupons.map(c => (
                      <tr key={c.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-foreground bg-muted px-2.5 py-1 rounded-lg">{c.code}</span>
                            <button onClick={() => handleCopyCode(c.code)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Copiar código"><Copy className="h-3.5 w-3.5" /></button>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-bold text-foreground">
                          {c.type === 'percent' ? `${c.discount}%` : `$${c.discount.toLocaleString('es-DO')}`}
                        </td>
                        <td className="px-5 py-4 text-sm text-foreground">{c.uses}/{c.maxUses}</td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">{new Date(c.expires).toLocaleDateString('es-DO')}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleCoupon(c.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${c.active ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200' : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100'}`}
                            title="Hacer clic para alternar"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${c.active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            {c.active ? 'Activo' : 'Inactivo'}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenEditCouponModal(c)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title="Editar cupón"><Settings className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteCoupon(c.id)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors cursor-pointer" title="Eliminar cupón"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Banners */}
      {activeSection === 'banners' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground font-serif">Banners Publicitarios</h3>
            <button onClick={handleOpenNewBannerModal} className="flex items-center gap-2 px-4 py-2.5 bg-market text-white rounded-xl text-sm font-semibold hover:bg-market-deep transition-colors shadow-lg shadow-market/25 cursor-pointer">
              <Plus className="h-4 w-4" /> Nuevo Banner
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banners.map(b => (
              <div key={b.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all relative overflow-hidden group">
                <div className="w-full h-32 bg-gradient-to-br from-market/10 to-market/20 dark:from-market/30 dark:to-market/30 rounded-xl mb-4 flex items-center justify-center relative">
                  <Image className="h-8 w-8 text-market group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 bg-black/10 dark:bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <span className="text-white text-xs font-semibold px-2.5 py-1 bg-market/90 rounded-full">Banner de Tienda</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">{b.title}</h4>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {b.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><MousePointerClick className="h-3.5 w-3.5" /> {b.clicks.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <button
                    onClick={() => handleToggleBanner(b.id)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded transition-colors cursor-pointer ${b.status === 'active' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/40 dark:bg-emerald-950/20' : 'text-amber-600 dark:text-amber-400 bg-amber-100/40 dark:bg-amber-950/20'}`}
                    title="Clic para cambiar estado"
                  >
                    {b.status === 'active' ? 'Activo' : 'Programado'}
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEditBannerModal(b)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer" title="Editar banner"><Settings className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDeleteBanner(b.id)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive cursor-pointer" title="Eliminar banner"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
            {banners.length === 0 && (
              <div className="col-span-full text-center py-12 text-sm text-muted-foreground">No hay banners configurados en este momento.</div>
            )}
          </div>
        </motion.div>
      )}

      {/* Campaigns */}
      {activeSection === 'campaigns' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground font-serif">Campañas</h3>
            <button onClick={handleOpenNewCampaignModal} className="flex items-center gap-2 px-4 py-2.5 bg-market text-white rounded-xl text-sm font-semibold hover:bg-market-deep transition-colors shadow-lg shadow-market/25 cursor-pointer">
              <Plus className="h-4 w-4" /> Nueva Campaña
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(c => (
              <div key={c.name} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-market">{c.type}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${c.status === 'active' ? 'text-emerald-500 bg-emerald-50' : 'text-muted-foreground bg-muted'}`}>
                    {c.status === 'active' ? 'Activa' : 'Completada'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-foreground mb-3">{c.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Enviados</span>
                    <span className="font-semibold text-foreground">{c.sent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Abiertos</span>
                    <span className="font-semibold text-foreground">{c.sent > 0 ? `${c.opened.toLocaleString()} (${Math.round(c.opened / c.sent * 100)}%)` : '0%'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Clics</span>
                    <span className="font-semibold text-foreground">{c.sent > 0 ? `${c.clicked.toLocaleString()} (${Math.round(c.clicked / c.sent * 100)}%)` : '0%'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Newsletter */}
      {activeSection === 'newsletter' && (
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-card border border-border rounded-2xl p-6 max-w-2xl shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <MailOpen className="h-5 w-5 text-market" />
            <h3 className="text-lg font-bold text-foreground font-serif">Newsletter</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Envía ofertas, noticias y actualizaciones a tus suscriptores de correo electrónico.</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-foreground">Asunto del Correo</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ej: ¡Gran venta de liquidación de Verano! 🌸 - 50% OFF"
                className="w-full mt-1 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground">Contenido del Mensaje</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tu boletín de noticias detallado aquí..."
                className="w-full mt-1 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSendNewsletter}
                className="flex items-center gap-2 px-6 py-2.5 bg-market text-white rounded-xl text-sm font-semibold hover:bg-market-deep transition-colors shadow-lg shadow-market/25 cursor-pointer"
              >
                <Send className="h-4 w-4" /> Enviar Newsletter
              </button>
              <button
                onClick={handleOpenNewsletterPreview}
                className="flex items-center gap-2 px-6 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
              >
                <Eye className="h-4 w-4" /> Vista Previa
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Coupon Creation/Edition Modal */}
      <Modal isOpen={couponModalOpen} onClose={() => setCouponModalOpen(false)} title={editingCoupon ? 'Editar Cupón de Descuento' : 'Nuevo Cupón de Descuento'}>
        <form onSubmit={handleSaveCoupon} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Código de Cupón</label>
            <input
              type="text"
              required
              placeholder="Ej: VERANO30"
              value={couponForm.code}
              onChange={e => setCouponForm(prev => ({ ...prev, code: e.target.value }))}
              className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Tipo</label>
              <select
                value={couponForm.type}
                onChange={e => setCouponForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
              >
                <option value="percent">Porcentaje (%)</option>
                <option value="fixed">Fijo ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Descuento</label>
              <input
                type="number"
                min="1"
                required
                value={couponForm.discount}
                onChange={e => setCouponForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
                className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Uso Máximo</label>
              <input
                type="number"
                min="1"
                required
                value={couponForm.maxUses}
                onChange={e => setCouponForm(prev => ({ ...prev, maxUses: Number(e.target.value) }))}
                className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Expira</label>
              <input
                type="date"
                required
                value={couponForm.expires}
                onChange={e => setCouponForm(prev => ({ ...prev, expires: e.target.value }))}
                className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="couponActive"
              checked={couponForm.active}
              onChange={e => setCouponForm(prev => ({ ...prev, active: e.target.checked }))}
              className="w-4 h-4 rounded text-market accent-market focus:ring-market"
            />
            <label htmlFor="couponActive" className="text-sm font-semibold text-foreground cursor-pointer">Cupón Activo</label>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <button type="button" onClick={() => setCouponModalOpen(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-market text-white rounded-xl text-sm font-semibold hover:bg-market-deep transition-colors shadow-lg shadow-market/25 cursor-pointer">Guardar</button>
          </div>
        </form>
      </Modal>

      {/* Banner Creation/Edition Modal */}
      <Modal isOpen={bannerModalOpen} onClose={() => setBannerModalOpen(false)} title={editingBanner ? 'Editar Banner Publicitario' : 'Nuevo Banner Publicitario'}>
        <form onSubmit={handleSaveBanner} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Título del Banner</label>
            <input
              type="text"
              required
              placeholder="Ej: Mega Descuento Fin de Año"
              value={bannerForm.title}
              onChange={e => setBannerForm(prev => ({ ...prev, title: e.target.value }))}
              className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Estado Inicial</label>
            <select
              value={bannerForm.status}
              onChange={e => setBannerForm(prev => ({ ...prev, status: e.target.value }))}
              className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
            >
              <option value="active">Activo (Publicado)</option>
              <option value="scheduled">Programado (Borrador)</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <button type="button" onClick={() => setBannerModalOpen(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-market text-white rounded-xl text-sm font-semibold hover:bg-market-deep transition-colors shadow-lg shadow-market/25 cursor-pointer">Guardar</button>
          </div>
        </form>
      </Modal>

      {/* Campaign Creation Modal */}
      <Modal isOpen={campaignModalOpen} onClose={() => setCampaignModalOpen(false)} title="Crear Nueva Campaña">
        <form onSubmit={handleSaveCampaign} className="space-y-4 mt-2">
          <div>
            <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Nombre de la Campaña</label>
            <input
              type="text"
              required
              placeholder="Ej: Rebajas Otoño 2026"
              value={campaignForm.name}
              onChange={e => setCampaignForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Tipo de Canal</label>
              <select
                value={campaignForm.type}
                onChange={e => setCampaignForm(prev => ({ ...prev, type: e.target.value }))}
                className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
              >
                <option value="Email">Correo Electrónico</option>
                <option value="Push">Notificación Push</option>
                <option value="SMS">Mensaje SMS</option>
                <option value="Auto">Automatización</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-foreground uppercase tracking-wide">Público Estimado</label>
              <input
                type="number"
                min="1"
                required
                value={campaignForm.sent}
                onChange={e => setCampaignForm(prev => ({ ...prev, sent: Number(e.target.value) }))}
                className="w-full mt-1 px-3.5 py-2 bg-muted/50 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-market"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <button type="button" onClick={() => setCampaignModalOpen(false)} className="px-4 py-2 border border-border rounded-xl text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors cursor-pointer">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-market text-white rounded-xl text-sm font-semibold hover:bg-market-deep transition-colors shadow-lg shadow-market/25 cursor-pointer">Iniciar Campaña</button>
          </div>
        </form>
      </Modal>

      {/* Newsletter Preview Modal */}
      <Modal isOpen={newsletterPreviewOpen} onClose={() => setNewsletterPreviewOpen(false)} title="Vista Previa de Newsletter">
        <div className="mt-2 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <p className="text-[11px] text-muted-foreground">Esta es una representación de cómo los suscriptores recibirán el correo en sus bandejas de entrada.</p>
          <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-white text-ink">
            <div className="bg-muted p-4 border-b border-border text-xs text-muted-foreground space-y-1">
              <div><span className="font-semibold text-ink-soft">De:</span> Yenyleths Boutique &lt;info@yenyleths.com&gt;</div>
              <div><span className="font-semibold text-ink-soft">Para:</span> suscriptor@email.com</div>
              <div><span className="font-semibold text-ink-soft">Asunto:</span> {subject}</div>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center py-4 border-b-2 border-market">
                <span className="text-2xl font-bold font-serif text-market-deep tracking-wider">YENYLETHS</span>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Boutique Femenina Premium</p>
              </div>
              <div className="text-sm leading-relaxed text-ink-soft whitespace-pre-line font-sans">{message}</div>
              <div className="text-center py-4">
                <a href="#" className="inline-block px-8 py-3 bg-market hover:bg-market-deep text-white font-semibold rounded-lg text-sm shadow-md transition-colors" onClick={e => e.preventDefault()}>Ver la Colección en la Tienda</a>
              </div>
              <div className="text-center pt-6 border-t border-border text-[10px] text-muted-foreground space-y-1 font-sans">
                <p>© 2026 Yenyleths Boutique. Todos los derechos reservados.</p>
                <p>Recibiste este correo porque estás suscrito a nuestro boletín. Si deseas cancelar tu suscripción, haz <a href="#" className="text-market underline" onClick={e => e.preventDefault()}>clic aquí</a>.</p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
            <button onClick={() => setNewsletterPreviewOpen(false)} className="px-5 py-2.5 bg-ink text-white rounded-xl text-sm font-semibold hover:bg-market transition-colors shadow cursor-pointer">Cerrar Vista Previa</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
