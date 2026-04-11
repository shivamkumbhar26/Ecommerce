import { ShoppingBag, Globe, Link } from 'lucide-react'


export default function Footer() {
  return (
    <footer className="border-t border-ink-800/60 bg-ink-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-ink-50">
                Shop<span className="text-brand-400">Arc</span>
              </span>
            </Link>
            <p className="text-sm text-ink-500 max-w-xs leading-relaxed">
              Premium commerce platform. Curated products, seamless experience, delivered to your door.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-ink-300 mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-ink-500">
              {['Electronics', 'Clothing', 'Books', 'Sports'].map((c) => (
                <li key={c}>
                  <Link to={`/?category=${c}`} className="hover:text-ink-300 transition-colors">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-300 mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-ink-500">
              {[
                { label: 'Login', to: '/login' },
                { label: 'Register', to: '/register' },
                { label: 'My Orders', to: '/orders' },
                { label: 'Cart', to: '/cart' },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-ink-300 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-ink-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-600">
            © {new Date().getFullYear()} ShopArc. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Globe, Link].map((Icon, i) => (
              <button
                key={i}
                className="p-2 rounded-lg text-ink-600 hover:text-ink-400 hover:bg-ink-800 transition-colors"
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}