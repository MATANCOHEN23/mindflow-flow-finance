
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type ClientCategory = 'birthday' | 'workshop' | 'trainee' | 'patient';

interface WizardData {
  category: ClientCategory | '';
  subCategory: {
    location?: string;
    class?: string;
    age?: number;
    workshopType?: string;
  };
  contactInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    parentPhone?: string;
    childName?: string;
  };
  notes: string;
}

const STEPS = ['בחר קטגוריה', 'פרטים נוספים', 'פרטי קשר', 'סיכום'];

interface SmartClientWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SmartClientWizard({ isOpen, onClose }: SmartClientWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<WizardData>({
    category: '',
    subCategory: {},
    contactInfo: {
      firstName: '',
      lastName: '',
      phone: '',
      email: ''
    },
    notes: ''
  });

  const categoryConfig = {
    birthday: {
      icon: '🎂',
      title: 'יום הולדת',
      color: 'bg-pink-100 text-pink-700',
      fields: []
    },
    workshop: {
      icon: '🏫',
      title: 'סדנה',
      color: 'bg-blue-100 text-blue-700',
      fields: [
        { name: 'workshopType', label: 'סוג סדנה', type: 'select', options: ['מנטלית', 'ספורט', 'משולבת'] }
      ]
    },
    trainee: {
      icon: '🏀',
      title: 'מתאמן',
      color: 'bg-green-100 text-green-700',
      fields: [
        { name: 'location', label: 'מיקום', type: 'select', options: ['נווה עוז', 'אמיר'] },
        { name: 'class', label: 'קבוצה', type: 'select', options: ['גני ילדים', 'א-ב', 'ג-ד', 'ה-ו', 'פעם בשבוע'] }
      ]
    },
    patient: {
      icon: '🧠',
      title: 'מטופל',
      color: 'bg-purple-100 text-purple-700',
      fields: [
        { name: 'age', label: 'גיל', type: 'number' }
      ]
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          first_name: wizardData.contactInfo.firstName,
          last_name: wizardData.contactInfo.lastName,
          phone: wizardData.contactInfo.phone,
          phone_parent: wizardData.contactInfo.parentPhone,
          email: wizardData.contactInfo.email,
          child_name: wizardData.contactInfo.childName,
          role_tags: [categoryConfig[wizardData.category as ClientCategory].title],
          notes: wizardData.notes
        }]);

      if (error) throw error;
      
      toast.success('✅ הלקוח נוסף בהצלחה!');
      
      // Navigate to appropriate view based on category
      switch(wizardData.category) {
        case 'birthday':
          window.location.href = '/birthday-events';
          break;
        case 'trainee':
          window.location.href = '/basketball';
          break;
        case 'patient':
          window.location.href = '/therapy';
          break;
        case 'workshop':
          window.location.href = '/school-workshops';
          break;
      }
      
      onClose();
    } catch (error: any) {
      toast.error('❌ שגיאה: ' + error.message);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 0: // Category Selection
        return (
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <motion.button
                key={key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setWizardData({ ...wizardData, category: key as ClientCategory });
                  handleNext();
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  wizardData.category === key 
                    ? 'border-orange-500 shadow-lg' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="text-4xl mb-2">{config.icon}</div>
                <div className="font-bold">{config.title}</div>
              </motion.button>
            ))}
          </div>
        );
        
      case 1: // Sub-category fields
        const category = categoryConfig[wizardData.category as ClientCategory];
        if (!category || !category.fields.length) {
          setTimeout(handleNext, 0); // Skip if no fields
          return null;
        }
        
        return (
          <div className="space-y-4">
            {category.fields.map((field: any) => (
              <div key={field.name}>
                <label className="block mb-2 font-bold">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    className="w-full p-3 border rounded-lg"
                    value={wizardData.subCategory[field.name as keyof typeof wizardData.subCategory] || ''}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      subCategory: { ...wizardData.subCategory, [field.name]: e.target.value }
                    })}
                  >
                    <option value="">בחר...</option>
                    {field.options?.map((opt: string) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    className="w-full p-3 border rounded-lg"
                    value={wizardData.subCategory[field.name as keyof typeof wizardData.subCategory] || ''}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      subCategory: { ...wizardData.subCategory, [field.name]: field.type === 'number' ? parseInt(e.target.value) : e.target.value }
                    })}
                  />
                )}
              </div>
            ))}
          </div>
        );
        
      case 2: // Contact Info
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 font-bold">שם פרטי *</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={wizardData.contactInfo.firstName}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, firstName: e.target.value }
                  })}
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-bold">שם משפחה</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg"
                  value={wizardData.contactInfo.lastName}
                  onChange={(e) => setWizardData({
                    ...wizardData,
                    contactInfo: { ...wizardData.contactInfo, lastName: e.target.value }
                  })}
                />
              </div>
            </div>
            
            {(wizardData.category === 'trainee' || wizardData.category === 'birthday') && (
              <>
                <div>
                  <label className="block mb-2 font-bold">שם הילד/ה</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    value={wizardData.contactInfo.childName}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      contactInfo: { ...wizardData.contactInfo, childName: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-bold">טלפון הורה</label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-lg"
                    value={wizardData.contactInfo.parentPhone}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      contactInfo: { ...wizardData.contactInfo, parentPhone: e.target.value }
                    })}
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block mb-2 font-bold">טלפון</label>
              <input
                type="tel"
                className="w-full p-3 border rounded-lg"
                value={wizardData.contactInfo.phone}
                onChange={(e) => setWizardData({
                  ...wizardData,
                  contactInfo: { ...wizardData.contactInfo, phone: e.target.value }
                })}
              />
            </div>
            
            <div>
              <label className="block mb-2 font-bold">אימייל</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg"
                value={wizardData.contactInfo.email}
                onChange={(e) => setWizardData({
                  ...wizardData,
                  contactInfo: { ...wizardData.contactInfo, email: e.target.value }
                })}
              />
            </div>
            
            <div>
              <label className="block mb-2 font-bold">הערות</label>
              <textarea
                className="w-full p-3 border rounded-lg"
                rows={3}
                value={wizardData.notes}
                onChange={(e) => setWizardData({ ...wizardData, notes: e.target.value })}
              />
            </div>
          </div>
        );
        
      case 3: // Summary
        const selectedCategory = categoryConfig[wizardData.category as ClientCategory];
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold mb-3">סיכום הפרטים:</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">קטגוריה:</span>
                  <span className="font-medium">
                    {selectedCategory.icon} {selectedCategory.title}
                  </span>
                </div>
                
                {Object.entries(wizardData.subCategory).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-600">{key}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">שם:</span>
                  <span className="font-medium">
                    {wizardData.contactInfo.firstName} {wizardData.contactInfo.lastName}
                  </span>
                </div>
                
                {wizardData.contactInfo.childName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">שם הילד/ה:</span>
                    <span className="font-medium">{wizardData.contactInfo.childName}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">טלפון:</span>
                  <span className="font-medium">{wizardData.contactInfo.phone}</span>
                </div>
                
                {wizardData.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <span className="text-gray-600">הערות:</span>
                    <p className="mt-1">{wizardData.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Check className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-green-700">מוכן לשמירה!</p>
            </div>
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <h2 className="text-2xl font-bold mb-2">🎯 אשף הוספת לקוח חכם</h2>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-4">
            {STEPS.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${index <= currentStep ? 'bg-white text-orange-600' : 'bg-orange-400 text-white'}`}>
                  {index < currentStep ? <Check size={16} /> : index + 1}
                </div>
                <span className="ml-2 text-sm">{step}</span>
                {index < STEPS.length - 1 && (
                  <div className={`w-full h-1 mx-2 ${
                    index < currentStep ? 'bg-white' : 'bg-orange-400'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            ביטול
          </button>
          
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 flex items-center gap-2"
              >
                <ChevronRight size={16} />
                חזור
              </button>
            )}
            
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={currentStep === 0 && !wizardData.category}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                המשך
                <ChevronLeft size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
                         flex items-center gap-2"
              >
                <Check size={16} />
                שמור לקוח
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
