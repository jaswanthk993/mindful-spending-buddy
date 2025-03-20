
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { X, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { formatCurrency } from '@/utils/savingsCalculator';

interface RecommendationAlertProps {
  merchant: string;
  amount: number;
  annualSavings: number;
  onClose: () => void;
  onSave: () => void;
}

const RecommendationAlert: React.FC<RecommendationAlertProps> = ({
  merchant,
  amount,
  annualSavings,
  onClose,
  onSave
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animate in after mounting
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Allow animation to complete before fully removing
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={cn(
        'fixed bottom-6 left-0 right-0 mx-auto w-[90%] max-w-md z-40 transition-all duration-300 transform',
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-12 opacity-0'
      )}
    >
      <div className="relative overflow-hidden rounded-xl bg-white border border-gray-100 shadow-lg p-4">
        <div className="absolute top-3 right-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-amber-100 text-amber-600 p-2 rounded-lg">
            <AlertTriangle className="h-5 w-5" />
          </div>
          
          <div className="pt-1">
            <h3 className="font-medium text-base">Spending Pattern Detected</h3>
            <p className="text-sm text-gray-500 mt-1">
              You frequently spend at <span className="font-medium">{merchant}</span>
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Average spend</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-accent mr-1.5" />
              <span className="text-sm font-medium text-accent">Potential annual savings</span>
            </div>
            <span className="font-bold text-accent">{formatCurrency(annualSavings)}</span>
          </div>
        </div>
        
        <Button 
          onClick={onSave}
          className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-all"
        >
          <Zap className="h-4 w-4 mr-2" />
          <span>Save {formatCurrency(amount/2)} Instead</span>
        </Button>
        
        {/* Add a pulse animation to draw attention */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-lg opacity-30 animate-pulse-subtle -z-10"></div>
      </div>
    </div>
  );
};

export default RecommendationAlert;
