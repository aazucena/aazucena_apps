'use client';

import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Mail, Bell } from '@aazucena/icons';
import React from 'react';
import type { NotificationItemData } from '@aazucena/ui';
import {
  markNotificationRead,
  markAllNotificationsRead,
  dismissNotification,
  type StoredNotification,
} from '@aazucena/stores';
import type { RootState } from '@/store';

function iconForSource(sourceType: StoredNotification['sourceType']): React.ReactNode {
  switch (sourceType) {
    case 'form':
      return React.createElement(Mail, { size: 14, className: 'text-primary-500' });
    case 'socket':
      return React.createElement(Bell, { size: 14, className: 'text-amber-500' });
    default:
      return React.createElement(Bell, { size: 14, className: 'text-zinc-400' });
  }
}

export function useNotifications() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.notifications.items);

  const notifications: NotificationItemData[] = useMemo(
    () =>
      items.map((n) => ({
        id: n.id,
        title: n.title,
        description: n.description,
        time: n.time,
        read: n.read,
        icon: iconForSource(n.sourceType),
      })),
    [items],
  );

  return {
    notifications,
    unreadCount: items.filter((n) => !n.read).length,
    markRead: (id: string) => dispatch(markNotificationRead(id)),
    markAllRead: () => dispatch(markAllNotificationsRead()),
    dismiss: (id: string) => dispatch(dismissNotification(id)),
  };
}
