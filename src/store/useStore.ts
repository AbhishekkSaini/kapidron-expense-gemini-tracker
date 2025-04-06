
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types
export type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
};

export type ExpenseCategory = 'food' | 'rent' | 'transport' | 'utilities' | 'entertainment' | 'other';

export type Split = {
  userId: string;
  amount: number;
  paid: boolean;
};

export type Expense = {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  category: ExpenseCategory;
  paidBy: string; // userId
  date: string;
  splits: Split[];
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  members: User[];
  createdBy: string; // userId
  createdAt: string;
};

export type Balance = {
  userId: string;
  amount: number; // positive: user owes money, negative: user is owed money
};

type Store = {
  currentUser: User | null;
  groups: Group[];
  expenses: Expense[];
  
  // Actions
  setCurrentUser: (user: User | null) => void;
  addGroup: (group: Omit<Group, 'id' | 'createdAt'>) => string;
  updateGroup: (groupId: string, data: Partial<Group>) => void;
  deleteGroup: (groupId: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => string;
  updateExpense: (expenseId: string, data: Partial<Expense>) => void;
  deleteExpense: (expenseId: string) => void;
  addMemberToGroup: (groupId: string, user: User) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  markExpensePaid: (expenseId: string, userId: string) => void;
  
  // Calculated properties
  getGroupExpenses: (groupId: string) => Expense[];
  getGroupBalance: (groupId: string) => Balance[];
  getOverallBalance: () => Balance[];
  getExpenseById: (expenseId: string) => Expense | undefined;
  getGroupById: (groupId: string) => Group | undefined;
  getUserById: (userId: string) => User | undefined;
};

// Helper functions
const generateId = () => Math.random().toString(36).substring(2, 11);
const getCurrentDate = () => new Date().toISOString();

// Create store
export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      currentUser: null, 
      groups: [],
      expenses: [],
      
      // User actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      // Group actions
      addGroup: (group) => {
        const id = generateId();
        const newGroup = { 
          ...group, 
          id, 
          createdAt: getCurrentDate() 
        };
        set((state) => ({ groups: [...state.groups, newGroup] }));
        return id;
      },
      
      updateGroup: (groupId, data) => {
        set((state) => ({
          groups: state.groups.map((group) => 
            group.id === groupId ? { ...group, ...data } : group
          )
        }));
      },
      
      deleteGroup: (groupId) => {
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== groupId),
          expenses: state.expenses.filter((expense) => expense.groupId !== groupId)
        }));
      },
      
      // Expense actions
      addExpense: (expense) => {
        const id = generateId();
        const newExpense = { 
          ...expense, 
          id, 
          date: getCurrentDate() 
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
        return id;
      },
      
      updateExpense: (expenseId, data) => {
        set((state) => ({
          expenses: state.expenses.map((expense) => 
            expense.id === expenseId ? { ...expense, ...data } : expense
          )
        }));
      },
      
      deleteExpense: (expenseId) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== expenseId)
        }));
      },
      
      // Member actions
      addMemberToGroup: (groupId, user) => {
        set((state) => ({
          groups: state.groups.map((group) => {
            if (group.id === groupId && !group.members.some(m => m.id === user.id)) {
              return { 
                ...group, 
                members: [...group.members, user] 
              };
            }
            return group;
          })
        }));
      },
      
      removeMemberFromGroup: (groupId, userId) => {
        set((state) => ({
          groups: state.groups.map((group) => {
            if (group.id === groupId) {
              return { 
                ...group, 
                members: group.members.filter((member) => member.id !== userId) 
              };
            }
            return group;
          })
        }));
      },
      
      markExpensePaid: (expenseId, userId) => {
        set((state) => ({
          expenses: state.expenses.map((expense) => {
            if (expense.id === expenseId) {
              return {
                ...expense,
                splits: expense.splits.map((split) => {
                  if (split.userId === userId) {
                    return { ...split, paid: true };
                  }
                  return split;
                })
              };
            }
            return expense;
          })
        }));
      },
      
      // Getters
      getGroupExpenses: (groupId) => {
        return get().expenses.filter((expense) => expense.groupId === groupId);
      },
      
      getGroupBalance: (groupId) => {
        const expenses = get().getGroupExpenses(groupId);
        const group = get().getGroupById(groupId);
        
        if (!group) return [];
        
        // Initialize balances for all members
        const balances = group.members.reduce<Record<string, number>>((acc, member) => {
          acc[member.id] = 0;
          return acc;
        }, {});
        
        // Calculate balances from expenses
        expenses.forEach(expense => {
          // Add what payer paid
          balances[expense.paidBy] -= expense.amount;
          
          // Add what each user owes
          expense.splits.forEach(split => {
            if (!split.paid) {
              balances[split.userId] += split.amount;
            }
          });
        });
        
        // Convert to array format
        return Object.entries(balances).map(([userId, amount]) => ({
          userId,
          amount: Number(amount.toFixed(2))
        }));
      },
      
      getOverallBalance: () => {
        const allBalances: Record<string, number> = {};
        
        // Calculate total balance across all groups
        get().groups.forEach(group => {
          const groupBalances = get().getGroupBalance(group.id);
          
          groupBalances.forEach(balance => {
            if (!allBalances[balance.userId]) {
              allBalances[balance.userId] = 0;
            }
            allBalances[balance.userId] += balance.amount;
          });
        });
        
        // Convert to array format
        return Object.entries(allBalances).map(([userId, amount]) => ({
          userId,
          amount: Number(amount.toFixed(2))
        }));
      },
      
      getExpenseById: (expenseId) => {
        return get().expenses.find(expense => expense.id === expenseId);
      },
      
      getGroupById: (groupId) => {
        return get().groups.find(group => group.id === groupId);
      },
      
      getUserById: (userId) => {
        // Search in all groups' members
        for (const group of get().groups) {
          const user = group.members.find(member => member.id === userId);
          if (user) return user;
        }
        
        // Check if it's the current user
        const currentUser = get().currentUser;
        if (currentUser && currentUser.id === userId) {
          return currentUser;
        }
        
        return undefined;
      }
    }),
    {
      name: 'expense-tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
