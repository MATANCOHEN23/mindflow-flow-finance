import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useDomains } from '@/hooks/useDomains';
import { Loader2 } from 'lucide-react';

interface PriceCalculatorStepProps {
  wizardData: any;
  setWizardData: (data: any) => void;
}

export function PriceCalculatorStep({ wizardData, setWizardData }: PriceCalculatorStepProps) {
  const { data: allDomains, isLoading } = useDomains();
  const [calculating, setCalculating] = useState(true);

  useEffect(() => {
    if (!allDomains || wizardData.selectedDomains.length === 0) return;

    const calculatePricing = async () => {
      setCalculating(true);
      
      // Simulate calculation delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const breakdown = wizardData.selectedDomains.map((domainId: string) => {
        const domain = allDomains.find(d => d.id === domainId);
        if (!domain) return null;

        let price = 0;
        let explanation = '';

        if (domain.pricing_type === 'fixed') {
          price = domain.pricing_value || 0;
          explanation = `מחיר קבוע: ₪${price.toLocaleString()}`;
        } else if (domain.pricing_type === 'percentage') {
          // For percentage, we'll show a placeholder
          price = 0;
          explanation = `${domain.pricing_value}% מהסכום הכולל (יחושב בעסקה)`;
        } else if (domain.pricing_type === 'full') {
          price = 0;
          explanation = 'מחיר מלא (יקבע בעסקה)';
        } else {
          price = 0;
          explanation = 'ללא תמחור מוגדר';
        }

        return {
          domainName: domain.name,
          domainIcon: domain.icon || '📌',
          price,
          explanation
        };
      }).filter(Boolean);

      const totalPrice = breakdown.reduce((sum: number, item: any) => sum + item.price, 0);

      setWizardData({
        ...wizardData,
        pricing: {
          totalPrice,
          breakdown
        }
      });

      setCalculating(false);
    };

    calculatePricing();
  }, [allDomains, wizardData.selectedDomains]);

  if (isLoading || calculating) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">מחשב מחיר...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center mb-4">💰 חישוב מחיר משוער</h3>
      
      {wizardData.pricing.breakdown.map((item: any, index: number) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{item.domainIcon}</span>
              <span className="font-semibold">{item.domainName}</span>
            </div>
            {item.price > 0 && (
              <span className="font-bold text-lg">₪{item.price.toLocaleString()}</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{item.explanation}</p>
        </Card>
      ))}

      {wizardData.pricing.totalPrice > 0 && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-800">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>סה"כ משוער</span>
            <span className="text-green-700 dark:text-green-400">
              ₪{wizardData.pricing.totalPrice.toLocaleString()}
            </span>
          </div>
        </Card>
      )}

      {wizardData.pricing.totalPrice === 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 המחיר הסופי ייקבע בעת יצירת העסקה, בהתאם לסוג התמחור של כל תחום
          </p>
        </Card>
      )}
    </div>
  );
}
