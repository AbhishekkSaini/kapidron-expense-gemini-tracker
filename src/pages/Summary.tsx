
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, PieChart } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Layout from '@/components/Layout';
import { formatCurrency } from '@/utils/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

const COLORS = ['#8B5CF6', '#14B8A6', '#EF4444', '#22C55E', '#3B82F6', '#F59E0B'];

const Summary = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    getOverallBalance, 
    groups, 
    expenses, 
    getGroupById, 
    getUserById 
  } = useStore();
  
  // Get overall balance
  const balances = getOverallBalance();
  const userBalance = currentUser 
    ? balances.find(b => b.userId === currentUser.id)?.amount || 0
    : 0;
  
  // Calculate category breakdown
  const categoryData = React.useMemo(() => {
    const data: Record<string, number> = {};
    
    expenses.forEach(expense => {
      if (!data[expense.category]) {
        data[expense.category] = 0;
      }
      data[expense.category] += expense.amount;
    });
    
    return Object.entries(data).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value
    }));
  }, [expenses]);
  
  // Calculate group breakdown
  const groupData = React.useMemo(() => {
    const data: Record<string, number> = {};
    
    expenses.forEach(expense => {
      const group = getGroupById(expense.groupId);
      if (!group) return;
      
      if (!data[group.id]) {
        data[group.id] = 0;
      }
      data[group.id] += expense.amount;
    });
    
    return Object.entries(data).map(([groupId, value]) => {
      const group = getGroupById(groupId);
      return {
        name: group?.name || 'Unknown',
        value,
        id: groupId
      };
    });
  }, [expenses, getGroupById]);
  
  // Get user balances for current groups
  const userBalances = React.useMemo(() => {
    const groupBalances = groups.map(group => {
      const balancesForGroup = useStore.getState().getGroupBalance(group.id);
      
      const currentUserBalance = currentUser
        ? balancesForGroup.find(b => b.userId === currentUser.id)
        : undefined;
      
      return {
        groupId: group.id,
        groupName: group.name,
        balance: currentUserBalance?.amount || 0
      };
    });
    
    return groupBalances;
  }, [groups, currentUser]);
  
  const totalPositive = userBalances.reduce((sum, item) => {
    return item.balance > 0 ? sum + item.balance : sum;
  }, 0);
  
  const totalNegative = userBalances.reduce((sum, item) => {
    return item.balance < 0 ? sum + Math.abs(item.balance) : sum;
  }, 0);
  
  // Format bar chart data
  const barData = userBalances.map(item => ({
    name: item.groupName,
    amount: item.balance,
    color: item.balance > 0 ? '#EF4444' : '#22C55E'
  }));
  
  return (
    <Layout title="Summary">
      {currentUser && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg mb-2 ${
            userBalance > 0 
              ? 'bg-destructive/10 text-destructive' 
              : userBalance < 0 
                ? 'bg-accent/10 text-accent' 
                : 'bg-muted text-muted-foreground'
          }`}>
            <h2 className="text-lg font-medium">Overall Balance</h2>
            {userBalance > 0 ? (
              <p className="text-2xl font-bold">You owe {formatCurrency(userBalance)}</p>
            ) : userBalance < 0 ? (
              <p className="text-2xl font-bold">You get back {formatCurrency(Math.abs(userBalance))}</p>
            ) : (
              <p className="text-2xl font-bold">All settled up!</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="text-sm text-muted-foreground mb-1">You owe</h3>
              <p className="text-lg font-semibold text-destructive">
                {formatCurrency(totalPositive)}
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <h3 className="text-sm text-muted-foreground mb-1">You're owed</h3>
              <p className="text-lg font-semibold text-accent">
                {formatCurrency(totalNegative)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Group Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={barData}
                margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                  tickFormatter={(value) => `$${Math.abs(value)}`} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [
                    `${Number(value) > 0 ? 'You owe' : 'You are owed'} ${formatCurrency(Math.abs(Number(value)))}`,
                    ''
                  ]}
                />
                <Bar dataKey="amount">
                  {barData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.amount > 0 ? '#EF4444' : '#22C55E'} 
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="category">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="category" className="flex-1">
                By Category
              </TabsTrigger>
              <TabsTrigger value="group" className="flex-1">
                By Group
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="category">
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="group">
              <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={groupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {groupData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Summary;
