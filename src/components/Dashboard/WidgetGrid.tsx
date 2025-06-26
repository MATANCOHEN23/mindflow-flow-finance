
import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, TrendingUp, Calendar, Bell, BarChart3 } from 'lucide-react';

// Simple widget components
function RevenueWidget() {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-green-600 mb-2">₪45,230</div>
      <p className="text-sm text-gray-600">הכנסות השבוע</p>
    </div>
  );
}

function TasksWidget() {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
      <p className="text-sm text-gray-600">משימות ממתינות</p>
    </div>
  );
}

function CalendarWidget() {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
      <p className="text-sm text-gray-600">אירועים היום</p>
    </div>
  );
}

function NotificationsWidget() {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-red-600 mb-2">3</div>
      <p className="text-sm text-gray-600">התראות חדשות</p>
    </div>
  );
}

function AnalyticsWidget() {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
      <p className="text-sm text-gray-600">שביעות רצון לקוחות</p>
    </div>
  );
}

const availableWidgets = [
  { id: 'revenue', title: '💰 הכנסות', component: RevenueWidget },
  { id: 'tasks', title: '📋 משימות', component: TasksWidget },
  { id: 'calendar', title: '📅 לוח שנה', component: CalendarWidget },
  { id: 'notifications', title: '🔔 התראות', component: NotificationsWidget },
  { id: 'analytics', title: '📊 אנליטיקס', component: AnalyticsWidget }
];

interface Widget {
  id: string;
  title: string;
  component: React.ComponentType;
}

interface SortableWidgetProps {
  widget: Widget;
}

function SortableWidget({ widget }: SortableWidgetProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: widget.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Component = widget.component;

  return (
    <div ref={setNodeRef} style={style} className="premium-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{widget.title}</h3>
        <button {...attributes} {...listeners} className="cursor-move hover:text-orange-600">
          <GripVertical className="text-gray-400" />
        </button>
      </div>
      <Component />
    </div>
  );
}

export function WidgetGrid() {
  const [widgets, setWidgets] = useState<Widget[]>(availableWidgets.slice(0, 4));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={widgets} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {widgets.map((widget) => (
            <SortableWidget key={widget.id} widget={widget} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
