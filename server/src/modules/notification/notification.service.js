import Notification from '../../models/Notification.model.js';

export const createNotification = async (userId, type, title, message, meta = {}) => {
  return await Notification.create({
    user: userId,
    type,
    title,
    message,
    meta,
  });
};

export const getNotifications = async (userId) => {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
};

export const markAsRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
};
