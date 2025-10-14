import { domainsApi } from '@/lib/api/domains';
import { Domain } from '@/types/database';

export interface PricingContext {
  domain_id: string;
  base_amount?: number; // סכום בסיס (למשל מחיר מלא)
}

export interface PricingResult {
  calculatedPrice: number;
  explanation: string;
  domain: Domain;
}

/**
 * חישוב מחיר אוטומטי בהתאם להגדרות המחיר של התחום
 */
export async function calculatePrice(context: PricingContext): Promise<PricingResult | null> {
  try {
    const domain = await domainsApi.getById(context.domain_id);
    
    if (!domain || !domain.pricing_type || !domain.pricing_value) {
      return null;
    }

    let calculatedPrice = 0;
    let explanation = '';

    switch (domain.pricing_type) {
      case 'full':
        calculatedPrice = domain.pricing_value;
        explanation = `מחיר מלא: ₪${domain.pricing_value.toLocaleString()}`;
        break;

      case 'percentage':
        if (!context.base_amount) {
          explanation = `נדרש סכום בסיס לחישוב אחוזים (${domain.pricing_value}%)`;
          calculatedPrice = 0;
        } else {
          calculatedPrice = context.base_amount * (domain.pricing_value / 100);
          explanation = `${domain.pricing_value}% מתוך ₪${context.base_amount.toLocaleString()} = ₪${calculatedPrice.toLocaleString()}`;
        }
        break;

      case 'fixed':
        calculatedPrice = domain.pricing_value;
        explanation = `מחיר קבוע: ₪${domain.pricing_value.toLocaleString()}`;
        break;

      default:
        return null;
    }

    if (domain.pricing_notes) {
      explanation += ` (${domain.pricing_notes})`;
    }

    return {
      calculatedPrice,
      explanation,
      domain
    };
  } catch (error) {
    console.error('Error calculating price:', error);
    return null;
  }
}

/**
 * חישוב מחיר מרובה תחומים
 */
export async function calculateMultipleDomains(
  domainIds: string[],
  baseAmount?: number
): Promise<PricingResult[]> {
  const results: PricingResult[] = [];

  for (const domainId of domainIds) {
    const result = await calculatePrice({ domain_id: domainId, base_amount: baseAmount });
    if (result) {
      results.push(result);
    }
  }

  return results;
}

/**
 * סכום כולל לכל התחומים
 */
export function getTotalPrice(results: PricingResult[]): number {
  return results.reduce((sum, result) => sum + result.calculatedPrice, 0);
}
