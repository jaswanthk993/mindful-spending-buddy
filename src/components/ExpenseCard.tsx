import React from 'react';
import { cn } from '@/lib/utils';
import { Transaction, categories } from '@/utils/mockData';
import { formatCurrency } from '@/utils/savingsCalculator';
import { 
  ShoppingBag, 
  Coffee, 
  Film, 
  Car, 
  FileText, 
  Heart, 
  GraduationCap, 
  MoreHorizontal,
  Repeat,
  Info
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExpenseCardProps {
  transaction: Transaction;
  className?: string;
  style?: React.CSSProperties;
  onSplitExpense?: (transaction: Transaction) => void;
}

const CategoryIconMap = {
  food: Coffee,
  shopping: ShoppingBag,
  entertainment: Film,
  transportation: Car,
  bills: FileText,
  health: Heart,
  education: GraduationCap,
  other: MoreHorizontal
};

const ExpenseCard: React.FC<ExpenseCardProps> = ({ 
  transaction, 
  className, 
  style,
  onSplitExpense 
}) => {
  const { category, amount, description, date, merchant, isRecurring } = transaction;
  const categoryInfo = categories[category];
  const IconComponent = CategoryIconMap[category];
  
  // Format the date to be more readable
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  // Format the time
  const formattedTime = new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const handleSplitClick = () => {
    if (onSplitExpense) {
      onSplitExpense(transaction);
    }
  };

  return (
    <div 
      className={cn(
        'relative overflow-hidden p-4 rounded-xl bg-white border border-gray-100 transition-all duration-300 card-hover',
        className
      )}
      style={style}
    >
      <div className="flex items-start gap-3">
        <div className={`bg-gradient-to-br ${categoryInfo.color} p-2.5 rounded-lg text-white flex-shrink-0`}>
          <IconComponent className="h-5 w-5" />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-gray-900 mb-0.5">{merchant}</h3>
              {isRecurring && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-primary">
                        <Repeat className="h-3.5 w-3.5" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Recurring expense</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <span className="font-semibold">
              {formatCurrency(amount)}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-1">{description}</p>
          
          <div className="flex items-center mt-2 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <span>{formattedDate}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full mx-1"></span>
              <span>{formattedTime}</span>
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs bg-gradient-to-r ${categoryInfo.color} bg-opacity-10 text-white`}>
                {categoryInfo.label}
              </span>
              {amount > 100 && (
                <button 
                  onClick={handleSplitClick}
                  className="ml-1 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Split
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add a subtle shadow accent at the bottom of the card */}
      <div 
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryInfo.color} rounded-b-lg opacity-80`}
      ></div>
    </div>
  );
};

export default ExpenseCard;
