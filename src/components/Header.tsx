
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  MenuIcon, 
  PlusCircle, 
  BellIcon, 
  X
} from 'lucide-react';

interface HeaderProps {
  onAddTransaction: () => void;
  hasNotifications?: boolean;
  onNotificationsClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddTransaction,
  hasNotifications = false,
  onNotificationsClick
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track scroll position to add glass effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header 
        className={cn(
          'fixed top-0 left-0 right-0 z-50 px-4 py-4 transition-all duration-300 flex items-center justify-between',
          scrolled 
            ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm' 
            : 'bg-transparent'
        )}
      >
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden mr-2" 
            onClick={() => setIsMenuOpen(true)}
          >
            <MenuIcon className="h-5 w-5" />
          </Button>
          <div className="hidden lg:flex items-center gap-2">
            <span className="font-medium text-lg">Mindful</span>
            <span className="bg-primary/10 text-primary font-medium rounded-md px-2 py-0.5 text-xs">
              Spending Buddy
            </span>
          </div>
          <div className="lg:hidden flex items-center">
            <span className="font-medium text-base">Mindful</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={onNotificationsClick}
          >
            <BellIcon className="h-5 w-5" />
            {hasNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            )}
          </Button>
          
          <Button
            onClick={onAddTransaction}
            size="sm"
            className="bg-primary text-white hover:bg-primary/90 transition-all"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>New</span>
          </Button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          
          <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-lg animate-slide-down p-4">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg">Mindful</span>
                <span className="bg-primary/10 text-primary font-medium rounded-md px-2 py-0.5 text-xs">
                  Spending Buddy
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start">
                <span>Dashboard</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <span>Transactions</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <span>Insights</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <span>Savings</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
