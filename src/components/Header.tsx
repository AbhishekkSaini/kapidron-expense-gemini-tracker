
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showAddButton?: boolean;
  addButtonAction?: () => void;
}

export default function Header({ 
  title, 
  showBack = false, 
  showAddButton = false,
  addButtonAction
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useStore(state => state.currentUser);

  // If no title is provided, use a default based on the path
  const defaultTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Groups';
    if (path.includes('/group/')) return 'Group Details';
    if (path.includes('/expense/')) return 'Expense Details';
    if (path.includes('/create-group')) return 'Create Group';
    if (path.includes('/create-expense')) return 'Add Expense';
    if (path.includes('/profile')) return 'Profile';
    return 'Expense Tracker';
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
      <div className="flex items-center">
        {showBack && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-lg font-semibold">{title || defaultTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {showAddButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={addButtonAction}
            className="text-primary"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/profile')}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
