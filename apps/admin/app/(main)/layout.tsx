import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@workspace/ui/components/navigation-menu';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/students', label: 'Students', icon: '🎓' },
  { href: '/jobs', label: 'Jobs', icon: '💼' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // Helper to check active link (client-side only)
  const isActive = (href: string) => {
    if (typeof window === 'undefined') return false;
    if (href === '/') return window.location.pathname === '/';
    return window.location.pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-6 gap-8">
        <div className="sticky top-8">
          <div className="flex flex-col gap-6 rounded-2xl shadow-xl bg-sidebar border border-sidebar-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <img src="/favicon.ico" alt="Logo" className="w-10 h-10" />
              <span className="font-extrabold text-xl tracking-tight text-sidebar-primary">Admin Portal</span>
            </div>
            <div className="text-xs uppercase font-semibold text-muted-foreground mb-2 tracking-widest pl-1">Navigation</div>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-accent data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  data-active={typeof window !== 'undefined' && isActive(link.href)}
                >
                  <span className="text-lg">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden flex items-center justify-between h-16 border-b bg-background px-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.href}>
                  <NavigationMenuLink asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </header>
        <main className="flex-1 bg-background text-foreground p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}
