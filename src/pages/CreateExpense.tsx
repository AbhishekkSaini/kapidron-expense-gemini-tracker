
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { ExpenseCategory } from '@/store/useStore';

const CATEGORIES: { value: ExpenseCategory; label: string }[] = [
  { value: 'food', label: 'Food' },
  { value: 'rent', label: 'Rent' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'other', label: 'Other' }
];

const CreateExpense = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const group = useStore(state => 
    groupId ? state.getGroupById(groupId) : undefined
  );
  
  const currentUser = useStore(state => state.currentUser);
  const addExpense = useStore(state => state.addExpense);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [paidBy, setPaidBy] = useState(currentUser?.id || '');
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [customSplits, setCustomSplits] = useState<Record<string, string>>({});
  
  // If group doesn't exist, navigate back
  if (!group) {
    navigate('/');
    return null;
  }
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };
  
  const handleCustomSplitChange = (userId: string, value: string) => {
    // Allow only numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    setCustomSplits({
      ...customSplits,
      [userId]: sanitizedValue
    });
  };
  
  // Calculate equal splits
  const getEqualSplitAmount = () => {
    const numMembers = group.members.length;
    const totalAmount = parseFloat(amount) || 0;
    if (numMembers === 0 || totalAmount === 0) return 0;
    
    return parseFloat((totalAmount / numMembers).toFixed(2));
  };
  
  // Validate custom splits total matches amount
  const validateCustomSplits = () => {
    const totalAmount = parseFloat(amount) || 0;
    let splitTotal = 0;
    
    for (const userId of group.members.map(m => m.id)) {
      const splitAmount = parseFloat(customSplits[userId] || '0');
      splitTotal += splitAmount;
    }
    
    // Allow for small floating point differences
    return Math.abs(totalAmount - splitTotal) < 0.01;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "User not found",
        description: "Please set up your profile first",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for this expense",
        variant: "destructive",
      });
      return;
    }
    
    const totalAmount = parseFloat(amount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      toast({
        title: "Valid amount required",
        description: "Please enter a valid positive amount",
        variant: "destructive",
      });
      return;
    }
    
    if (splitType === 'custom' && !validateCustomSplits()) {
      toast({
        title: "Invalid split",
        description: "The total of all splits must equal the expense amount",
        variant: "destructive",
      });
      return;
    }
    
    // Create splits based on split type
    const splits = group.members.map(member => {
      let splitAmount: number;
      
      if (splitType === 'equal') {
        splitAmount = getEqualSplitAmount();
      } else {
        splitAmount = parseFloat(customSplits[member.id] || '0');
      }
      
      return {
        userId: member.id,
        amount: splitAmount,
        // Mark as paid if this member paid for the expense
        paid: member.id === paidBy
      };
    });
    
    // Create the expense
    const expenseId = addExpense({
      groupId,
      title: title.trim(),
      description: description.trim() || undefined,
      amount: totalAmount,
      category,
      paidBy,
      splits
    });
    
    toast({
      title: "Expense added",
      description: "Your expense has been added successfully",
      variant: "default",
    });
    
    // Navigate back to group details
    navigate(`/group/${groupId}`);
  };
  
  const equalSplitAmount = getEqualSplitAmount();
  
  return (
    <Layout title="Add Expense" showBack>
      <Card>
        <CardHeader>
          <CardTitle>Add an Expense to {group.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="e.g., Dinner, Rent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                placeholder="Add more details about this expense"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    placeholder="0.00"
                    value={amount}
                    onChange={handleAmountChange}
                    className="pl-7"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={category}
                  onValueChange={(value) => setCategory(value as ExpenseCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="paidBy" className="text-sm font-medium">
                Paid by
              </label>
              <Select
                value={paidBy}
                onValueChange={setPaidBy}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent>
                  {group.members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.id === currentUser?.id ? 'You' : member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Split type</label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={splitType === 'equal' ? 'default' : 'outline'}
                  onClick={() => setSplitType('equal')}
                  className="flex-1"
                >
                  Equal
                </Button>
                <Button
                  type="button"
                  variant={splitType === 'custom' ? 'default' : 'outline'}
                  onClick={() => setSplitType('custom')}
                  className="flex-1"
                >
                  Custom
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Split details</p>
              
              <div className="space-y-3 mt-1">
                {group.members.map((member) => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-card border rounded-md"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        {member.avatar && <AvatarImage src={member.avatar} />}
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <p>{member.id === currentUser?.id ? 'You' : member.name}</p>
                    </div>
                    
                    {splitType === 'equal' ? (
                      <div className="text-right">
                        <span className="font-medium">
                          ${equalSplitAmount.toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <div className="relative w-24">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          value={customSplits[member.id] || ''}
                          onChange={(e) => handleCustomSplitChange(member.id, e.target.value)}
                          className="pl-7 h-8 text-right"
                          placeholder="0.00"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full">
                Add Expense
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default CreateExpense;
