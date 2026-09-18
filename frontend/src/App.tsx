import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { ProductsProvider } from './context/ProductsContext'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { CartDrawer } from './components/layout/CartDrawer'

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const Account = lazy(() => import('./pages/Account'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))

// Dashboard pages
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'))
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'))
const MyOrders = lazy(() => import('./pages/dashboard/MyOrders'))
const OrderTracking = lazy(() => import('./pages/dashboard/OrderTracking'))
const DashboardWishlist = lazy(() => import('./pages/dashboard/DashboardWishlist'))
const DashboardCart = lazy(() => import('./pages/dashboard/DashboardCart'))
const DashboardProfile = lazy(() => import('./pages/dashboard/DashboardProfile'))
const AddressBook = lazy(() => import('./pages/dashboard/AddressBook'))
const PaymentMethods = lazy(() => import('./pages/dashboard/PaymentMethods'))
const LoyaltyProgram = lazy(() => import('./pages/dashboard/LoyaltyProgram'))
const DashboardCoupons = lazy(() => import('./pages/dashboard/DashboardCoupons'))
const DashboardNotifications = lazy(() => import('./pages/dashboard/DashboardNotifications'))
const DashboardReviews = lazy(() => import('./pages/dashboard/DashboardReviews'))
const DashboardMessages = lazy(() => import('./pages/dashboard/DashboardMessages'))
const ReturnsRefunds = lazy(() => import('./pages/dashboard/ReturnsRefunds'))
const DashboardWallet = lazy(() => import('./pages/dashboard/DashboardWallet'))
const ReferralProgram = lazy(() => import('./pages/dashboard/ReferralProgram'))
const DashboardAnalytics = lazy(() => import('./pages/dashboard/DashboardAnalytics'))
const DashboardSecurity = lazy(() => import('./pages/dashboard/DashboardSecurity'))
const SupportCenter = lazy(() => import('./pages/dashboard/SupportCenter'))

function LoadingScreen() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
    </div>
  )
}

function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1"><Suspense fallback={<LoadingScreen />}>{children}</Suspense></main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ProductsProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
              <Routes>
                {/* Storefront routes */}
                <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
                <Route path="/category/:slug" element={<StorefrontLayout><CategoryPage /></StorefrontLayout>} />
                <Route path="/product/:slug" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
                <Route path="/checkout" element={<StorefrontLayout><Checkout /></StorefrontLayout>} />
                <Route path="/wishlist" element={<StorefrontLayout><Wishlist /></StorefrontLayout>} />
                <Route path="/search" element={<StorefrontLayout><SearchResults /></StorefrontLayout>} />
                <Route path="/account" element={<StorefrontLayout><Account /></StorefrontLayout>} />
                <Route
                  path="/login"
                  element={
                    <div className="flex min-h-screen flex-col">
                      <main className="flex-1"><Suspense fallback={<LoadingScreen />}><Login /></Suspense></main>
                    </div>
                  }
                />
                <Route path="/signup" element={<StorefrontLayout><SignUp /></StorefrontLayout>} />
                <Route path="/forgot-password" element={<Suspense fallback={<LoadingScreen />}><ForgotPassword /></Suspense>} />
                <Route path="/reset-password" element={<Suspense fallback={<LoadingScreen />}><ResetPassword /></Suspense>} />
                <Route path="/politica-de-privacidad" element={<StorefrontLayout><PrivacyPolicy /></StorefrontLayout>} />

                {/* Dashboard routes */}
                <Route path="/dashboard" element={<Suspense fallback={<LoadingScreen />}><DashboardLayout /></Suspense>}>
                  <Route index element={<DashboardHome />} />
                  <Route path="orders" element={<MyOrders />} />
                  <Route path="orders/track" element={<OrderTracking />} />
                  <Route path="wishlist" element={<DashboardWishlist />} />
                  <Route path="cart" element={<DashboardCart />} />
                  <Route path="profile" element={<DashboardProfile />} />
                  <Route path="addresses" element={<AddressBook />} />
                  <Route path="payments" element={<PaymentMethods />} />
                  <Route path="loyalty" element={<LoyaltyProgram />} />
                  <Route path="coupons" element={<DashboardCoupons />} />
                  <Route path="notifications" element={<DashboardNotifications />} />
                  <Route path="reviews" element={<DashboardReviews />} />
                  <Route path="messages" element={<DashboardMessages />} />
                  <Route path="returns" element={<ReturnsRefunds />} />
                  <Route path="wallet" element={<DashboardWallet />} />
                  <Route path="referrals" element={<ReferralProgram />} />
                  <Route path="analytics" element={<DashboardAnalytics />} />
                  <Route path="security" element={<DashboardSecurity />} />
                  <Route path="support" element={<SupportCenter />} />
                </Route>
              </Routes>
              <CartDrawer />
              <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'Inter, sans-serif' } }} />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
        </ProductsProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}

export default App
