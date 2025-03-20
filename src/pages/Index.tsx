import React, { useState, useEffect, useRef } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { 
  ChevronRight, 
  TrendingUp, 
  CreditCard, 
  Clock,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Bell,
  Target,
  Coffee,
  ShoppingBag
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import ExpenseCard from '@/components/ExpenseCard';
import RecommendationAlert from '@/components/RecommendationAlert';
import SavingsLock from '@/components/SavingsLock';
import TransactionForm from '@/components/TransactionForm';
import ExpenseSplitModal from '@/components/ExpenseSplitModal';
import { 
  Transaction, 
  Category, 
  getRecentTransactions, 
  getTotalSpentByCategory, 
  categories
} from '@/utils/mockData';
import { 
  getCategoryDistribution, 
  getSpendingRecommendations 
} from '@/utils/categoryUtils';
import { formatCurrency } from '@/utils/savingsCalculator';

const Index = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [showSavingsLock, setShowSavingsLock] = useState(false);
  const [currentRecommendation, setCurrentRecommendation] = useState<{
    merchant: string;
    amount: number;
    annualSavings: number;
  } | null>(null);
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const refsMap = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // New state variables for expense splitting
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [transactionToSplit, setTransactionToSplit] = useState<Transaction | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);
  
  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      // Simulate data loading delay for animation purposes
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const transactions = getRecentTransactions();
      setRecentTransactions(transactions);
      
      const distribution = getCategoryDistribution(transactions);
      setCategoryData(distribution);
      
      // Show recommendation after a delay
      setTimeout(() => {
        const recommendations = getSpendingRecommendations(transactions);
        if (recommendations.length > 0) {
          setCurrentRecommendation(recommendations[0]);
          setShowRecommendation(true);
        }
      }, 3000);
      
      setIsPageLoaded(true);
      
      // Simulate notifications
      setTimeout(() => {
        setHasNotifications(true);
      }, 5000);
    };
    
    loadData();
  }, []);

  // Generate weekly spending data for the chart
  const weeklyData = [
    { name: 'Mon', amount: 350 },
    { name: 'Tue', amount: 420 },
    { name: 'Wed', amount: 280 },
    { name: 'Thu', amount: 590 },
    { name: 'Fri', amount: 810 },
    { name: 'Sat', amount: 720 },
    { name: 'Sun', amount: 400 }
  ];

  const handleAddTransaction = (newTransaction: {
    amount: number;
    description: string;
    merchant: string;
    category: Category;
  }) => {
    const transaction: Transaction = {
      id: `temp-${Date.now()}`,
      date: new Date().toISOString(),
      isRecurring: false,
      ...newTransaction
    };
    
    setRecentTransactions(prev => [transaction, ...prev]);
    
    toast({
      title: "Transaction added",
      description: `Added ${formatCurrency(newTransaction.amount)} at ${newTransaction.merchant}`,
    });
  };

  const handleSaveInstead = () => {
    if (currentRecommendation) {
      setSavingsAmount(Math.floor(currentRecommendation.amount / 2));
      setShowRecommendation(false);
      setShowSavingsLock(true);
    }
  };
  
  const handleSavingsComplete = () => {
    setShowSavingsLock(false);
    
    // Add an artificial delay before showing toast
    setTimeout(() => {
      toast({
        title: "Savings goal update",
        description: `${formatCurrency(savingsAmount)} added to your annual savings goal!`,
      });
    }, 500);
  };

  // New handlers for expense splitting
  const handleSplitExpense = (transaction: Transaction) => {
    setTransactionToSplit(transaction);
    setShowSplitModal(true);
  };
  
  const handleSplitComplete = () => {
    // In a real app, this would update the transaction in the database
    setTransactionToSplit(null);
  };

  const handleNotificationsClick = () => {
    setHasNotifications(false);
    toast({
      title: "Notifications",
      description: "You have 3 new spending alerts and 2 pending split expenses.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header 
        onAddTransaction={() => setShowAddTransaction(true)} 
        hasNotifications={hasNotifications}
        onNotificationsClick={handleNotificationsClick}
      />
      
      <main className="pt-20 px-4 mx-auto max-w-4xl">
        {/* Dashboard overview section */}
        <section 
          className={`transition-all duration-700 transform ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-center mb-8 mt-4">
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-3 animate-fade-in">
              Your spending buddy
            </div>
            <h1 className="text-3xl font-bold mb-3">Financial Overview</h1>
            <p className="text-gray-500 max-w-md mx-auto">
              Track your spending habits and make mindful financial decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 h-[300px] animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium text-lg">Weekly Spending</h3>
                  <p className="text-sm text-gray-500">Your spending pattern</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-xs">This Week</span>
                </Button>
              </div>
              
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#888' }}
                    />
                    <YAxis 
                      hide={true}
                      axisLine={false} 
                      tickLine={false} 
                    />
                    <Tooltip 
                      formatter={(value) => [`₹${value}`, 'Amount']}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Bar 
                      dataKey="amount" 
                      fill="url(#colorGradient)" 
                      barSize={30} 
                      radius={[4, 4, 0, 0]} 
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div 
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 h-[300px] animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium text-lg">Spending by Category</h3>
                  <p className="text-sm text-gray-500">Where your money goes</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">This Month</span>
                </Button>
              </div>
              
              <div className="flex h-[200px]">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="amount"
                        animationDuration={1000}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={`hsl(${index * 40}, 70%, 60%)`} 
                            strokeWidth={1}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`₹${value}`, 'Spent']}
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="w-1/2 pl-2 flex flex-col justify-center">
                  <div className="space-y-2 overflow-y-auto max-h-[190px] pr-2">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: `hsl(${index * 40}, 70%, 60%)` }}
                          ></div>
                          <span className="text-xs text-gray-600">{category.label}</span>
                        </div>
                        <span className="text-xs font-medium">{category.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Recent transactions section */}
        <section 
          className={`mb-10 transition-all duration-700 transform ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <p className="text-sm text-gray-500">Your latest spending activity</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <span>View All</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentTransactions.map((transaction, index) => (
              <ExpenseCard 
                key={transaction.id} 
                transaction={transaction} 
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onSplitExpense={handleSplitExpense}
              />
            ))}
            
            {recentTransactions.length === 0 && (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-gray-500">No transactions yet. Add your first expense!</p>
                <Button 
                  className="mt-4"
                  onClick={() => setShowAddTransaction(true)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Add Transaction</span>
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Monthly goals section - New! (Addressing gamification from could-have features) */}
        <section 
          className={`mb-10 transition-all duration-700 transform ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: '0.25s' }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold">Monthly Goals</h2>
              <p className="text-sm text-gray-500">Track your financial achievements</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Target className="h-4 w-4" />
              <span>Set New Goal</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-1.5 rounded-md">
                    <Coffee className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-sm">Dining Budget</span>
                </div>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                  On track
                </span>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹6,500 spent</span>
                <span>₹10,000 budget</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-100 p-1.5 rounded-md">
                    <ShoppingBag className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="font-medium text-sm">Shopping Limit</span>
                </div>
                <span className="text-xs bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">
                  Warning
                </span>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹8,500 spent</span>
                <span>₹10,000 budget</span>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-sm">Savings Goal</span>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  In progress
                </span>
              </div>
              
              <div className="h-2 bg-gray-100 rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: '40%' }}></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹20,000 saved</span>
                <span>₹50,000 goal</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Insights section */}
        <section 
          className={`transition-all duration-700 transform ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.3s' }}
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-semibold">Financial Insights</h2>
              <p className="text-sm text-gray-500">AI-powered recommendations</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm card-hover">
              <div className="flex items-start gap-3">
                <div className="bg-cyan-100 text-cyan-600 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Spending Trends</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your weekend spending is 40% higher than weekdays. Consider setting a weekend budget.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm card-hover">
              <div className="flex items-start gap-3">
                <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Recurring Expenses</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    You have 2 subscription services you rarely use. Consider canceling to save ₹1,200/month.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm card-hover">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Savings Opportunity</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Reducing dining out by just 1 meal/week could save you ₹24,000 annually.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/90 to-accent/90 text-white rounded-xl p-4 shadow-sm card-hover">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <ArrowUpRight className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Investment Potential</h3>
                  <p className="text-sm text-white/80 mt-1">
                    Investing ₹5,000 monthly could grow to ₹8.4 lakhs in 10 years at 12% returns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Show recommendation alert */}
      {showRecommendation && currentRecommendation && (
        <RecommendationAlert
          merchant={currentRecommendation.merchant}
          amount={currentRecommendation.amount}
          annualSavings={currentRecommendation.annualSavings}
          onClose={() => setShowRecommendation(false)}
          onSave={handleSaveInstead}
        />
      )}
      
      {/* Show savings lock dialog */}
      {showSavingsLock && (
        <SavingsLock
          amount={savingsAmount}
          onComplete={handleSavingsComplete}
          onCancel={() => setShowSavingsLock(false)}
        />
      )}
      
      {/* Show add transaction form */}
      {showAddTransaction && (
        <TransactionForm 
          onClose={() => setShowAddTransaction(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}
      
      {/* Show expense split modal */}
      {showSplitModal && transactionToSplit && (
        <ExpenseSplitModal
          transaction={transactionToSplit}
          onClose={() => setShowSplitModal(false)}
          onSplitComplete={handleSplitComplete}
        />
      )}
    </div>
  );
};

export default Index;
