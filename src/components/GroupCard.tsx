
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users } from 'lucide-react';
import { Group, useStore, Balance } from '@/store/useStore';
import { formatCurrency } from '@/utils/format';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();
  const currentUser = useStore(state => state.currentUser);
  const getGroupBalance = useStore(state => state.getGroupBalance);
  
  const balances = getGroupBalance(group.id);
  const currentUserBalance = currentUser 
    ? balances.find(b => b.userId === currentUser.id)?.amount || 0 
    : 0;
  
  const goToGroupDetails = () => {
    navigate(`/group/${group.id}`);
  };
  
  return (
    <div 
      className="group-card cursor-pointer animate-fade-in"
      onClick={goToGroupDetails}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <h3 className="font-medium text-lg">{group.name}</h3>
          {group.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {group.description}
            </p>
          )}
        </div>
        
        {currentUser && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentUserBalance > 0 
              ? 'bg-destructive/10 text-destructive' 
              : currentUserBalance < 0 
                ? 'bg-accent/20 text-accent' 
                : 'bg-muted text-muted-foreground'
          }`}>
            {currentUserBalance > 0 
              ? `You owe ${formatCurrency(currentUserBalance)}` 
              : currentUserBalance < 0 
                ? `You get ${formatCurrency(Math.abs(currentUserBalance))}` 
                : 'Settled'}
          </div>
        )}
      </div>
      
      <div className="flex items-center mt-4 text-muted-foreground">
        <Users className="h-4 w-4 mr-1" />
        <span className="text-sm">{group.members.length} members</span>
      </div>
    </div>
  );
}
