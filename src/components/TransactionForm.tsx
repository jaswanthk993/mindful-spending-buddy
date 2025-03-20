
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Loader2, CreditCard } from 'lucide-react';
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
  }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, onAddTransaction }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  React.useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete
    setTimeout(onClose, 300);
  };

  const handlePredictCategory = () => {
    if (description.trim() && amount) {
      const predictedCategory = categorizeTransaction(
        description, 
        parseFloat(amount)
      );
      setCategory(predictedCategory);
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
                  disabled={!description || !amount}
                >
                  Auto-categorize
                </Button>
              </div>
            </div>
            
            <div className="mb-5">
              <Label className="mb-1.5 block text-sm">
                Category
              </Label>
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
