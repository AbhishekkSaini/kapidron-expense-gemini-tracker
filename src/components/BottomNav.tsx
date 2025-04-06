
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PieChart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around py-2 z-10">
      <Button 
        variant={isActive('/') ? "default" : "ghost"} 
        onClick={() => navigate('/')}
        className="flex flex-col items-center h-auto py-1 flex-1"
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Groups</span>
      </Button>
      
      <Button 
        variant={isActive('/summary') ? "default" : "ghost"}
        onClick={() => navigate('/summary')}
        className="flex flex-col items-center h-auto py-1 flex-1"
      >
        <PieChart className="h-5 w-5" />
        <span className="text-xs mt-1">Summary</span>
      </Button>
      
      <Button 
        variant={isActive('/profile') ? "default" : "ghost"}
        onClick={() => navigate('/profile')}
        className="flex flex-col items-center h-auto py-1 flex-1"
      >
        <User className="h-5 w-5" />
        <span className="text-xs mt-1">Profile</span>
      </Button>
    </div>
  );
}
