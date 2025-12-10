import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useDomains } from '@/hooks/useDomains';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Package } from 'lucide-react';

interface PricingPackage {
  id: string;
  name: string;
  name_he: string;
  price: number;
  sessions_count: number;
  domain_id: string;
}

interface SubDomain {
  id: string;
  name: string;
  icon: string | null;
  pricing_type: string | null;
  pricing_value: number | null;
  parent_id: string;
}

interface PriceCalculatorStepProps {
  wizardData: any;
  setWizardData: (data: any) => void;
}

export function PriceCalculatorStep({ wizardData, setWizardData }: PriceCalculatorStepProps) {
  const { data: allDomains, isLoading: domainsLoading } = useDomains();
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
  const [subDomains, setSubDomains] = useState<SubDomain[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Fetch pricing packages and sub-domains
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch pricing packages
      const { data: packages } = await supabase
        .from('pricing_packages')
        .select('*')
        .eq('is_active', true)
        .order('sessions_count');
      
      // Fetch sub-domains for selected main domains
      if (wizardData.selectedDomains.length > 0) {
        const { data: subs } = await supabase
          .from('domains')
          .select('id, name, icon, pricing_type, pricing_value, parent_id')
          .in('parent_id', wizardData.selectedDomains)
          .eq('is_active', true)
          .order('order_index');
        
        setSubDomains(subs || []);
      }
      
      setPricingPackages(packages || []);
      setLoading(false);
    };
    
    fetchData();
  }, [wizardData.selectedDomains]);

  // Calculate total when selections change
  useEffect(() => {
    if (!allDomains) return;
    
    const breakdown = wizardData.selectedDomains.map((domainId: string) => {
      const domain = allDomains.find(d => d.id === domainId);
      if (!domain) return null;

      const selectedOptionId = selectedOptions[domainId];
      const customPrice = customPrices[domainId];
      
      // Check if user selected a custom price
      if (selectedOptionId === 'custom' && customPrice) {
        return {
          domainId,
          domainName: domain.name,
          domainIcon: domain.icon || '📌',
          price: customPrice,
          explanation: 'מחיר מותאם אישית',
          selectedOption: 'custom'
        };
      }
      
      // Check if user selected a pricing package
      const selectedPackage = pricingPackages.find(p => p.id === selectedOptionId);
      if (selectedPackage) {
        return {
          domainId,
          domainName: domain.name,
          domainIcon: domain.icon || '📌',
          price: selectedPackage.price,
          explanation: `${selectedPackage.name_he} (${selectedPackage.sessions_count} מפגשים)`,
          selectedOption: selectedPackage.id
        };
      }
      
      // Check if user selected a sub-domain
      const selectedSubDomain = subDomains.find(s => s.id === selectedOptionId);
      if (selectedSubDomain) {
        let price = 0;
        let explanation = '';
        
        if (selectedSubDomain.pricing_type === 'fixed') {
          price = selectedSubDomain.pricing_value || 0;
          explanation = `מחיר קבוע: ₪${price.toLocaleString()}`;
        } else if (selectedSubDomain.pricing_type === 'percentage') {
          explanation = `${selectedSubDomain.pricing_value}% מההכנסות`;
        }
        
        return {
          domainId,
          domainName: domain.name,
          domainIcon: domain.icon || '📌',
          price,
          explanation: `${selectedSubDomain.name} - ${explanation}`,
          selectedOption: selectedSubDomain.id
        };
      }

      // No selection yet
      return {
        domainId,
        domainName: domain.name,
        domainIcon: domain.icon || '📌',
        price: 0,
        explanation: 'יש לבחור אפשרות תמחור',
        selectedOption: null
      };
    }).filter(Boolean);

    const totalPrice = breakdown.reduce((sum: number, item: any) => sum + (item?.price || 0), 0);

    setWizardData({
      ...wizardData,
      pricing: {
        totalPrice,
        breakdown,
        selectedOptions
      }
    });
  }, [allDomains, selectedOptions, customPrices, pricingPackages, subDomains]);

  const handleOptionSelect = (domainId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [domainId]: optionId }));
  };

  const handleCustomPriceChange = (domainId: string, price: number) => {
    setCustomPrices(prev => ({ ...prev, [domainId]: price }));
  };

  if (domainsLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground">טוען אפשרויות תמחור...</p>
      </div>
    );
  }

  // Get selected main domains
  const selectedMainDomains = allDomains?.filter(d => 
    wizardData.selectedDomains.includes(d.id) && d.level === 1
  ) || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">💰 בחר חבילת מחיר</h3>
        <p className="text-sm text-muted-foreground mt-1">בחר את סוג התמחור לכל תחום</p>
      </div>
      
      {selectedMainDomains.map((domain) => {
        // Get pricing packages for this domain's sub-domains
        const domainSubDomains = subDomains.filter(s => s.parent_id === domain.id);
        
        // Find packages linked to psychology sub-domain (טיפולים פרטיים)
        const therapySubDomain = domainSubDomains.find(s => s.name === 'טיפולים פרטיים');
        const domainPackages = pricingPackages.filter(p => 
          therapySubDomain && p.domain_id === therapySubDomain.id
        );
        
        const hasPackages = domainPackages.length > 0;
        const hasSubDomains = domainSubDomains.length > 0;
        const selectedValue = selectedOptions[domain.id] || '';
        
        return (
          <Card key={domain.id} className="p-4 border-2">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <span className="text-3xl">{domain.icon || '📌'}</span>
              <div>
                <h4 className="font-bold text-lg">{domain.name}</h4>
                <p className="text-sm text-muted-foreground">בחר אפשרות תמחור</p>
              </div>
            </div>
            
            <RadioGroup 
              value={selectedValue}
              onValueChange={(value) => handleOptionSelect(domain.id, value)}
              className="space-y-3"
            >
              {/* Show pricing packages if available (for psychology) */}
              {hasPackages && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    חבילות מפגשים:
                  </p>
                  {domainPackages.map((pkg) => (
                    <div 
                      key={pkg.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedValue === pkg.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleOptionSelect(domain.id, pkg.id)}
                    >
                      <RadioGroupItem value={pkg.id} id={pkg.id} />
                      <Label htmlFor={pkg.id} className="flex-1 cursor-pointer">
                        <span className="font-medium">{pkg.name_he}</span>
                        <span className="text-muted-foreground text-sm mr-2">
                          ({pkg.sessions_count} מפגשים)
                        </span>
                      </Label>
                      <Badge variant="secondary" className="font-bold">
                        ₪{pkg.price.toLocaleString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Show sub-domains with percentage pricing (for basketball) */}
              {!hasPackages && hasSubDomains && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    בחר קבוצה/מיקום:
                  </p>
                  {domainSubDomains.map((sub) => (
                    <div 
                      key={sub.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedValue === sub.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleOptionSelect(domain.id, sub.id)}
                    >
                      <RadioGroupItem value={sub.id} id={sub.id} />
                      <Label htmlFor={sub.id} className="flex-1 cursor-pointer">
                        <span className="font-medium">{sub.icon} {sub.name}</span>
                      </Label>
                      {sub.pricing_type === 'percentage' && (
                        <Badge variant="outline">{sub.pricing_value}%</Badge>
                      )}
                      {sub.pricing_type === 'fixed' && (
                        <Badge variant="secondary">₪{sub.pricing_value?.toLocaleString()}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Custom price option */}
              <div 
                className={`p-3 rounded-lg border transition-all ${
                  selectedValue === 'custom' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => handleOptionSelect(domain.id, 'custom')}
                >
                  <RadioGroupItem value="custom" id={`custom-${domain.id}`} />
                  <Label htmlFor={`custom-${domain.id}`} className="cursor-pointer font-medium">
                    מחיר מותאם אישית
                  </Label>
                </div>
                
                {selectedValue === 'custom' && (
                  <div className="mt-3 mr-7">
                    <Input
                      type="number"
                      placeholder="הזן סכום..."
                      value={customPrices[domain.id] || ''}
                      onChange={(e) => handleCustomPriceChange(domain.id, Number(e.target.value))}
                      className="w-40"
                      dir="ltr"
                    />
                  </div>
                )}
              </div>
            </RadioGroup>
          </Card>
        );
      })}

      {/* Total summary */}
      {wizardData.pricing?.totalPrice > 0 && (
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-800">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>סה"כ משוער</span>
            <span className="text-green-700 dark:text-green-400 text-2xl">
              ₪{wizardData.pricing.totalPrice.toLocaleString()}
            </span>
          </div>
        </Card>
      )}

      {(!wizardData.pricing?.totalPrice || wizardData.pricing.totalPrice === 0) && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            💡 בחר אפשרות תמחור לכל תחום, או השאר ריק והמחיר ייקבע בעת יצירת העסקה
          </p>
        </Card>
      )}
    </div>
  );
}
