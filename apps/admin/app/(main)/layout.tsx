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

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <nav>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/students">Students</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
