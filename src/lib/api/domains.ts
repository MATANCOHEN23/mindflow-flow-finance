import { supabase } from "@/integrations/supabase/client";
import { Domain, ContactDomain, DomainWithChildren } from "@/types/database";

export const domainsApi = {
  async getAll(): Promise<Domain[]> {
    const { data, error } = await supabase
      .from('domains' as any)
      .select('*')
      .eq('is_active', true)
      .order('level', { ascending: true })
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching domains:', error);
      throw new Error(`שגיאה בטעינת התחומים: ${error.message}`);
    }

    return (data as unknown || []) as Domain[];
  },

  async getHierarchy(): Promise<DomainWithChildren[]> {
    const domains = await this.getAll();
    
    // בנה עץ היררכי
    const domainMap = new Map<string, DomainWithChildren>();
    const rootDomains: DomainWithChildren[] = [];

    // אתחל את כל התחומים במפה
    domains.forEach(domain => {
      domainMap.set(domain.id, { ...domain, children: [] });
    });

    // בנה את העץ
    domains.forEach(domain => {
      const domainWithChildren = domainMap.get(domain.id)!;
      
      if (domain.parent_id) {
        const parent = domainMap.get(domain.parent_id);
        if (parent) {
          parent.children!.push(domainWithChildren);
        }
      } else {
        rootDomains.push(domainWithChildren);
      }
    });

    return rootDomains;
  },

  async getById(id: string): Promise<Domain> {
    const { data, error } = await supabase
      .from('domains' as any)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching domain by ID:', error);
      throw new Error(`שגיאה בטעינת תחום: ${error.message}`);
    }

    return data as unknown as Domain;
  },

  async getByLevel(level: number): Promise<Domain[]> {
    const { data, error } = await supabase
      .from('domains' as any)
      .select('*')
      .eq('level', level)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching domains by level:', error);
      throw new Error(`שגיאה בטעינת תחומים ברמה ${level}: ${error.message}`);
    }

    return (data as unknown || []) as Domain[];
  },

  async getChildren(parentId: string): Promise<Domain[]> {
    const { data, error } = await supabase
      .from('domains' as any)
      .select('*')
      .eq('parent_id', parentId)
      .eq('is_active', true)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching child domains:', error);
      throw new Error(`שגיאה בטעינת תתי תחומים: ${error.message}`);
    }

    return (data as unknown || []) as Domain[];
  },

  async create(domainData: Omit<Domain, 'id' | 'created_at' | 'updated_at'>): Promise<Domain> {
    const { data, error } = await supabase
      .from('domains' as any)
      .insert([domainData])
      .select()
      .single();

    if (error) {
      console.error('Error creating domain:', error);
      throw new Error(`שגיאה ביצירת תחום: ${error.message}`);
    }

    return data as unknown as Domain;
  },

  async update(id: string, domainData: Partial<Domain>): Promise<Domain> {
    const { data, error } = await supabase
      .from('domains' as any)
      .update({ ...domainData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating domain:', error);
      throw new Error(`שגיאה בעדכון תחום: ${error.message}`);
    }

    return data as unknown as Domain;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('domains' as any)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting domain:', error);
      throw new Error(`שגיאה במחיקת תחום: ${error.message}`);
    }
  }
};

export const contactDomainsApi = {
  async getByContact(contactId: string): Promise<ContactDomain[]> {
    const { data, error } = await supabase
      .from('contact_domains' as any)
      .select(`
        *,
        domain:domains (
          id,
          name,
          icon,
          level,
          parent_id,
          pricing_type,
          pricing_value
        )
      `)
      .eq('contact_id', contactId);

    if (error) {
      console.error('Error fetching contact domains:', error);
      throw new Error(`שגיאה בטעינת תחומי הלקוח: ${error.message}`);
    }

    return (data as unknown || []) as ContactDomain[];
  },

  async getByDomain(domainId: string): Promise<ContactDomain[]> {
    const { data, error } = await supabase
      .from('contact_domains' as any)
      .select('*')
      .eq('domain_id', domainId);

    if (error) {
      console.error('Error fetching domain contacts:', error);
      throw new Error(`שגיאה בטעינת לקוחות התחום: ${error.message}`);
    }

    return (data as unknown || []) as ContactDomain[];
  },

  async assign(contactId: string, domainId: string, data?: Partial<ContactDomain>): Promise<ContactDomain> {
    const assignData = {
      contact_id: contactId,
      domain_id: domainId,
      status: data?.status || 'active',
      joined_date: data?.joined_date || new Date().toISOString().split('T')[0],
      notes: data?.notes,
      custom_pricing: data?.custom_pricing || {}
    };

    const { data: result, error } = await supabase
      .from('contact_domains' as any)
      .insert([assignData])
      .select()
      .single();

    if (error) {
      console.error('Error assigning contact to domain:', error);
      throw new Error(`שגיאה בשיוך לקוח לתחום: ${error.message}`);
    }

    return result as unknown as ContactDomain;
  },

  async unassign(contactId: string, domainId: string): Promise<void> {
    const { error } = await supabase
      .from('contact_domains' as any)
      .delete()
      .eq('contact_id', contactId)
      .eq('domain_id', domainId);

    if (error) {
      console.error('Error unassigning contact from domain:', error);
      throw new Error(`שגיאה בהסרת שיוך לקוח מתחום: ${error.message}`);
    }
  },

  async updateStatus(contactId: string, domainId: string, status: 'active' | 'paused' | 'completed'): Promise<void> {
    const { error } = await supabase
      .from('contact_domains' as any)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('contact_id', contactId)
      .eq('domain_id', domainId);

    if (error) {
      console.error('Error updating contact domain status:', error);
      throw new Error(`שגיאה בעדכון סטטוס: ${error.message}`);
    }
  },

  async getFullPath(domainId: string): Promise<string> {
    try {
      // Build path by following parent_id chain
      const domains = await domainsApi.getAll();
      const domainMap = new Map(domains.map(d => [d.id, d]));
      const domain = domainMap.get(domainId);
      
      if (!domain) return 'נתיב לא זמין';
      
      const path: string[] = [];
      let current = domain;
      
      while (current) {
        path.unshift(`${current.icon || ''} ${current.name}`.trim());
        current = current.parent_id ? domainMap.get(current.parent_id) : undefined;
      }
      
      return path.join(' > ');
    } catch (err) {
      console.error('Error in getFullPath:', err);
      return 'נתיב לא זמין';
    }
  }
};
