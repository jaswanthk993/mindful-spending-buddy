
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Loader2, 
  Lock,
  ArrowRight,
  Coins
} from 'lucide-react';
import { simulateUPITransfer } from '@/utils/savingsCalculator';
import { toast } from '@/components/ui/use-toast';

interface SavingsLockProps {
  amount: number;
  onComplete: () => void;
  onCancel: () => void;
}

const SavingsLock: React.FC<SavingsLockProps> = ({
  amount,
  onComplete,
  onCancel
}) => {
  const [status, setStatus] = useState<'initial' | 'processing' | 'success'>('initial');
  
  const handleTransfer = async () => {
    setStatus('processing');
    
    try {
      const success = await simulateUPITransfer(amount);
      
      if (success) {
        setStatus('success');
        toast({
          title: "Money saved successfully!",
          description: `₹${amount} locked in your savings account.`,
        });
        setTimeout(onComplete, 2000);
      } else {
        throw new Error("Transfer failed");
      }
    } catch (error) {
      toast({
        title: "Savings transfer failed",
        description: "Please try again later.",
        variant: "destructive"
      });
      setStatus('initial');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className={cn(
          "bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transition-all duration-300",
          status === 'initial' ? "scale-100" : status === 'processing' ? "scale-[1.02]" : "scale-100"
        )}
      >
        <div className="relative p-6">
          <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-primary to-accent"></div>
          
          {status === 'initial' && (
            <>
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </div>
              
              <h3 className="text-center text-xl font-semibold mb-2">Lock in Your Savings</h3>
              <p className="text-center text-gray-500 mb-6">
                Transfer ₹{amount} directly to your locked savings account for future goals.
              </p>
              
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="text-lg font-semibold">₹{amount}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-5 h-5 text-amber-500" />
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <div className="flex-grow p-2 bg-white border border-gray-200 rounded-lg">
                    <span className="font-medium">Locked Savings</span>
                    <div className="text-xs text-gray-400">Earn 4% interest p.a.</div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
                  onClick={handleTransfer}
                >
                  Transfer Now
                </Button>
              </div>
            </>
          )}
          
          {status === 'processing' && (
            <div className="py-8 flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <h3 className="text-center text-lg font-medium">Processing Transfer</h3>
              <p className="text-center text-gray-500 mt-2">
                Connecting to UPI to secure your savings...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="py-8 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-center text-lg font-medium">Transfer Complete!</h3>
              <p className="text-center text-gray-500 mt-2">
                ₹{amount} has been successfully locked in your savings.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavingsLock;
