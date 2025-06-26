
import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdvancedSearchProps {
  onSearch: (term: string) => void;
  onFilter: (filters: any) => void;
}

export function AdvancedSearch({ onSearch, onFilter }: AdvancedSearchProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dateRange: '',
    minAmount: '',
    maxAmount: ''
  });

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="חיפוש חכם... (שם, טלפון, אימייל, תגיות)"
            className="w-full pr-12 pl-4 py-3 rounded-xl border-2 border-gray-200 
                     focus:border-orange-500 focus:outline-none transition-all"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
          />
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`btn-premium flex items-center gap-2 ${isFilterOpen ? 'bg-orange-600' : ''}`}
        >
          <Filter size={20} />
          סינון מתקדם
        </button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-orange-500"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">כל הקטגוריות</option>
                <option value="birthday">🎂 יום הולדת</option>
                <option value="therapy">🧠 טיפול</option>
                <option value="basketball">🏀 אימון כדורסל</option>
                <option value="workshop">🎓 סדנה</option>
              </select>

              <select
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-orange-500"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <option value="">כל הסטטוסים</option>
                <option value="active">פעיל</option>
                <option value="pending">ממתין</option>
                <option value="completed">הושלם</option>
              </select>

              <select
                className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-orange-500"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <option value="">כל התקופה</option>
                <option value="today">היום</option>
                <option value="week">השבוע</option>
                <option value="month">החודש</option>
                <option value="quarter">רבעון</option>
              </select>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => onFilter(filters)}
                className="btn-premium"
              >
                החל סינון
              </button>
              <button
                onClick={() => {
                  setFilters({
                    category: '',
                    status: '',
                    dateRange: '',
                    minAmount: '',
                    maxAmount: ''
                  });
                  onFilter({});
                }}
                className="btn-secondary"
              >
                נקה סינון
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
