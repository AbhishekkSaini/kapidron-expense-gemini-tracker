
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Users, 
  CalendarDays, 
  AlertCircle 
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Layout from '@/components/Layout';
import ExpenseCard from '@/components/ExpenseCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/format';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const GroupDetails = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  
  const { 
    getGroupById, 
    getGroupExpenses, 
    getGroupBalance, 
    currentUser
  } = useStore();
  
  const group = groupId ? getGroupById(groupId) : undefined;
  const expenses = groupId ? getGroupExpenses(groupId) : [];
  const balances = groupId ? getGroupBalance(groupId) : [];
  
  // Sort expenses by most recent first
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const addExpense = () => {
    navigate(`/create-expense/${groupId}`);
  };
  
  // If group doesn't exist, show error
  if (!group) {
    return (
      <Layout showBack title="Not Found">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Group Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The group you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/')}>
            Go Back to Groups
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout 
      title={group.name} 
      showBack 
      showAddButton 
      addButtonAction={addExpense}
    >
      {group.description && (
        <p className="text-muted-foreground mb-4">{group.description}</p>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {group.members.length} members
          </span>
        </div>
        <div className="flex items-center">
          <CalendarDays className="h-4 w-4 mr-1 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Created {formatDate(group.createdAt)}
          </span>
        </div>
      </div>
      
      <Separator className="my-4" />
      
      <Tabs defaultValue="expenses" className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger value="expenses" className="flex-1">
            Expenses
          </TabsTrigger>
          <TabsTrigger value="balances" className="flex-1">
            Balances
          </TabsTrigger>
          <TabsTrigger value="members" className="flex-1">
            Members
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="expenses" className="mt-4">
          {sortedExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40">
              <p className="text-center text-muted-foreground mb-4">
                No expenses in this group yet. Add one to get started.
              </p>
              <Button onClick={addExpense}>
                <Plus className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedExpenses.map(expense => (
                <ExpenseCard key={expense.id} expense={expense} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="balances" className="mt-4">
          <div className="space-y-4">
            {balances.map(balance => {
              const user = useStore.getState().getUserById(balance.userId);
              if (!user) return null;
              
              return (
                <div 
                  key={balance.userId} 
                  className="flex items-center justify-between p-4 bg-card rounded-lg border"
                >
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      {user.avatar && <AvatarImage src={user.avatar} />}
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {currentUser?.id === user.id ? 'You' : user.name}
                      </p>
                      {user.email && (
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {balance.amount !== 0 && (
                    <Badge variant={balance.amount > 0 ? "destructive" : "secondary"}>
                      {balance.amount > 0 
                        ? `Owes ${formatCurrency(balance.amount)}`
                        : `Gets ${formatCurrency(Math.abs(balance.amount))}`}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="members" className="mt-4">
          <div className="space-y-4">
            {group.members.map(member => (
              <div 
                key={member.id} 
                className="flex items-center p-4 bg-card rounded-lg border"
              >
                <Avatar className="h-10 w-10 mr-3">
                  {member.avatar && <AvatarImage src={member.avatar} />}
                  <AvatarFallback>
                    {member.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {currentUser?.id === member.id ? 'You' : member.name}
                  </p>
                  {member.email && (
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  )}
                </div>
                {group.createdBy === member.id && (
                  <Badge variant="outline" className="ml-auto">
                    Creator
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default GroupDetails;
