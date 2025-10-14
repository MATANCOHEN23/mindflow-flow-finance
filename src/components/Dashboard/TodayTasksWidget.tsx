import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTodayTasks } from "@/hooks/useTasks";
import { CheckSquare, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export function TodayTasksWidget() {
  const { data: tasks, isLoading } = useTodayTasks();

  if (isLoading) {
    return (
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            ✅ משימות דחופות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">טוען...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          ✅ משימות דחופות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks && tasks.length > 0 ? (
          tasks.slice(0, 5).map((task) => (
            <div key={task.id} className="flex justify-between items-start pb-3 border-b last:border-0">
              <div className="flex-1">
                <p className="font-semibold">{task.title}</p>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {task.due_date && format(new Date(task.due_date), 'dd/MM/yyyy', { locale: he })}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <Badge 
                  variant={
                    task.priority === 'high' ? 'destructive' : 
                    task.priority === 'medium' ? 'default' : 
                    'secondary'
                  }
                >
                  {task.priority === 'high' ? '🔴 דחוף' : 
                   task.priority === 'medium' ? '🟡 בינוני' : 
                   '🟢 נמוך'}
                </Badge>
                {task.status === 'pending' && <AlertCircle className="w-4 h-4 text-orange-500" />}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-4">אין משימות דחופות להיום 🎉</p>
        )}
      </CardContent>
    </Card>
  );
}
