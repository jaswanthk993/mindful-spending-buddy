
import { Transaction, Category, categories } from './mockData';

// Simulated AI-powered categorization (would be replaced with actual ML model in production)
export const categorizeTransaction = (description: string, amount: number): Category => {
  description = description.toLowerCase();
  
  // Simple keyword-based categorization (simulating ML prediction)
  if (description.includes('food') || description.includes('restaurant') || 
      description.includes('cafe') || description.includes('coffee') || 
      description.includes('lunch') || description.includes('dinner')) {
    return 'food';
  }
  
  if (description.includes('movie') || description.includes('cinema') || 
      description.includes('netflix') || description.includes('subscription') || 
      description.includes('theater')) {
    return 'entertainment';
  }

  if (description.includes('uber') || description.includes('ola') || 
      description.includes('taxi') || description.includes('metro') || 
      description.includes('petrol') || description.includes('gas')) {
    return 'transportation';
  }

  if (description.includes('rent') || description.includes('bill') || 
      description.includes('electricity') || description.includes('water') || 
      description.includes('internet')) {
    return 'bills';
  }

  if (description.includes('medicine') || description.includes('doctor') || 
      description.includes('hospital') || description.includes('health') || 
      description.includes('pharmacy')) {
    return 'health';
  }

  if (description.includes('book') || description.includes('course') || 
      description.includes('class') || description.includes('education') || 
      description.includes('tuition')) {
    return 'education';
  }

  if (description.includes('shopping') || description.includes('store') || 
      description.includes('amazon') || description.includes('flipkart') || 
      description.includes('purchase')) {
    return 'shopping';
  }

  // Default to "other" if no matches found
  return 'other';
};

// Check if a merchant has recurring transactions
export const detectRecurringSpending = (
  transactions: Transaction[], 
  merchant: string
): boolean => {
  const merchantTransactions = transactions.filter(t => 
    t.merchant.toLowerCase() === merchant.toLowerCase()
  );
  
  // If user has multiple transactions at the same merchant, flag as recurring
  return merchantTransactions.length >= 2;
};

// Get spending recommendations based on transaction history
export const getSpendingRecommendations = (
  transactions: Transaction[]
): { merchant: string, amount: number, annualSavings: number }[] => {
  const merchantSpending: Record<string, { count: number, totalSpent: number }> = {};
  
  // Count frequency and total spending by merchant
  transactions.forEach(transaction => {
    const merchant = transaction.merchant.toLowerCase();
    if (!merchantSpending[merchant]) {
      merchantSpending[merchant] = { count: 0, totalSpent: 0 };
    }
    merchantSpending[merchant].count += 1;
    merchantSpending[merchant].totalSpent += transaction.amount;
  });
  
  // Generate recommendations for merchants with frequent transactions
  return Object.entries(merchantSpending)
    .filter(([_, data]) => data.count >= 2 && data.totalSpent > 500)
    .map(([merchant, data]) => {
      const averageSpend = data.totalSpent / data.count;
      // Calculate potential annual savings if user reduces frequency by 25%
      const potentialReduction = 0.25;
      const annualSavings = averageSpend * data.count * potentialReduction * (52 / 4); // Assuming 4 weeks of data
      
      return {
        merchant: merchant.charAt(0).toUpperCase() + merchant.slice(1),
        amount: Math.round(averageSpend),
        annualSavings: Math.round(annualSavings)
      };
    })
    .sort((a, b) => b.annualSavings - a.annualSavings)
    .slice(0, 3); // Return top 3 recommendations
};

// Get category distribution for UI visualization
export const getCategoryDistribution = (transactions: Transaction[]) => {
  const categoryTotals: Record<Category, number> = {} as Record<Category, number>;
  let totalSpent = 0;
  
  // Calculate total spending by category
  transactions.forEach(transaction => {
    categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
    totalSpent += transaction.amount;
  });
  
  // Calculate percentages for each category
  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category: category as Category,
    label: categories[category as Category].label,
    amount,
    percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
    color: categories[category as Category].color
  })).sort((a, b) => b.amount - a.amount);
};
