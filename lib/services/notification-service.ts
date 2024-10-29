import { socket } from '@/lib/socket';

interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  relatedId?: string;
}

export async function createNotification(payload: NotificationPayload) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to create notification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
}

export const notificationService = {
  async sendLikeNotification(postId: string, likedByUser: { id: string; name: string }) {
    await createNotification({
      userId: postId,
      title: 'New Like',
      message: `${likedByUser.name} liked your post`,
      type: 'like',
      relatedId: postId,
    });
  },

  async sendCommentNotification(postId: string, commentedByUser: { id: string; name: string }) {
    await createNotification({
      userId: postId,
      title: 'New Comment',
      message: `${commentedByUser.name} commented on your post`,
      type: 'comment',
      relatedId: postId,
    });
  },

  async sendFollowNotification(followedUserId: string, follower: { id: string; name: string }) {
    await createNotification({
      userId: followedUserId,
      title: 'New Follower',
      message: `${follower.name} started following you`,
      type: 'follow',
      relatedId: follower.id,
    });
  },

  async sendMessageNotification(recipientId: string, sender: { id: string; name: string }) {
    await createNotification({
      userId: recipientId,
      title: 'New Message',
      message: `${sender.name} sent you a message`,
      type: 'message',
      relatedId: sender.id,
    });
  },
};