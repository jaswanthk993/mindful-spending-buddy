
// Calculate potential annual savings from a change in spending pattern
export const calculateAnnualSavings = (amount: number, frequency: 'daily' | 'weekly' | 'monthly' = 'weekly'): number => {
  let multiplier = 0;
  
  switch (frequency) {
    case 'daily':
      multiplier = 365; // Daily savings for a year
      break;
    case 'weekly':
      multiplier = 52; // Weekly savings for a year
      break;
    case 'monthly':
      multiplier = 12; // Monthly savings for a year
      break;
  }
  
  return amount * multiplier;
};

// Calculate future value of savings with investment returns
export const calculateInvestmentGrowth = (
  monthlySavings: number,
  years: number,
  interestRate: number = 0.08 // 8% average annual return
): number => {
  const monthlyRate = interestRate / 12;
  const months = years * 12;
  
  // Compound interest formula for regular monthly contributions
  let futureValue = 0;
  for (let i = 0; i < months; i++) {
    futureValue += monthlySavings;
    futureValue *= (1 + monthlyRate);
  }
  
  return Math.round(futureValue);
};

// Generate savings plan based on current spending
export const generateSavingsPlan = (
  discretionarySpending: number,
  essentialSpending: number
): {
  recommended: number;
  savingsGoal: number;
  monthsToGoal: number;
  investmentProjection: number;
} => {
  // Recommend saving 20% of discretionary spending
  const recommendedSavings = Math.round(discretionarySpending * 0.2);
  
  // Set a modest savings goal (e.g., 3 months of essential expenses)
  const savingsGoal = Math.round(essentialSpending * 3);
  
  // Calculate months to reach goal based on recommended savings
  const monthsToGoal = Math.ceil(savingsGoal / recommendedSavings);
  
  // Project 5-year investment growth of recommended monthly savings
  const investmentProjection = calculateInvestmentGrowth(recommendedSavings, 5);
  
  return {
    recommended: recommendedSavings,
    savingsGoal,
    monthsToGoal,
    investmentProjection
  };
};

// Format currency amounts for display
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Simulate UPI transfer for savings
export const simulateUPITransfer = async (amount: number): Promise<boolean> => {
  // This would connect to a real UPI API in production
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Mock successful transfer
      const success = Math.random() > 0.1; // 90% success rate
      resolve(success);
    }, 1500);
  });
};
