
import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  showAddButton?: boolean;
  addButtonAction?: () => void;
}

export default function Layout({ 
  children, 
  title, 
  showBack = false, 
  showAddButton = false,
  addButtonAction
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title={title} 
        showBack={showBack} 
        showAddButton={showAddButton}
        addButtonAction={addButtonAction}
      />
      
      <main className="flex-1 p-4 pb-20 overflow-auto">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
