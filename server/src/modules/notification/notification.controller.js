import * as notificationService from './notification.service.js';
import Notification from '../../models/Notification.model.js';

export const getAll = async (req, res, next) => {
  try {
    let notifications = await notificationService.getNotifications(req.user.id);

    // Auto-seed three realistic, beautiful starter notifications if the user has none!
    if (notifications.length === 0) {
      await notificationService.createNotification(
        req.user.id,
        'budget_alert',
        'Weekly Budget Alert',
        'You have spent 42% of your monthly food budget. Excellent job maintaining control!',
        { budgetCategory: 'Food', percentage: 42 }
      );
      await notificationService.createNotification(
        req.user.id,
        'weekly_insight',
        'AI Financial Smart-Tip',
        'Your coffee expenditures are down 15% this week compared to last week. Keep up the high savings!',
        { trend: 'down', category: 'Coffee', savings: '15%' }
      );
      await notificationService.createNotification(
        req.user.id,
        'recurring_due',
        'Upcoming Subscription',
        'Your recurring Spotify subscription of $14.99 is due in 3 days.',
        { amount: 14.99, service: 'Spotify', dueInDays: 3 }
      );

      // Re-fetch seeded notifications
      notifications = await notificationService.getNotifications(req.user.id);
    }

    res.status(200).json({
      status: 'success',
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

export const read = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    if (!notification) {
      return res.status(404).json({
        status: 'fail',
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

export const readAll = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );

    const notifications = await notificationService.getNotifications(req.user.id);

    res.status(200).json({
      status: 'success',
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};
