import { NavBar } from '../components/ui/tubelight-navbar';
import { Home, ShoppingBag, BookOpen, User } from 'lucide-react';

export default function NavbarDemo() {
  const navItems = [
    { name: 'الرئيسية', url: '/', icon: Home },
    { name: 'الكتب', url: '/books', icon: BookOpen },
    { name: 'طلباتي', url: '/orders', icon: ShoppingBag },
    { name: 'حسابي', url: '/dashboard', icon: User },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <NavBar items={navItems} />
    </div>
  );
}
