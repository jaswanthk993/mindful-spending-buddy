
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2, CreditCard, Sparkles, Brain } from 'lucide-react';
import { Category, categories } from '@/utils/mockData';
import { categorizeTransaction } from '@/utils/categoryUtils';
import { cn } from '@/lib/utils';

interface TransactionFormProps {
  onClose: () => void;
  onAddTransaction: (transaction: {
    amount: number;
    description: string;
    merchant: string;
    category: Category;
    isRecurring?: boolean;
  }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [similarTransactions, setSimilarTransactions] = useState<string[]>([]);
  
  React.useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Auto-categorize whenever description or merchant changes
  useEffect(() => {
    if (description.trim() || merchant.trim()) {
      const combinedText = `${description} ${merchant}`.trim();
      if (combinedText.length > 3) {
        handlePredictCategory();
      }
    }
  }, [description, merchant]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete
    setTimeout(onClose, 300);
  };

  const handlePredictCategory = () => {
    if ((description.trim() || merchant.trim()) && amount) {
      setIsPredicting(true);
      
      setTimeout(() => {
        const predictedCategory = categorizeTransaction(
          `${description} ${merchant}`.trim(), 
          parseFloat(amount || '0')
        );
        
        setCategory(predictedCategory);
        
        // Simulate finding similar transactions
        if (merchant.trim().length > 2) {
          const potentialSimilar = [
            `${merchant} - Coffee and snacks`,
            `${merchant} - Lunch`,
            `${merchant} - Shopping`
          ];
          setSimilarTransactions(potentialSimilar);
          
          // If we find similar transactions, suggest it might be recurring
          setIsRecurring(true);
        } else {
          setSimilarTransactions([]);
          setIsRecurring(false);
        }
        
        setIsPredicting(false);
      }, 800); // Simulate ML processing time
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !merchant || !category) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onAddTransaction({
        amount: parseFloat(amount),
        description,
        merchant,
        category,
        isRecurring
      });
      
      handleClose();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className={cn(
          "bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all duration-300",
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}
      >
        <div className="relative">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-primary to-accent"></div>
          
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h2 className="text-lg font-medium">Add New Transaction</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex gap-4 mb-4">
              <div className="w-full">
                <Label htmlFor="amount" className="mb-1.5 block text-sm">
                  Amount
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</div>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="w-full">
                <Label htmlFor="merchant" className="mb-1.5 block text-sm">
                  Merchant
                </Label>
                <Input
                  id="merchant"
                  placeholder="Where did you spend?"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="description" className="mb-1.5 block text-sm">
                Description
              </Label>
              <div className="flex gap-2">
                <Input
                  id="description"
                  placeholder="What did you buy?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex-grow"
                  required
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePredictCategory}
                  disabled={(!description && !merchant) || !amount || isPredicting}
                >
                  {isPredicting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {similarTransactions.length > 0 && (
                <div className="mt-2 p-2 bg-amber-50 rounded-md text-xs">
                  <div className="flex items-center gap-1 text-amber-700 mb-1">
                    <Brain className="h-3.5 w-3.5" />
                    <span className="font-medium">AI detected similar transactions:</span>
                  </div>
                  <ul className="pl-4 text-amber-600 list-disc">
                    {similarTransactions.map((transaction, index) => (
                      <li key={index}>{transaction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <Label className="text-sm">Category</Label>
                {isPredicting && (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Predicting...
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(categories).map(([key, { label, color }]) => (
                  <Button
                    key={key}
                    type="button"
                    className={cn(
                      'h-auto py-1.5 px-2 flex flex-col items-center justify-center rounded-lg border transition-all',
                      category === key 
                        ? `bg-gradient-to-r ${color} text-white border-transparent` 
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    )}
                    onClick={() => setCategory(key as Category)}
                  >
                    <span className="text-xs font-normal">{label}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-5">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="isRecurring" className="text-sm cursor-pointer">
                  This is a recurring expense
                </Label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
              disabled={loading || !amount || !description || !merchant || !category}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Add Transaction</span>
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
