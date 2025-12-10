import { useState, useEffect, useRef } from 'react';
import { Search, User, DollarSign, FileText, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useContacts } from '@/hooks/useContacts';
import { useDeals } from '@/hooks/useDeals';
import { usePayments } from '@/hooks/usePayments';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'contact' | 'deal' | 'payment';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data: contacts } = useContacts();
  const { data: deals } = useDeals();
  const { data: payments } = usePayments();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const newResults: SearchResult[] = [];

    // Search contacts
    contacts?.forEach(contact => {
      const fullName = `${contact.first_name} ${contact.last_name || ''}`.toLowerCase();
      if (
        fullName.includes(searchTerm) ||
        contact.phone?.includes(searchTerm) ||
        contact.email?.toLowerCase().includes(searchTerm)
      ) {
        newResults.push({
          id: contact.id,
          type: 'contact',
          title: `${contact.first_name} ${contact.last_name || ''}`,
          subtitle: contact.phone || contact.email,
          icon: <User className="w-4 h-4 text-blue-500" />
        });
      }
    });

    // Search deals
    deals?.forEach(deal => {
      if (deal.title.toLowerCase().includes(searchTerm)) {
        newResults.push({
          id: deal.id,
          type: 'deal',
          title: deal.title,
          subtitle: `₪${deal.amount_total?.toLocaleString() || 0}`,
          icon: <FileText className="w-4 h-4 text-purple-500" />
        });
      }
    });

    // Search payments
    payments?.forEach(payment => {
      const amount = `₪${payment.amount}`;
      if (amount.includes(searchTerm) || payment.notes?.toLowerCase().includes(searchTerm)) {
        newResults.push({
          id: payment.id,
          type: 'payment',
          title: `תשלום: ${amount}`,
          subtitle: payment.payment_date || '',
          icon: <DollarSign className="w-4 h-4 text-green-500" />
        });
      }
    });

    setResults(newResults.slice(0, 10)); // Limit to 10 results
  }, [query, contacts, deals, payments]);

  const handleResultClick = (result: SearchResult) => {
    switch (result.type) {
      case 'contact':
        navigate(`/customer/${result.id}`);
        break;
      case 'deal':
        navigate('/deals');
        break;
      case 'payment':
        navigate('/payments');
        break;
    }
    setIsOpen(false);
    setQuery('');
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contact': return 'לקוח';
      case 'deal': return 'עסקה';
      case 'payment': return 'תשלום';
      default: return type;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query && setIsOpen(true)}
          placeholder="חיפוש לקוחות, עסקאות... (Ctrl+K)"
          className="pr-10 pl-10 bg-background/80 backdrop-blur-sm border-primary/20 focus:border-primary"
          dir="rtl"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {results.map((result, index) => (
              <button
                key={`${result.type}-${result.id}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-right"
              >
                <div className="p-2 rounded-full bg-muted">
                  {result.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  {result.subtitle && (
                    <p className="text-sm text-muted-foreground truncate">{result.subtitle}</p>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {getTypeLabel(result.type)}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-xl z-50 p-6 text-center">
          <Search className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">לא נמצאו תוצאות עבור "{query}"</p>
        </div>
      )}
    </div>
  );
}
