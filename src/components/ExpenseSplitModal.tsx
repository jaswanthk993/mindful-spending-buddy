
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Users, Divide, Check, Plus, Minus } from 'lucide-react';
import { Transaction, categories } from '@/utils/mockData';
import { formatCurrency } from '@/utils/savingsCalculator';
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface ExpenseSplitModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSplitComplete: () => void;
}

interface Participant {
  id: string;
  name: string;
  amount: number;
  paid: boolean;
}

const ExpenseSplitModal: React.FC<ExpenseSplitModalProps> = ({ 
  transaction, 
  onClose, 
  onSplitComplete 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', name: 'You', amount: transaction.amount, paid: true },
    { id: '2', name: '', amount: 0, paid: false }
  ]);
  const [splitEqually, setSplitEqually] = useState(true);
  
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

  const addParticipant = () => {
    const newId = (Math.max(...participants.map(p => parseInt(p.id))) + 1).toString();
    setParticipants([...participants, { 
      id: newId, 
      name: '', 
      amount: 0, 
      paid: false 
    }]);
    
    // If splitting equally, recalculate amounts
    if (splitEqually) {
      redistributeAmounts(participants.length + 1);
    }
  };

  const removeParticipant = (id: string) => {
    if (participants.length <= 2) return; // Keep at least 2 participants
    
    const updatedParticipants = participants.filter(p => p.id !== id);
    setParticipants(updatedParticipants);
    
    // If splitting equally, recalculate amounts
    if (splitEqually) {
      redistributeAmounts(updatedParticipants.length);
    }
  };

  const updateParticipant = (id: string, field: keyof Participant, value: string | number | boolean) => {
    const updatedParticipants = participants.map(p => {
      if (p.id === id) {
        return { ...p, [field]: value };
      }
      return p;
    });
    setParticipants(updatedParticipants);
  };

  const redistributeAmounts = (count: number = participants.length) => {
    const equalAmount = parseFloat((transaction.amount / count).toFixed(2));
    const updatedParticipants = participants.map((p, index) => {
      // If it's the last participant, adjust for any rounding errors
      if (index === count - 1 && count > 1) {
        const sumOthers = equalAmount * (count - 1);
        return { 
          ...p, 
          amount: parseFloat((transaction.amount - sumOthers).toFixed(2)) 
        };
      }
      return { ...p, amount: equalAmount };
    });
    setParticipants(updatedParticipants.slice(0, count));
  };

  const toggleSplitEqually = () => {
    const newSplitEqually = !splitEqually;
    setSplitEqually(newSplitEqually);
    
    if (newSplitEqually) {
      redistributeAmounts();
    }
  };

  const handleComplete = () => {
    // Validation
    const hasEmptyNames = participants.some(p => p.id !== '1' && !p.name.trim());
    if (hasEmptyNames) {
      toast({
        title: "Missing information",
        description: "Please provide names for all participants.",
        variant: "destructive"
      });
      return;
    }
    
    const total = participants.reduce((sum, p) => sum + p.amount, 0);
    if (Math.abs(total - transaction.amount) > 0.01) {
      toast({
        title: "Invalid split",
        description: `The total amount (${formatCurrency(total)}) doesn't match the transaction amount (${formatCurrency(transaction.amount)}).`,
        variant: "destructive"
      });
      return;
    }
    
    // Process the split (in a real app, this would save to database)
    toast({
      title: "Split created",
      description: `Split request sent to ${participants.filter(p => p.id !== '1').length} people.`,
    });
    
    onSplitComplete();
    handleClose();
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
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-purple-400 to-blue-500"></div>
          
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <span>Split Expense</span>
            </h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="font-medium">{transaction.merchant}</p>
                  <p className="text-sm text-gray-500">{transaction.description}</p>
                </div>
                <span className="font-bold">{formatCurrency(transaction.amount)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-sm font-medium">Participants</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1 text-xs"
                  onClick={toggleSplitEqually}
                >
                  {splitEqually ? (
                    <>
                      <Divide className="h-3.5 w-3.5" />
                      <span>Split Equally</span>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    </>
                  ) : (
                    <>
                      <Divide className="h-3.5 w-3.5" />
                      <span>Custom Split</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
                {participants.map((participant, index) => (
                  <div key={participant.id} className="flex items-center gap-2">
                    <div className="flex-grow">
                      <Input
                        value={participant.name}
                        onChange={(e) => updateParticipant(participant.id, 'name', e.target.value)}
                        placeholder="Enter name"
                        className="text-sm"
                        disabled={participant.id === '1'} // "You" can't be edited
                      />
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        value={participant.amount}
                        onChange={(e) => updateParticipant(
                          participant.id, 
                          'amount', 
                          parseFloat(e.target.value) || 0
                        )}
                        className="text-sm"
                        disabled={splitEqually}
                        min="0"
                        max={transaction.amount}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeParticipant(participant.id)}
                      disabled={participants.length <= 2 || participant.id === '1'}
                    >
                      <Minus className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3 text-xs"
                onClick={addParticipant}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                <span>Add Person</span>
              </Button>
            </div>
            
            <Button 
              onClick={handleComplete}
              className="w-full bg-gradient-to-r from-purple-400 to-blue-500 text-white hover:opacity-90"
            >
              <Check className="h-4 w-4 mr-2" />
              <span>Complete Split</span>
            </Button>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              Split requests will be sent to all participants via SMS or UPI apps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSplitModal;
