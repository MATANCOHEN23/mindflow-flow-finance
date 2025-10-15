import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { domainsApi, contactDomainsApi } from "@/lib/api/domains";
import { Domain, ContactDomain } from "@/types/database";
import { toast } from "sonner";

export const useDomains = () => {
  return useQuery({
    queryKey: ['domains'],
    queryFn: domainsApi.getAll,
  });
};

export const useDomainsHierarchy = () => {
  return useQuery({
    queryKey: ['domains-hierarchy'],
    queryFn: domainsApi.getHierarchy,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

export const useDomainsByLevel = (level: number) => {
  return useQuery({
    queryKey: ['domains', 'level', level],
    queryFn: () => domainsApi.getByLevel(level),
  });
};

export const useDomainChildren = (parentId: string) => {
  return useQuery({
    queryKey: ['domains', 'children', parentId],
    queryFn: () => domainsApi.getChildren(parentId),
    enabled: !!parentId,
  });
};

export const useCreateDomain = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: domainsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast.success('התחום נוסף בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};

export const useUpdateDomain = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Domain> }) => 
      domainsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast.success('התחום עודכן בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};

export const useDeleteDomain = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: domainsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      toast.success('התחום נמחק בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};

// Contact Domains Hooks

export const useContactDomains = (contactId: string) => {
  return useQuery({
    queryKey: ['contact-domains', contactId],
    queryFn: () => contactDomainsApi.getByContact(contactId),
    enabled: !!contactId,
  });
};

export const useDomainContacts = (domainId: string) => {
  return useQuery({
    queryKey: ['domain-contacts', domainId],
    queryFn: () => contactDomainsApi.getByDomain(domainId),
    enabled: !!domainId,
  });
};

export const useAssignContactToDomain = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      contactId, 
      domainId, 
      data 
    }: { 
      contactId: string; 
      domainId: string; 
      data?: Partial<ContactDomain>;
    }) => contactDomainsApi.assign(contactId, domainId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-contacts'] });
      toast.success('הלקוח שויך לתחום בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};

export const useUnassignContactFromDomain = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ contactId, domainId }: { contactId: string; domainId: string }) => 
      contactDomainsApi.unassign(contactId, domainId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-domains'] });
      queryClient.invalidateQueries({ queryKey: ['domain-contacts'] });
      toast.success('השיוך הוסר בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};

export const useUpdateContactDomainStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      contactId, 
      domainId, 
      status 
    }: { 
      contactId: string; 
      domainId: string; 
      status: 'active' | 'paused' | 'completed';
    }) => contactDomainsApi.updateStatus(contactId, domainId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-domains'] });
      toast.success('הסטטוס עודכן בהצלחה!');
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });
};
