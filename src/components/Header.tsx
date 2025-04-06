
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, PlusCircle, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const currentUser = useStore(state => state.currentUser);
  const { signOut } = useAuthStore();

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

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/login');
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              {currentUser ? (
                <Avatar className="h-8 w-8">
                  {currentUser.avatar && <AvatarImage src={currentUser.avatar} />}
                  <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {currentUser && (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
