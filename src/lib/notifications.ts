export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('הדפדפן לא תומך בהתראות');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options
    });
  }
}

// הוספת תזכורות אוטומטיות:
export function scheduleReminder(eventDate: Date, title: string) {
  const now = new Date();
  const diff = eventDate.getTime() - now.getTime();
  
  if (diff > 0 && diff < 24 * 60 * 60 * 1000) { // אם תוך 24 שעות
    setTimeout(() => {
      sendLocalNotification('תזכורת אירוע', {
        body: title,
        tag: 'event-reminder'
      });
    }, diff - 60 * 60 * 1000); // שעה לפני
  }
}
