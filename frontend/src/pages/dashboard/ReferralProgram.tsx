import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Copy,
  Share2,
  Users,
  DollarSign,
  Clock,
  Wallet,
  Check,
  ExternalLink,
  Smartphone,
  Mail,
  MessageCircle,
  AtSign,
  Award,
  ArrowRight,
  Sparkles,
  Gift,
} from 'lucide-react'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const stats = [
  { label: 'Friends Joined', value: '12', icon: Users, color: 'from-pink-400 to-pink-500' },
  { label: 'Total Earnings', value: '$60', icon: DollarSign, color: 'from-pink-300 to-pink-400' },
  { label: 'Pending', value: '$50', icon: Clock, color: 'from-pink-400 to-pink-500' },
  { label: 'Available', value: '$10', icon: Wallet, color: 'from-emerald-400 to-emerald-500' },
]

const tiers = [
  { name: 'Bronze', range: '0–5 friends', commission: '5%', color: 'bg-amber-600', icon: '🥉' },
  { name: 'Silver', range: '6–15 friends', commission: '8%', color: 'bg-gray-400', icon: '🥈' },
  { name: 'Gold', range: '16–30 friends', commission: '12%', color: 'bg-yellow-500', icon: '🥇' },
  { name: 'Diamond', range: '31+ friends', commission: '15%', color: 'from-cyan-400 to-blue-500', icon: '💎' },
]

const commissionHistory = [
  { id: 1, date: 'Jun 28, 2026', friend: 'Maria L.', purchase: '$45.00', commission: '$5.40', status: 'Paid' },
  { id: 2, date: 'Jun 22, 2026', friend: 'Ana R.', purchase: '$32.00', commission: '$3.84', status: 'Paid' },
  { id: 3, date: 'Jun 15, 2026', friend: 'Sofia P.', purchase: '$67.00', commission: '$8.04', status: 'Pending' },
  { id: 4, date: 'Jun 10, 2026', friend: 'Laura M.', purchase: '$28.00', commission: '$3.36', status: 'Paid' },
  { id: 5, date: 'Jun 3, 2026', friend: 'Camila V.', purchase: '$55.00', commission: '$6.60', status: 'Pending' },
]

const steps = [
  {
    number: '01',
    title: 'Share Your Link',
    description: 'Send your unique referral link to friends via WhatsApp, email, or social media.',
    icon: Share2,
  },
  {
    number: '02',
    title: 'Friend Signs Up',
    description: 'Your friend creates an account using your link and makes their first purchase.',
    icon: Users,
  },
  {
    number: '03',
    title: 'Earn Rewards',
    description: 'You both earn store credits. Higher tiers unlock bigger commission rates.',
    icon: Gift,
  },
]

const currentTier = 0 // Bronze
const referralLink = 'https://yenyleths.com/ref/YENY-ABC123'

export default function ReferralProgram() {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    toast.success('Referral link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10">
          <h1 className="font-serif text-3xl text-brown">Refer & Earn</h1>
          <p className="mt-2 text-brown/60">
            Invite friends to Yenyleths Boutique and earn rewards for every purchase they make.
          </p>
        </motion.div>

        {/* Referral Link + QR */}
        <motion.div variants={fadeUp} className="mb-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Link */}
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-lg text-brown">Your Referral Link</h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 overflow-hidden rounded-xl border border-pink-200 bg-pink-50/50 px-4 py-3">
                <p className="truncate font-mono text-sm text-brown/80">{referralLink}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            {/* Share Buttons */}
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600">
                <MessageCircle size={16} /> WhatsApp
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700">
                <ExternalLink size={16} /> Facebook
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-600">
                <AtSign size={16} /> Twitter
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-brown px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-brown/90">
                <Mail size={16} /> Email
              </button>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 font-serif text-lg text-brown">QR Code</h3>
            <div className="relative h-48 w-48 rounded-xl border-2 border-dashed border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100">
              {/* Decorative QR pattern */}
              <div className="absolute inset-3 grid grid-cols-8 grid-rows-8 gap-1">
                {Array.from({ length: 64 }).map((_, i) => {
                  const isCorner =
                    (i < 3 || (i >= 5 && i < 8)) && (Math.floor(i / 8) < 3) ||
                    (i % 8 < 3 || (i % 8 >= 5 && i % 8 < 8)) && (Math.floor(i / 8) < 3) ||
                    (i % 8 < 3) && (Math.floor(i / 8) >= 5)
                  const show = isCorner || Math.random() > 0.4
                  return (
                    <div
                      key={i}
                      className={`rounded-sm ${show ? 'bg-brown/70' : 'bg-pink-200/50'}`}
                    />
                  )
                })}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-lg bg-white p-1.5 shadow-sm">
                  <Smartphone size={20} className="text-pink-400" />
                </div>
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-brown/50">Scan to join with your link</p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon size={20} />
              </div>
              <p className="text-2xl font-bold text-brown">{stat.value}</p>
              <p className="mt-0.5 text-sm text-brown/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Referral Tiers */}
        <motion.div variants={fadeUp} className="mb-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Award size={20} className="text-pink-500" />
            <h2 className="font-serif text-xl text-brown">Referral Tiers</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier, i) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border-2 p-5 transition-all ${
                  i === currentTier
                    ? 'border-pink-400 bg-pink-50 shadow-md'
                    : 'border-pink-100 bg-white hover:border-pink-200'
                }`}
              >
                {i === currentTier && (
                  <span className="absolute -top-2.5 left-4 rounded-full bg-pink-400 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white">
                    Current
                  </span>
                )}
                <div className="mb-3 text-2xl">{tier.icon}</div>
                <h3 className="font-serif text-lg font-bold text-brown">{tier.name}</h3>
                <p className="mt-1 text-xs text-brown/50">{tier.range}</p>
                <div className="mt-3 flex items-center gap-1">
                  <span className="text-lg font-bold text-pink-500">{tier.commission}</span>
                  <span className="text-xs text-brown/40">commission</span>
                </div>
              </div>
            ))}
          </div>
          {/* Progress to next tier */}
          <div className="mt-6 rounded-xl bg-pink-50/50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-brown/70">Progress to Silver</span>
              <span className="font-semibold text-pink-500">12 / 15 friends</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-pink-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-pink-500"
              />
            </div>
            <p className="mt-2 text-xs text-brown/50">3 more friends to unlock Silver tier (8% commission)</p>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div variants={fadeUp} className="mb-8">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles size={20} className="text-pink-500" />
            <h2 className="font-serif text-xl text-brown">How It Works</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.number} className="relative rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white">
                  <step.icon size={22} />
                </div>
                <span className="font-serif text-4xl font-bold text-pink-200">{step.number}</span>
                <h3 className="mt-2 font-serif text-lg font-bold text-brown">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brown/60">{step.description}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute right-4 top-1/2 hidden -translate-y-1/2 text-pink-200 md:block" size={24} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Commission History */}
        <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <h2 className="mb-6 font-serif text-xl text-brown">Commission History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-pink-100">
                  <th className="pb-3 font-medium text-brown/50">Date</th>
                  <th className="pb-3 font-medium text-brown/50">Friend</th>
                  <th className="pb-3 font-medium text-brown/50">Purchase</th>
                  <th className="pb-3 font-medium text-brown/50">Commission</th>
                  <th className="pb-3 font-medium text-brown/50">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissionHistory.map((row) => (
                  <tr key={row.id} className="border-b border-pink-50 last:border-0">
                    <td className="py-3.5 text-brown/70">{row.date}</td>
                    <td className="py-3.5 font-medium text-brown">{row.friend}</td>
                    <td className="py-3.5 text-brown/70">{row.purchase}</td>
                    <td className="py-3.5 font-semibold text-brown">{row.commission}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          row.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-pink-50 text-pink-600'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
