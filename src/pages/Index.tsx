
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Layout from '@/components/Layout';
import GroupCard from '@/components/GroupCard';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import { sampleUsers, sampleGroups, sampleExpenses } from '@/utils/sample-data';
import { useAuthStore } from '@/store/useAuthStore';

const Index = () => {
  const navigate = useNavigate();
  const { 
    groups, 
    currentUser, 
    setCurrentUser, 
    getOverallBalance 
  } = useStore();
  
  const authUser = useAuthStore(state => state.user);
  
  // Initialize with user data from auth store or sample data if needed
  useEffect(() => {
    // If we have an authenticated user but no current user in the main store
    if (authUser && !currentUser) {
      setCurrentUser(authUser);
    } 
    // If no authenticated user and no current user, use sample data
    else if (!authUser && !currentUser) {
      setCurrentUser(sampleUsers[0]);
      
      // Initialize store with sample data if no groups exist
      if (groups.length === 0) {
        const store = useStore.getState();
        
        // Add sample groups
        sampleGroups.forEach(group => {
          store.addGroup({
            name: group.name,
            description: group.description,
            members: group.members,
            createdBy: group.createdBy
          });
        });
        
        // Add sample expenses
        sampleExpenses.forEach(expense => {
          store.addExpense({
            groupId: expense.groupId,
            title: expense.title,
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            paidBy: expense.paidBy,
            splits: expense.splits
          });
        });
      }
    }
  }, [authUser, currentUser, groups.length, setCurrentUser]);
  
  // Get overall balance for the current user
  const overallBalance = useStore(
    state => {
      if (!state.currentUser) return 0;
      const userBalances = state.getOverallBalance();
      const userBalance = userBalances.find(b => b.userId === state.currentUser?.id);
      return userBalance ? userBalance.amount : 0;
    }
  );
  
  const createGroup = () => {
    navigate('/create-group');
  };
  
  return (
    <Layout 
      title="Groups" 
      showAddButton={true} 
      addButtonAction={createGroup}
    >
      {currentUser && (
        <div className="mb-6">
          <div className={`p-6 rounded-lg mb-4 ${
            overallBalance > 0 
              ? 'bg-destructive/10 text-destructive border border-destructive/20' 
              : overallBalance < 0 
                ? 'bg-secondary/10 text-secondary border border-secondary/20' 
                : 'bg-muted text-muted-foreground'
          }`}>
            <h2 className="text-lg font-medium">Your Balance</h2>
            {overallBalance > 0 ? (
              <p className="text-2xl font-bold">You owe {formatCurrency(overallBalance)}</p>
            ) : overallBalance < 0 ? (
              <p className="text-2xl font-bold">You get back {formatCurrency(Math.abs(overallBalance))}</p>
            ) : (
              <p className="text-2xl font-bold">All settled up!</p>
            )}
          </div>
        </div>
      )}
      
      {groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-card rounded-lg border p-8">
          <div className="text-center space-y-4">
            <div className="p-3 bg-primary/10 rounded-full inline-block">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium">No Groups Yet</h3>
            <p className="text-muted-foreground">
              You don't have any groups yet. Create your first group to start tracking expenses.
            </p>
            <Button onClick={createGroup} size="lg" className="mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </Layout>
  );
};

export default Index;
