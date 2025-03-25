"""
Expense Categorizer
------------------
A rule-based system for categorizing expenses based on their descriptions and amounts.
"""

import logging
from typing import Dict, List, Optional
from pathlib import Path
import json
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class ExpenseCategorizer:
    """A rule-based system for categorizing expenses based on their descriptions."""
    
    def __init__(self, rules_path: str = 'models/expense_rules.json'):
        """
        Initialize the ExpenseCategorizer.
        
        Args:
            rules_path (str): Path to save/load the categorization rules
        """
        self.rules_path = Path(rules_path)
        self.categories = [
            'Food & Dining',
            'Transportation',
            'Entertainment',
            'Bills & Utilities',
            'Shopping',
            'Healthcare',
            'Education',
            'Travel',
            'Other'
        ]
        
        # Define rules for each category
        self.rules = {
            'Food & Dining': {
                'keywords': [
                    'restaurant', 'cafe', 'food', 'grocery', 'dinner', 'lunch', 
                    'breakfast', 'pizza', 'delivery', 'supermarket', 'bakery',
                    'chai', 'coffee', 'tea', 'snacks', 'meal', 'dining'
                ],
                'amount_ranges': [
                    (0, 100),    # Small food items
                    (100, 500),  # Regular meals
                    (500, 2000), # Groceries
                    (2000, float('inf'))  # Bulk purchases
                ]
            },
            'Transportation': {
                'keywords': [
                    'metro', 'train', 'bus', 'auto', 'rickshaw', 'petrol',
                    'diesel', 'parking', 'car', 'bike', 'ola', 'uber',
                    'cab', 'ticket', 'pass', 'fare', 'fuel'
                ],
                'amount_ranges': [
                    (0, 50),     # Small fares
                    (50, 500),   # Regular transport
                    (500, 2000), # Vehicle maintenance
                    (2000, float('inf'))  # Major repairs
                ]
            },
            'Entertainment': {
                'keywords': [
                    'movie', 'concert', 'theater', 'netflix', 'game',
                    'show', 'amusement', 'park', 'museum', 'zoo',
                    'bowling', 'subscription', 'entertainment'
                ],
                'amount_ranges': [
                    (0, 200),    # Small entertainment
                    (200, 1000), # Regular entertainment
                    (1000, float('inf'))  # Premium entertainment
                ]
            },
            'Bills & Utilities': {
                'keywords': [
                    'bill', 'rent', 'utility', 'electricity', 'water',
                    'internet', 'broadband', 'mobile', 'lpg', 'cylinder',
                    'cable', 'tv', 'garbage', 'insurance'
                ],
                'amount_ranges': [
                    (0, 500),     # Small bills
                    (500, 5000),  # Regular bills
                    (5000, 20000), # Major bills
                    (20000, float('inf'))  # Large payments
                ]
            },
            'Shopping': {
                'keywords': [
                    'store', 'shop', 'purchase', 'buy', 'mall',
                    'clothing', 'electronics', 'decor', 'furniture',
                    'online', 'shopping', 'retail'
                ],
                'amount_ranges': [
                    (0, 500),     # Small purchases
                    (500, 5000),  # Regular shopping
                    (5000, float('inf'))  # Major purchases
                ]
            },
            'Healthcare': {
                'keywords': [
                    'doctor', 'medical', 'health', 'dental', 'pharmacy',
                    'hospital', 'clinic', 'medicine', 'checkup', 'test',
                    'insurance', 'ayurvedic', 'therapy'
                ],
                'amount_ranges': [
                    (0, 500),     # Small medical expenses
                    (500, 5000),  # Regular healthcare
                    (5000, float('inf'))  # Major medical expenses
                ]
            },
            'Education': {
                'keywords': [
                    'school', 'college', 'tuition', 'course', 'textbook',
                    'stationery', 'coaching', 'exam', 'library', 'education',
                    'study', 'learning', 'training'
                ],
                'amount_ranges': [
                    (0, 1000),    # Small educational expenses
                    (1000, 10000), # Regular education
                    (10000, float('inf'))  # Major education expenses
                ]
            },
            'Travel': {
                'keywords': [
                    'flight', 'hotel', 'tour', 'travel', 'booking',
                    'ticket', 'sightseeing', 'guide', 'tourism',
                    'vacation', 'holiday', 'trip'
                ],
                'amount_ranges': [
                    (0, 2000),    # Small travel expenses
                    (2000, 10000), # Regular travel
                    (10000, float('inf'))  # Major travel expenses
                ]
            },
            'Other': {
                'keywords': [
                    'gym', 'pet', 'office', 'cleaning', 'subscription',
                    'charity', 'donation', 'bank', 'charges', 'haircut',
                    'religious', 'miscellaneous'
                ],
                'amount_ranges': [
                    (0, 500),     # Small miscellaneous
                    (500, 2000),  # Regular miscellaneous
                    (2000, float('inf'))  # Large miscellaneous
                ]
            }
        }
        
        # Save rules to file
        self.save_rules()

    def save_rules(self) -> None:
        """Save the categorization rules to disk."""
        self.rules_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            with open(self.rules_path, 'w') as f:
                json.dump(self.rules, f, indent=4)
            logger.info(f"Rules saved to {self.rules_path}")
        except Exception as e:
            logger.error(f"Error saving rules: {str(e)}")
            raise

    def load_rules(self) -> None:
        """Load the categorization rules from disk."""
        try:
            with open(self.rules_path, 'r') as f:
                self.rules = json.load(f)
            logger.info(f"Rules loaded from {self.rules_path}")
        except FileNotFoundError:
            logger.warning(f"Rules file not found at {self.rules_path}, using default rules")
        except Exception as e:
            logger.error(f"Error loading rules: {str(e)}")
            raise

    def preprocess_text(self, text: str) -> str:
        """
        Preprocess text by cleaning and standardizing it.
        
        Args:
            text (str): Input text to preprocess
            
        Returns:
            str: Preprocessed text
        """
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and extra spaces
        text = re.sub(r'[^a-z0-9\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text

    def calculate_category_score(self, text: str, amount: float, category: str) -> float:
        """
        Calculate a score for a category based on text and amount.
        
        Args:
            text (str): Expense description
            amount (float): Transaction amount
            category (str): Category to score
            
        Returns:
            float: Score for the category
        """
        score = 0.0
        text = self.preprocess_text(text)
        
        # Check keyword matches
        for keyword in self.rules[category]['keywords']:
            if keyword in text:
                score += 1.0
        
        # Check amount ranges
        for min_amount, max_amount in self.rules[category]['amount_ranges']:
            if min_amount <= amount < max_amount:
                score += 0.5
                break
        
        return score

    def predict_category(self, description: str, amount: float = 0.0) -> Dict[str, str]:
        """
        Predict the category for a new expense description.
        
        Args:
            description (str): The expense description to categorize
            amount (float): The transaction amount
            
        Returns:
            Dict[str, str]: Predicted category and confidence score
            
        Raises:
            ValueError: If the input description is invalid
        """
        if not description or not isinstance(description, str):
            raise ValueError("Invalid description provided")
        
        # Calculate scores for each category
        category_scores = {}
        for category in self.categories:
            score = self.calculate_category_score(description, amount, category)
            category_scores[category] = score
        
        # Get the category with the highest score
        best_category = max(category_scores.items(), key=lambda x: x[1])
        max_score = best_category[1]
        
        # Calculate confidence (normalize score)
        total_score = sum(category_scores.values())
        confidence = max_score / total_score if total_score > 0 else 0.0
        
        # Get top 3 predictions
        top_3 = sorted(category_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        top_3_predictions = [
            {
                'category': category,
                'confidence': f"{score/total_score:.2f}" if total_score > 0 else "0.00"
            }
            for category, score in top_3
        ]
        
        return {
            'category': best_category[0],
            'confidence': f"{confidence:.2f}",
            'top_3_predictions': top_3_predictions
        }

def main():
    """Main function to demonstrate the expense categorizer."""
    try:
        # Initialize the categorizer
        categorizer = ExpenseCategorizer()
        
        # Test predictions
        test_cases = [
            ("dinner at Italian restaurant", 450.00),
            ("monthly rent payment", 15000.00),
            ("movie tickets and popcorn", 300.00),
            ("metro ride to office", 25.00),
            ("grocery shopping at Big Bazaar", 1200.00)
        ]
        
        logger.info("\nTesting predictions:")
        for desc, amount in test_cases:
            try:
                result = categorizer.predict_category(desc, amount)
                logger.info(f"\nDescription: {desc}")
                logger.info(f"Amount: ₹{amount:.2f}")
                logger.info(f"Predicted Category: {result['category']}")
                logger.info(f"Confidence: {result['confidence']}")
                logger.info("Top 3 predictions:")
                for pred in result['top_3_predictions']:
                    logger.info(f"  {pred['category']} ({pred['confidence']})")
            except Exception as e:
                logger.error(f"Error predicting category for '{desc}': {str(e)}")
            
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    main()
