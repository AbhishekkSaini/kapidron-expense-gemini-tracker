
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { useStore, Expense } from '@/store/useStore';
import { formatCurrency } from '@/utils/format';
import { formatDate } from '@/utils/format';

interface ExpenseCardProps {
  expense: Expense;
}

export default function ExpenseCard({ expense }: ExpenseCardProps) {
  const navigate = useNavigate();
  const getUserById = useStore(state => state.getUserById);
  const currentUser = useStore(state => state.currentUser);
  
  const paidBy = getUserById(expense.paidBy);
  
  // Find current user's split
  const userSplit = currentUser 
    ? expense.splits.find(split => split.userId === currentUser.id)
    : null;
  
  const isPayer = currentUser && currentUser.id === expense.paidBy;
  const isUnpaid = userSplit && !userSplit.paid && !isPayer;
  
  const goToExpenseDetails = () => {
    navigate(`/expense/${expense.id}`);
  };
  
  return (
    <div 
      className={`expense-card ${expense.category} cursor-pointer animate-fade-in`}
      onClick={goToExpenseDetails}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 mr-4">
          <h3 className="font-medium text-lg">{expense.title}</h3>
          {expense.description && (
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
              {expense.description}
            </p>
          )}
        </div>
        
        <div className="text-right">
          <p className="font-semibold">{formatCurrency(expense.amount)}</p>
          <p className="text-xs uppercase text-muted-foreground mt-1">
            {expense.category}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 text-muted-foreground">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span className="text-sm">
            Paid by {paidBy?.name || 'Unknown'}
          </span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">{formatDate(expense.date)}</span>
        </div>
      </div>
      
      {currentUser && (
        <div className="mt-2 pt-2 border-t">
          {isPayer && (
            <p className="text-sm text-accent">You paid this expense</p>
          )}
          {isUnpaid && userSplit && (
            <p className="text-sm text-destructive">
              You owe {formatCurrency(userSplit.amount)}
            </p>
          )}
          {userSplit?.paid && !isPayer && (
            <p className="text-sm text-muted-foreground">You've paid your share</p>
          )}
        </div>
      )}
    </div>
  );
}
