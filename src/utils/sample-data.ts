
import { User, Group, Expense } from '@/store/useStore';

// Sample users
export const sampleUsers: User[] = [
  {
    id: 'user1',
    name: 'You',
    email: 'you@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
  },
  {
    id: 'user2',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 'user3',
    name: 'Taylor Smith',
    email: 'taylor@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor'
  },
  {
    id: 'user4',
    name: 'Jordan Lee',
    email: 'jordan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan'
  },
  {
    id: 'user5',
    name: 'Sam Rodriguez',
    email: 'sam@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam'
  }
];

// Sample groups
export const sampleGroups: Group[] = [
  {
    id: 'group1',
    name: 'Apartment 4B',
    description: 'Expenses for our shared apartment',
    members: [sampleUsers[0], sampleUsers[1], sampleUsers[2]],
    createdBy: 'user1',
    createdAt: '2023-04-01T12:00:00Z'
  },
  {
    id: 'group2',
    name: 'Road Trip',
    description: 'Spring break road trip expenses',
    members: [sampleUsers[0], sampleUsers[2], sampleUsers[3], sampleUsers[4]],
    createdBy: 'user3',
    createdAt: '2023-03-15T09:30:00Z'
  },
  {
    id: 'group3',
    name: 'Office Lunch',
    description: 'Weekly office lunch rotation',
    members: [sampleUsers[0], sampleUsers[1], sampleUsers[4]],
    createdBy: 'user1',
    createdAt: '2023-04-05T14:20:00Z'
  }
];

// Sample expenses
export const sampleExpenses: Expense[] = [
  {
    id: 'exp1',
    groupId: 'group1',
    title: 'Rent - April',
    description: 'Monthly rent payment',
    amount: 1500,
    category: 'rent',
    paidBy: 'user1',
    date: '2023-04-01T09:00:00Z',
    splits: [
      { userId: 'user1', amount: 500, paid: true },
      { userId: 'user2', amount: 500, paid: false },
      { userId: 'user3', amount: 500, paid: true }
    ]
  },
  {
    id: 'exp2',
    groupId: 'group1',
    title: 'Groceries',
    description: 'Weekly grocery shopping',
    amount: 120,
    category: 'food',
    paidBy: 'user2',
    date: '2023-04-03T16:30:00Z',
    splits: [
      { userId: 'user1', amount: 40, paid: false },
      { userId: 'user2', amount: 40, paid: true },
      { userId: 'user3', amount: 40, paid: false }
    ]
  },
  {
    id: 'exp3',
    groupId: 'group1',
    title: 'Utilities',
    description: 'Electricity and water',
    amount: 210,
    category: 'utilities',
    paidBy: 'user3',
    date: '2023-04-05T11:15:00Z',
    splits: [
      { userId: 'user1', amount: 70, paid: true },
      { userId: 'user2', amount: 70, paid: true },
      { userId: 'user3', amount: 70, paid: true }
    ]
  },
  {
    id: 'exp4',
    groupId: 'group2',
    title: 'Gas',
    description: 'First gas refill',
    amount: 60,
    category: 'transport',
    paidBy: 'user3',
    date: '2023-03-16T10:00:00Z',
    splits: [
      { userId: 'user1', amount: 15, paid: true },
      { userId: 'user3', amount: 15, paid: true },
      { userId: 'user4', amount: 15, paid: false },
      { userId: 'user5', amount: 15, paid: true }
    ]
  },
  {
    id: 'exp5',
    groupId: 'group2',
    title: 'Hotel',
    description: 'Two nights stay',
    amount: 320,
    category: 'other',
    paidBy: 'user1',
    date: '2023-03-17T14:00:00Z',
    splits: [
      { userId: 'user1', amount: 80, paid: true },
      { userId: 'user3', amount: 80, paid: true },
      { userId: 'user4', amount: 80, paid: true },
      { userId: 'user5', amount: 80, paid: false }
    ]
  },
  {
    id: 'exp6',
    groupId: 'group2',
    title: 'Dinner',
    description: 'Steakhouse',
    amount: 180,
    category: 'food',
    paidBy: 'user4',
    date: '2023-03-18T19:30:00Z',
    splits: [
      { userId: 'user1', amount: 45, paid: false },
      { userId: 'user3', amount: 45, paid: true },
      { userId: 'user4', amount: 45, paid: true },
      { userId: 'user5', amount: 45, paid: false }
    ]
  },
  {
    id: 'exp7',
    groupId: 'group3',
    title: 'Pizza Day',
    description: 'Friday lunch pizzas',
    amount: 45,
    category: 'food',
    paidBy: 'user1',
    date: '2023-04-07T12:30:00Z',
    splits: [
      { userId: 'user1', amount: 15, paid: true },
      { userId: 'user2', amount: 15, paid: true },
      { userId: 'user5', amount: 15, paid: false }
    ]
  }
];
