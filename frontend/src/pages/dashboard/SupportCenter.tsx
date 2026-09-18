import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Send,
  FileText,
  ExternalLink,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  HelpCircle,
  Headphones,
} from 'lucide-react'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const faqSections = [
  {
    id: 'orders',
    title: 'Orders',
    icon: FileText,
    items: [
      { q: 'How do I track my order?', a: 'Go to "My Orders" in your account dashboard. Click on any order to see real-time tracking information.' },
      { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 1 hour of placement. After that, you can request a return once delivered.' },
      { q: 'My order status hasn\'t updated', a: 'Tracking updates may take 24-48 hours. If it hasn\'t changed after 3 business days, contact support.' },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping',
    icon: Truck,
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express shipping (available at checkout) delivers in 2-3 business days.' },
      { q: 'Do you ship internationally?', a: 'Yes! We ship to over 50 countries. International shipping rates are calculated at checkout.' },
      { q: 'Shipping is free?', a: 'Free standard shipping on orders over $50. Orders under $50 have a flat $5.99 shipping fee.' },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    icon: RotateCcw,
    items: [
      { q: 'What is your return policy?', a: 'You can return unworn items within 30 days of delivery for a full refund or exchange.' },
      { q: 'How do I start a return?', a: 'Go to "My Orders", select the order, and click "Request Return". We\'ll send you a prepaid shipping label.' },
      { q: 'When will I get my refund?', a: 'Refunds are processed within 5-7 business days after we receive your return. The credit appears on your next billing statement.' },
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    icon: CreditCard,
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and bank transfers.' },
      { q: 'Is my payment information secure?', a: 'Absolutely. All transactions are encrypted with SSL and processed through PCI-DSS compliant payment gateways.' },
      { q: 'Can I use multiple payment methods?', a: 'Currently, one payment method per order is supported. You can split payments using gift cards.' },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    icon: User,
    items: [
      { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login page. We\'ll send a reset link to your registered email.' },
      { q: 'How do I update my email?', a: 'Go to Account Settings > Profile and update your email. You\'ll need to verify the new email address.' },
      { q: 'How do I delete my account?', a: 'Contact support with your request. Account deletion is permanent and cannot be undone.' },
    ],
  },
]

export default function SupportCenter() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
  })

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id)
  }

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0)

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.description) {
      toast.error('Please fill in all required fields')
      return
    }
    toast.success('Ticket submitted! We\'ll respond within 24 hours.')
    setTicketForm({ subject: '', category: '', priority: 'medium', description: '' })
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10">
          <h1 className="font-serif text-3xl text-brown">Support Center</h1>
          <p className="mt-2 text-brown/60">We're here to help. Find answers or get in touch with our team.</p>
        </motion.div>

        {/* Search + Contact Options */}
        <motion.div variants={fadeUp} className="mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brown/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full rounded-xl border border-pink-200 bg-white py-3.5 pl-11 pr-4 text-sm text-brown outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
            />
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition-all hover:border-pink-300 hover:shadow-md active:scale-95">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 text-white">
                <MessageCircle size={22} />
              </div>
              <span className="text-sm font-medium text-brown">Live Chat</span>
              <span className="text-[11px] text-brown/40">Available 24/7</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition-all hover:border-pink-300 hover:shadow-md active:scale-95">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                <Phone size={22} />
              </div>
              <span className="text-sm font-medium text-brown">WhatsApp</span>
              <span className="text-[11px] text-brown/40">+506 8888-8888</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition-all hover:border-pink-300 hover:shadow-md active:scale-95">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white">
                <Mail size={22} />
              </div>
              <span className="text-sm font-medium text-brown">Email</span>
              <span className="text-[11px] text-brown/40">support@yenyleths.com</span>
            </button>
            <button className="flex flex-col items-center gap-2 rounded-2xl border border-pink-100 bg-white p-5 shadow-sm transition-all hover:border-pink-300 hover:shadow-md active:scale-95">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 text-white">
                <Headphones size={22} />
              </div>
              <span className="text-sm font-medium text-brown">Call Us</span>
              <span className="text-[11px] text-brown/40">Mon–Fri, 9am–6pm</span>
            </button>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* FAQ Accordion */}
          <motion.div variants={fadeUp}>
            <div className="mb-4 flex items-center gap-2">
              <HelpCircle size={20} className="text-pink-500" />
              <h2 className="font-serif text-xl text-brown">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-3">
              {(searchQuery ? filteredSections : faqSections).map((section) => (
                <div key={section.id} className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
                  <button
                    onClick={() => toggleFaq(section.id)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-pink-50/50"
                  >
                    <section.icon size={18} className="shrink-0 text-pink-400" />
                    <span className="flex-1 font-medium text-brown">{section.title}</span>
                    <motion.div animate={{ rotate: openFaq === section.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} className="text-brown/40" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === section.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3 border-t border-pink-100 px-5 py-4">
                          {section.items.map((item, i) => (
                            <div key={i}>
                              <p className="font-medium text-brown">{item.q}</p>
                              <p className="mt-1 text-sm leading-relaxed text-brown/60">{item.a}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              {searchQuery && filteredSections.length === 0 && (
                <div className="rounded-2xl border border-pink-100 bg-white p-8 text-center">
                  <HelpCircle size={40} className="mx-auto mb-3 text-pink-200" />
                  <p className="text-sm text-brown/60">No results found. Try a different search or contact support.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Ticket Form + Quick Links */}
          <div className="space-y-6">
            {/* Open Ticket */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <Send size={18} className="text-pink-500" />
                <h2 className="font-serif text-lg text-brown">Submit a Ticket</h2>
              </div>
              <form onSubmit={handleTicketSubmit} className="space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-brown">Subject *</label>
                  <input
                    type="text"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-3.5 py-2.5 text-sm text-brown outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-brown">Category *</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-3.5 py-2.5 text-sm text-brown outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  >
                    <option value="">Select a category</option>
                    <option value="orders">Orders</option>
                    <option value="shipping">Shipping</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="payment">Payment</option>
                    <option value="account">Account</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-brown">Priority</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setTicketForm({ ...ticketForm, priority: p })}
                        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition ${
                          ticketForm.priority === p
                            ? 'border-pink-400 bg-pink-50 text-pink-600'
                            : 'border-pink-100 bg-white text-brown/50 hover:border-pink-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-brown">Description *</label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-pink-200 bg-pink-50/30 px-3.5 py-2.5 text-sm text-brown outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
                >
                  Submit Ticket
                </button>
              </form>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-serif text-lg text-brown">Quick Links</h2>
              <div className="space-y-2">
                {[
                  { label: 'Return Policy', icon: RotateCcw },
                  { label: 'Shipping Policy', icon: Truck },
                  { label: 'Privacy Policy', icon: FileText },
                  { label: 'Terms & Conditions', icon: FileText },
                ].map((link) => (
                  <a
                    key={link.label}
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-brown/70 transition hover:bg-pink-50 hover:text-brown"
                  >
                    <link.icon size={16} className="text-pink-400" />
                    <span className="flex-1">{link.label}</span>
                    <ExternalLink size={14} className="text-brown/30" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
