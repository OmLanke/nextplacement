import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Dashboard' },
  { href: '/students', label: 'Students' },
  { href: '/jobs', label: 'Jobs' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Sticky top navbar */}
      <header className="sticky top-0 z-30 w-full bg-[#1e293b] shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="Logo" className="w-9 h-9 rounded-lg shadow" />
            <span className="font-extrabold text-2xl tracking-tight text-white">NextPlacement</span>
          </div>
          <nav className="flex gap-2 md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg font-medium text-white hover:underline hover:underline-offset-8 hover:decoration-4 hover:decoration-red-500 transition-colors focus-visible:ring-2 focus-visible:ring-blue-300"
                prefetch={false}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12 bg-[#f8fafc] min-h-screen">{children}</main>
    </div>
  );
}
