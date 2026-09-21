import { useState } from 'react'
import { motion,} from 'framer-motion'
import {
  Shield,
  Fingerprint,
  Smartphone,
  Laptop,
  Monitor,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Key,
  Bell,
  LogOut,
} from 'lucide-react'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const loginHistory = [
  { id: 1, date: 'Jun 28, 2026', time: '2:30 PM', device: 'iPhone 15 Pro', location: 'San José, CR', ip: '192.168.1.***', status: 'success' },
  { id: 2, date: 'Jun 27, 2026', time: '9:15 AM', device: 'MacBook Pro', location: 'San José, CR', ip: '192.168.1.***', status: 'success' },
  { id: 3, date: 'Jun 25, 2026', time: '6:45 PM', device: 'Chrome / Windows', location: 'Heredia, CR', ip: '10.0.0.***', status: 'success' },
  { id: 4, date: 'Jun 22, 2026', time: '11:20 AM', device: 'iPhone 15 Pro', location: 'Cartago, CR', ip: '172.16.0.***', status: 'failed' },
  { id: 5, date: 'Jun 20, 2026', time: '3:00 PM', device: 'iPad Air', location: 'San José, CR', ip: '192.168.1.***', status: 'success' },
]

const activeDevices = [
  { id: 1, name: 'iPhone 15 Pro', type: 'mobile', icon: Smartphone, lastActive: 'Now', current: true },
  { id: 2, name: 'MacBook Pro', type: 'desktop', icon: Laptop, lastActive: '2 hours ago', current: false },
  { id: 3, name: 'iPad Air', type: 'tablet', icon: Monitor, lastActive: '3 days ago', current: false },
]

const securityAlerts = [
  { id: 1, type: 'warning', message: 'New login detected from Chrome / Windows in Heredia.', time: '3 days ago' },
  { id: 2, type: 'info', message: 'Your password was last changed 90 days ago.', time: '1 week ago' },
  { id: 3, type: 'success', message: 'Two-factor authentication enabled successfully.', time: '2 weeks ago' },
]

export default function DashboardSecurity() {
  const [twoFactor, setTwoFactor] = useState(true)
  const [biometric, setBiometric] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(0)

  const handlePasswordChange = (value: string) => {
    setNewPassword(value)
    let strength = 0
    if (value.length >= 8) strength++
    if (/[A-Z]/.test(value)) strength++
    if (/[0-9]/.test(value)) strength++
    if (/[^A-Za-z0-9]/.test(value)) strength++
    setPasswordStrength(strength)
  }

  const handleRevoke = (deviceName: string) => {
    toast.success(`${deviceName} access revoked`)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (passwordStrength < 3) {
      toast.error('Password is not strong enough')
      return
    }
    toast.success('Password updated successfully')
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong']
  const strengthColors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500']

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-10">
          <h1 className="font-serif text-3xl text-brown">Security</h1>
          <p className="mt-2 text-brown/60">Manage your account security and login settings.</p>
        </motion.div>

        {/* Security Toggles */}
        <motion.div variants={fadeUp} className="mb-8 grid gap-4 sm:grid-cols-2">
          {/* Two-Factor Auth */}
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-400 to-pink-500 text-white">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-brown">Two-Factor Authentication</h3>
                  <p className="text-xs text-brown/50">Extra layer of security for logins</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setTwoFactor(!twoFactor)
                  toast.success(twoFactor ? '2FA disabled' : '2FA enabled')
                }}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  twoFactor ? 'bg-pink-500' : 'bg-brown/20'
                }`}
              >
                <motion.div
                  animate={{ x: twoFactor ? 22 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
            <p className="mt-3 text-xs text-brown/50">
              {twoFactor ? 'Enabled — You\'re protected with an extra verification step.' : 'Disabled — Enable for added security.'}
            </p>
          </div>

          {/* Biometric Login */}
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-500 text-white">
                  <Fingerprint size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-brown">Biometric Login</h3>
                  <p className="text-xs text-brown/50">Use Face ID or fingerprint</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setBiometric(!biometric)
                  toast.success(biometric ? 'Biometric login disabled' : 'Biometric login enabled')
                }}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  biometric ? 'bg-pink-500' : 'bg-brown/20'
                }`}
              >
                <motion.div
                  animate={{ x: biometric ? 22 : 2 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>
            <p className="mt-3 text-xs text-brown/50">
              {biometric ? 'Enabled — Sign in with biometrics on supported devices.' : 'Disabled — Enable for faster sign-in.'}
            </p>
          </div>
        </motion.div>

        {/* Change Password */}
        <motion.div variants={fadeUp} className="mb-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Key size={20} className="text-pink-500" />
            <h2 className="font-serif text-xl text-brown">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brown">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-4 py-2.5 pr-10 text-sm text-brown outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown/70"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brown">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-4 py-2.5 pr-10 text-sm text-brown outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown/70"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-pink-100'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-brown/50">{strengthLabels[passwordStrength]}</p>
                </div>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brown">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-pink-200 bg-pink-50/30 px-4 py-2.5 pr-10 text-sm text-brown outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/40 hover:text-brown/70"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-pink-400 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg active:scale-95"
            >
              Update Password
            </button>
          </form>
        </motion.div>

        {/* Active Devices */}
        <motion.div variants={fadeUp} className="mb-8 rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <Smartphone size={20} className="text-pink-500" />
            <h2 className="font-serif text-xl text-brown">Active Devices</h2>
          </div>
          <div className="space-y-3">
            {activeDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-center gap-4 rounded-xl border border-pink-50 bg-pink-50/30 p-4 transition hover:bg-pink-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 text-pink-500">
                  <device.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-brown">{device.name}</p>
                    {device.current && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-600">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brown/50">Last active: {device.lastActive}</p>
                </div>
                {!device.current && (
                  <button
                    onClick={() => handleRevoke(device.name)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                  >
                    <Trash2 size={14} /> Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-pink-50/50 p-3">
            <LogOut size={16} className="text-pink-400" />
            <button className="text-sm font-medium text-pink-500 transition hover:text-pink-600">
              Sign out from all other devices
            </button>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Security Alerts */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Bell size={20} className="text-pink-500" />
              <h2 className="font-serif text-xl text-brown">Security Alerts</h2>
            </div>
            <div className="space-y-3">
              {securityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 rounded-xl p-4 ${
                    alert.type === 'warning'
                      ? 'border border-pink-200 bg-pink-50'
                      : alert.type === 'success'
                      ? 'border border-emerald-200 bg-emerald-50'
                      : 'border border-blue-200 bg-blue-50'
                  }`}
                >
                  {alert.type === 'warning' ? (
                    <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
                  ) : alert.type === 'success' ? (
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-500" />
                  ) : (
                    <Bell size={18} className="mt-0.5 shrink-0 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-brown">{alert.message}</p>
                    <p className="mt-1 text-xs text-brown/40">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Login History */}
          <motion.div variants={fadeUp} className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <Lock size={20} className="text-pink-500" />
              <h2 className="font-serif text-xl text-brown">Login History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-pink-100">
                    <th className="pb-2 font-medium text-brown/50">Date</th>
                    <th className="pb-2 font-medium text-brown/50">Time</th>
                    <th className="pb-2 font-medium text-brown/50">Device</th>
                    <th className="pb-2 font-medium text-brown/50">Location</th>
                    <th className="pb-2 font-medium text-brown/50">IP</th>
                    <th className="pb-2 font-medium text-brown/50">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map((entry) => (
                    <tr key={entry.id} className="border-b border-pink-50 last:border-0">
                      <td className="py-2.5 text-brown/70">{entry.date}</td>
                      <td className="py-2.5 text-brown/70">{entry.time}</td>
                      <td className="py-2.5 font-medium text-brown">{entry.device}</td>
                      <td className="py-2.5 text-brown/70">{entry.location}</td>
                      <td className="py-2.5 font-mono text-brown/50">{entry.ip}</td>
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            entry.status === 'success'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {entry.status === 'success' ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <AlertTriangle size={10} />
                          )}
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
