
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  User, 
  Tag, 
  DollarSign, 
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Layout from '@/components/Layout';
import { formatCurrency, formatDate } from '@/utils/format';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ExpenseDetails = () => {
  const { expenseId } = useParams<{ expenseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const expense = useStore(state => 
    expenseId ? state.getExpenseById(expenseId) : undefined
  );
  
  const getGroupById = useStore(state => state.getGroupById);
  const getUserById = useStore(state => state.getUserById);
  const currentUser = useStore(state => state.currentUser);
  const markExpensePaid = useStore(state => state.markExpensePaid);
  
  const group = expense ? getGroupById(expense.groupId) : undefined;
  const paidBy = expense ? getUserById(expense.paidBy) : undefined;
  
  // Check if current user has a split in this expense
  const userSplit = expense && currentUser 
    ? expense.splits.find(split => split.userId === currentUser.id)
    : undefined;
  
  const isPayer = currentUser && expense && currentUser.id === expense.paidBy;
  
  const handleMarkAsPaid = () => {
    if (!expenseId || !currentUser) return;
    
    markExpensePaid(expenseId, currentUser.id);
    toast({
      title: "Marked as paid",
      description: "Your share has been marked as paid",
      variant: "default",
    });
  };
  
  // If expense doesn't exist, show error
  if (!expense || !group) {
    return (
      <Layout showBack title="Not Found">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Expense Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The expense you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/')}>
            Go Back to Groups
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title={expense.title} showBack>
      <div className="bg-card rounded-lg border p-4 mb-6">
        {expense.description && (
          <p className="text-muted-foreground mb-4">{expense.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-medium">{formatCurrency(expense.amount)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium capitalize">{expense.category}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Paid by</p>
              <p className="font-medium">
                {paidBy ? (
                  currentUser?.id === paidBy.id ? 'You' : paidBy.name
                ) : 'Unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{formatDate(expense.date)}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Group</p>
          <p className="font-medium">{group.name}</p>
        </div>
      </div>
      
      <h3 className="font-medium text-lg mb-3">Split Details</h3>
      
      <div className="space-y-3">
        {expense.splits.map((split) => {
          const member = getUserById(split.userId);
          const isCurrentUser = currentUser && currentUser.id === split.userId;
          
          return (
            <div key={split.userId} className="flex items-center justify-between p-3 bg-card rounded-lg border">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  {member?.avatar && <AvatarImage src={member.avatar} />}
                  <AvatarFallback>
                    {member?.name.substring(0, 2).toUpperCase() || '??'}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">
                  {isCurrentUser
                    ? 'You'
                    : member?.name || 'Unknown'}
                </p>
              </div>
              
              <div className="flex items-center">
                <p className="font-medium mr-3">{formatCurrency(split.amount)}</p>
                {split.paid ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : expense.paidBy === split.userId ? (
                  <Badge variant="outline">Paid for all</Badge>
                ) : isCurrentUser ? (
                  <Button size="sm" variant="outline" onClick={handleMarkAsPaid}>Mark as paid</Button>
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <Separator className="my-6" />
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => navigate(`/group/${expense.groupId}`)}
        >
          Back to Group
        </Button>
        
        {userSplit && !userSplit.paid && !isPayer && (
          <Button onClick={handleMarkAsPaid}>
            Mark as Paid
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default ExpenseDetails;
