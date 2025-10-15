import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useTasks } from '@/hooks/useTasks';
import { PremiumLoader } from '@/components/PremiumLoader';
import { EmptyState } from '@/components/EmptyState';
import { TaskForm } from '@/components/Forms/TaskForm';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent } from "@/components/ui/card";
import { useBulkSelection } from '@/hooks/useBulkSelection';
import { BulkActionsToolbar } from '@/components/common/BulkActionsToolbar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const queryClient = useQueryClient();
  
  const { selectedIds, toggleItem, clearSelection, isSelected, count } = useBulkSelection(tasks || []);
  
  const handleBulkDelete = async () => {
    setIsBulkDeleting(true);
    try {
      await supabase.from('tasks').delete().in('id', selectedIds);
      toast.success(`${selectedIds.length} משימות נמחקו`);
      clearSelection();
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    } catch (error) {
      toast.error('שגיאה במחיקה');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <PremiumLoader size="lg" />
        </div>
      </MainLayout>
    );
  }

  const pendingTasks = tasks?.filter((t: any) => t.status === 'pending') || [];
  const inProgressTasks = tasks?.filter((t: any) => t.status === 'in_progress') || [];
  const doneTasks = tasks?.filter((t: any) => t.status === 'done') || [];

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700'
  };

  const priorityLabels = {
    low: 'נמוכה',
    medium: 'בינונית',
    high: 'גבוהה',
    urgent: 'דחוף'
  };

  const renderTaskCard = (task: any) => (
    <Card key={task.id} className="premium-card hover-scale cursor-pointer mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-3 gap-2">
          <Checkbox checked={isSelected(task.id)} onCheckedChange={() => toggleItem(task.id)} onClick={(e) => e.stopPropagation()} />
          <h3 className="font-bold text-lg flex-1">{task.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
            {priorityLabels[task.priority as keyof typeof priorityLabels]}
          </span>
        </div>
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
        )}
        {task.due_date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-primary" />
            <span>תאריך יעד: {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: he })}</span>
          </div>
        )}
        {task.auto_generated && (
          <div className="flex items-center gap-2 text-xs text-orange-600 mt-2">
            <AlertCircle className="w-3 h-3" />
            <span>משימה אוטומטית</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black gradient-text mb-2">✅ משימות</h1>
          <p className="text-muted-foreground">
            ניהול כל המשימות והתזכורות
          </p>
        </div>
        <Button onClick={() => setIsTaskFormOpen(true)} className="btn-premium">
          ➕ משימה חדשה
        </Button>
      </div>

      <Tabs defaultValue="pending" dir="rtl">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">ממתינות ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="in_progress">בביצוע ({inProgressTasks.length})</TabsTrigger>
          <TabsTrigger value="done">הושלמו ({doneTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingTasks.length === 0 ? (
            <EmptyState
              icon="✅"
              title="אין משימות ממתינות"
              description="כל המשימות שלך הושלמו!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in_progress" className="mt-6">
          {inProgressTasks.length === 0 ? (
            <EmptyState
              icon="🚀"
              title="אין משימות בביצוע"
              description="התחל לעבוד על משימה חדשה"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inProgressTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="done" className="mt-6">
          {doneTasks.length === 0 ? (
            <EmptyState
              icon="🎉"
              title="אין משימות שהושלמו"
              description="התחל להשלים משימות כדי לראות אותן כאן"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doneTasks.map(renderTaskCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
      />
      <BulkActionsToolbar count={count} onDelete={handleBulkDelete} onClear={clearSelection} isDeleting={isBulkDeleting} />
      </div>
    </MainLayout>
  );
}
