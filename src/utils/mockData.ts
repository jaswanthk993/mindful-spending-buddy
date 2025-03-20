
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: Category;
  date: string;
  merchant: string;
  isRecurring: boolean;
}

export type Category = 
  | 'food' 
  | 'shopping' 
  | 'entertainment' 
  | 'transportation' 
  | 'bills' 
  | 'health' 
  | 'education' 
  | 'other';

export const categories: Record<Category, { label: string, color: string, icon: string }> = {
  food: { 
    label: 'Food & Dining', 
    color: 'from-orange-400 to-amber-500', 
    icon: 'utensils' 
  },
  shopping: { 
    label: 'Shopping', 
    color: 'from-blue-400 to-cyan-500', 
    icon: 'shopping-bag' 
  },
  entertainment: { 
    label: 'Entertainment', 
    color: 'from-purple-400 to-indigo-500', 
    icon: 'film' 
  },
  transportation: { 
    label: 'Transportation', 
    color: 'from-green-400 to-emerald-500', 
    icon: 'car' 
  },
  bills: { 
    label: 'Bills & Utilities', 
    color: 'from-red-400 to-rose-500', 
    icon: 'file-invoice' 
  },
  health: { 
    label: 'Health & Medical', 
    color: 'from-teal-400 to-green-500', 
    icon: 'heartbeat' 
  },
  education: { 
    label: 'Education', 
    color: 'from-yellow-400 to-amber-500', 
    icon: 'graduation-cap' 
  },
  other: { 
    label: 'Other', 
    color: 'from-gray-400 to-slate-500', 
    icon: 'ellipsis-h' 
  }
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    amount: 250.00,
    description: 'Lunch with colleagues',
    category: 'food',
    date: '2023-09-15T12:30:00',
    merchant: 'Chai Coffee Day',
    isRecurring: false
  },
  {
    id: '2',
    amount: 1200.00,
    description: 'New headphones',
    category: 'shopping',
    date: '2023-09-14T15:45:00',
    merchant: 'Electronics Store',
    isRecurring: false
  },
  {
    id: '3',
    amount: 500.00,
    description: 'Movie tickets',
    category: 'entertainment',
    date: '2023-09-10T19:00:00',
    merchant: 'PVR Cinemas',
    isRecurring: false
  },
  {
    id: '4',
    amount: 2000.00,
    description: 'Monthly rent payment',
    category: 'bills',
    date: '2023-09-01T09:00:00',
    merchant: 'Housing Society',
    isRecurring: true
  },
  {
    id: '5',
    amount: 150.00,
    description: 'Uber ride',
    category: 'transportation',
    date: '2023-09-13T18:30:00',
    merchant: 'Uber',
    isRecurring: false
  },
  {
    id: '6',
    amount: 300.00,
    description: 'Pharmacy purchase',
    category: 'health',
    date: '2023-09-08T11:20:00',
    merchant: 'Apollo Pharmacy',
    isRecurring: false
  },
  {
    id: '7',
    amount: 1500.00,
    description: 'Online course',
    category: 'education',
    date: '2023-09-05T14:15:00',
    merchant: 'Udemy',
    isRecurring: false
  },
  {
    id: '8',
    amount: 280.00,
    description: 'Coffee with friends',
    category: 'food',
    date: '2023-09-12T10:00:00',
    merchant: 'Chai Coffee Day',
    isRecurring: true
  }
];

export const getRecentTransactions = (count: number = 5): Transaction[] => {
  return [...mockTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, count);
};

export const getTotalSpentByCategory = (): Record<Category, number> => {
  return mockTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<Category, number>);
};

export const getRecurringTransactions = (): Transaction[] => {
  return mockTransactions.filter(transaction => transaction.isRecurring);
};

export const getTotalSpent = (): number => {
  return mockTransactions.reduce((total, transaction) => total + transaction.amount, 0);
};
