import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Crown,
  Gift,
  TrendingUp,
  History,
  Award,
  Star,
  Users,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Copy,
  Check,
  Zap,
  Package,
  Tag,
  Truck,
  Percent,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PointsEntry {
  id: string
  date: string
  description: string
  points: number
  type: 'earned' | 'redeemed'
  balance: number
}

interface Reward {
  id: string
  title: string
  description: string
  pointsCost: number
  icon: typeof Gift
  color: string
}

interface Achievement {
  id: string
  title: string
  description: string
  earned: boolean
  icon: typeof Award
  color: string
}

const pointsHistory: PointsEntry[] = [
  { id: '1', date: 'Jun 28, 2026', description: 'Purchase - Summer Collection', points: 250, type: 'earned', balance: 2450 },
  { id: '2', date: 'Jun 25, 2026', description: 'Referral Bonus - Sofia M.', points: 500, type: 'earned', balance: 2200 },
  { id: '3', date: 'Jun 22, 2026', description: 'Redeemed - $5 Off Coupon', points: -500, type: 'redeemed', balance: 1700 },
  { id: '4', date: 'Jun 18, 2026', description: 'Purchase - Evening Dress', points: 380, type: 'earned', balance: 2200 },
  { id: '5', date: 'Jun 15, 2026', description: 'Product Review', points: 50, type: 'earned', balance: 1820 },
  { id: '6', date: 'Jun 10, 2026', description: 'Purchase - Accessories Set', points: 120, type: 'earned', balance: 1770 },
  { id: '7', date: 'Jun 5, 2026', description: 'Birthday Bonus', points: 200, type: 'earned', balance: 1650 },
  { id: '8', date: 'Jun 1, 2026', description: 'Redeemed - Free Shipping', points: -300, type: 'redeemed', balance: 1450 },
]

const rewards: Reward[] = [
  { id: '1', title: '$5 Off', description: 'Get $5 off your next order', pointsCost: 500, icon: Tag, color: 'from-gold-light to-gold' },
  { id: '2', title: '$10 Off', description: 'Get $10 off your next order', pointsCost: 900, icon: Tag, color: 'from-gold to-gold-dark' },
  { id: '3', title: 'Free Shipping', description: 'Free standard shipping on any order', pointsCost: 300, icon: Truck, color: 'from-pink-300 to-pink-400' },
  { id: '4', title: '20% Off', description: '20% off your entire cart', pointsCost: 1500, icon: Percent, color: 'from-gold-dark to-rose-500' },
]

const achievements: Achievement[] = [
  { id: '1', title: 'First Purchase', description: 'Made your first order', earned: true, icon: Star, color: 'text-gold-dark' },
  { id: '2', title: '10 Orders', description: 'Completed 10 orders', earned: true, icon: Package, color: 'text-gold-dark' },
  { id: '3', title: '$500 Spent', description: 'Spent over $500 total', earned: true, icon: TrendingUp, color: 'text-gold-dark' },
  { id: '4', title: 'Review Master', description: 'Left 10 product reviews', earned: false, icon: Award, color: 'text-brown/30' },
]

const tierConfig = {
  current: 'Gold',
  next: 'Diamond',
  currentPoints: 2450,
  requiredPoints: 5000,
  perks: ['1.5x points on all purchases', 'Free shipping on orders over $50', 'Early access to sales', 'Birthday bonus: 200 pts'],
  nextPerks: ['2x points on all purchases', 'Free shipping on all orders', 'Exclusive collections access', 'Birthday bonus: 500 pts', 'Personal stylist consultations'],
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

export default function LoyaltyProgram() {
  const [activeTab, setActiveTab] = useState<'history' | 'rewards' | 'achievements'>('history')
  const [redeemingId, setRedeemingId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const referralCode = 'YENYLETHS-MARIA'

  const progress = (tierConfig.currentPoints / tierConfig.requiredPoints) * 100

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    toast.success('Referral code copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRedeem = (reward: Reward) => {
    if (tierConfig.currentPoints < reward.pointsCost) {
      toast.error('Not enough points to redeem this reward')
      return
    }
    setRedeemingId(reward.id)
  }

  const confirmRedeem = () => {
    setRedeemingId(null)
    toast.success('Reward redeemed successfully! Check your email for the code.')
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
              <Crown size={22} className="text-gold-dark" />
            </div>
            <div>
              <h1 className="font-serif text-3xl text-brown">Loyalty Program</h1>
              <p className="text-sm text-brown/60">
                Earn points, unlock rewards, and enjoy exclusive perks
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tier Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-gold-dark via-gold to-gold-light p-6 text-cream shadow-xl shadow-gold-dark/20 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Crown size={24} className="text-cream/80" />
                <span className="text-sm font-medium uppercase tracking-wider text-cream/70">
                  {tierConfig.current} Member
                </span>
              </div>
              <p className="font-serif text-4xl font-bold sm:text-5xl">
                {tierConfig.currentPoints.toLocaleString()} pts
              </p>
              <p className="mt-2 text-sm text-cream/70">
                {(tierConfig.requiredPoints - tierConfig.currentPoints).toLocaleString()} points
                to reach {tierConfig.next}
              </p>
            </div>

            <div className="flex-1 max-w-md">
              <div className="mb-2 flex justify-between text-xs font-medium text-cream/70">
                <span>{tierConfig.current}</span>
                <span>{tierConfig.next}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-cream/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                  className="h-full rounded-full bg-cream shadow-lg"
                />
              </div>
              <p className="mt-2 text-right text-xs text-cream/60">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>

          {/* Tier Perks */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tierConfig.perks.map((perk, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-cream/10 px-3 py-2.5 text-xs"
              >
                <Sparkles size={14} className="mt-0.5 shrink-0 text-cream/60" />
                <span className="text-cream/80">{perk}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex gap-1 rounded-xl bg-beige p-1"
        >
          {([
            { id: 'history' as const, label: 'Points History', icon: History },
            { id: 'rewards' as const, label: 'Rewards', icon: Gift },
            { id: 'achievements' as const, label: 'Achievements', icon: Award },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-cream text-brown shadow-sm'
                  : 'text-brown/50 hover:text-brown/70'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Points History Tab */}
        <AnimatePresence mode="wait">
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl border border-border bg-beige"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brown/50">
                        Date
                      </th>
                      <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-brown/50">
                        Description
                      </th>
                      <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-brown/50">
                        Points
                      </th>
                      <th className="hidden px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-brown/50 sm:table-cell">
                        Balance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pointsHistory.map((entry, i) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-border/50 last:border-b-0"
                      >
                        <td className="whitespace-nowrap px-5 py-3.5 text-sm text-brown/60">
                          {entry.date}
                        </td>
                        <td className="px-5 py-3.5 text-sm font-medium text-brown">
                          {entry.description}
                        </td>
                        <td className="whitespace-nowrap px-5 py-3.5 text-right">
                          <span className="inline-flex items-center gap-1 text-sm font-semibold">
                            {entry.type === 'earned' ? (
                              <ArrowUpRight size={14} className="text-emerald-500" />
                            ) : (
                              <ArrowDownRight size={14} className="text-red-400" />
                            )}
                            <span
                              className={
                                entry.type === 'earned' ? 'text-emerald-600' : 'text-red-500'
                              }
                            >
                              {entry.type === 'earned' ? '+' : ''}
                              {entry.points}
                            </span>
                          </span>
                        </td>
                        <td className="hidden whitespace-nowrap px-5 py-3.5 text-right text-sm font-medium text-brown/70 sm:table-cell">
                          {entry.balance.toLocaleString()}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Rewards Tab */}
          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:grid-cols-2"
              >
                {rewards.map((reward) => {
                  const Icon = reward.icon
                  const canAfford = tierConfig.currentPoints >= reward.pointsCost
                  return (
                    <motion.div
                      key={reward.id}
                      variants={fadeUp}
                      className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all ${
                        canAfford
                          ? 'border-border bg-beige hover:border-gold/40 hover:shadow-lg'
                          : 'border-border/50 bg-beige/50 opacity-60'
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${reward.color} text-cream shadow-md`}
                        >
                          <Icon size={20} />
                        </div>
                        <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-dark">
                          {reward.pointsCost} pts
                        </span>
                      </div>
                      <h3 className="font-serif text-lg text-brown">{reward.title}</h3>
                      <p className="mt-1 text-sm text-brown/60">{reward.description}</p>
                      <motion.button
                        whileHover={canAfford ? { scale: 1.02 } : {}}
                        whileTap={canAfford ? { scale: 0.98 } : {}}
                        onClick={() => canAfford && handleRedeem(reward)}
                        disabled={!canAfford}
                        className={`mt-4 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                          canAfford
                            ? 'bg-gold-dark text-cream shadow-md shadow-gold-dark/20 hover:bg-gold-dark/90'
                            : 'cursor-not-allowed bg-brown/5 text-brown/30'
                        }`}
                      >
                        {canAfford ? 'Redeem' : 'Not enough points'}
                      </motion.button>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:grid-cols-2"
              >
                {achievements.map((ach) => {
                  const Icon = ach.icon
                  return (
                    <motion.div
                      key={ach.id}
                      variants={fadeUp}
                      className={`relative overflow-hidden rounded-2xl border-2 p-5 transition-all ${
                        ach.earned
                          ? 'border-gold/30 bg-beige shadow-md'
                          : 'border-border/50 bg-beige/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${
                            ach.earned
                              ? 'bg-gold/10'
                              : 'bg-brown/5'
                          }`}
                        >
                          <Icon
                            size={24}
                            className={ach.earned ? 'text-gold-dark' : 'text-brown/20'}
                          />
                        </div>
                        <div>
                          <h3 className={`font-serif text-lg ${ach.earned ? 'text-brown' : 'text-brown/40'}`}>
                            {ach.title}
                          </h3>
                          <p className={`text-sm ${ach.earned ? 'text-brown/60' : 'text-brown/30'}`}>
                            {ach.description}
                          </p>
                          {ach.earned ? (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold-dark">
                              <Check size={12} />
                              Earned
                            </span>
                          ) : (
                            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brown/5 px-2.5 py-0.5 text-xs font-medium text-brown/30">
                              Locked
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-2xl border-2 border-dashed border-gold/30 bg-gradient-to-br from-gold/5 to-gold/10 p-6 sm:p-8"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold/10">
                <Users size={24} className="text-gold-dark" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-brown">Refer a Friend</h3>
                <p className="mt-1 max-w-md text-sm text-brown/60">
                  Share your referral code and earn <strong className="text-gold-dark">500 points</strong> for
                  each friend who makes their first purchase.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-cream px-4 py-2.5">
                    <code className="font-mono text-sm font-bold tracking-wider text-brown">
                      {referralCode}
                    </code>
                    <button
                      onClick={handleCopyCode}
                      className="ml-1 rounded p-1 text-brown/40 transition-colors hover:bg-beige hover:text-brown"
                    >
                      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-semibold text-gold-dark">
                    <Zap size={14} />
                    500 pts per referral
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            { label: 'Total Earned', value: '8,200', sub: 'Lifetime points', icon: TrendingUp },
            { label: 'Total Redeemed', value: '5,750', sub: 'Points used', icon: Gift },
            { label: 'Referrals', value: '3', sub: 'Friends invited', icon: Users },
            { label: 'Orders', value: '18', sub: 'Qualifying orders', icon: Package },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              className="rounded-2xl border border-border bg-beige p-4"
            >
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gold/10">
                <stat.icon size={14} className="text-gold-dark" />
              </div>
              <p className="font-serif text-2xl text-brown">{stat.value}</p>
              <p className="text-xs text-brown/50">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Redeem Confirmation */}
      <AnimatePresence>
        {redeemingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brown/30 p-4 backdrop-blur-sm"
            onClick={() => setRedeemingId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl bg-cream p-6 shadow-2xl"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gold/10">
                <Gift size={20} className="text-gold-dark" />
              </div>
              <h3 className="font-serif text-lg text-brown">Redeem Reward?</h3>
              {(() => {
                const reward = rewards.find((r) => r.id === redeemingId)
                if (!reward) return null
                return (
                  <div className="mt-3 rounded-lg bg-beige p-3">
                    <p className="text-sm font-semibold text-brown">{reward.title}</p>
                    <p className="text-xs text-brown/60">{reward.description}</p>
                    <p className="mt-1 text-xs font-semibold text-gold-dark">
                      Cost: {reward.pointsCost} points
                    </p>
                  </div>
                )
              })()}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setRedeemingId(null)}
                  className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-brown/70 transition-colors hover:bg-beige"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRedeem}
                  className="flex-1 rounded-lg bg-gold-dark px-4 py-2.5 text-sm font-semibold text-cream shadow-md shadow-gold-dark/20 transition-colors hover:bg-gold-dark/90"
                >
                  Redeem Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
