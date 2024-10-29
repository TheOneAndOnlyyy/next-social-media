import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Notification } from '@/lib/db/models/notification';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const notifications = await Notification.find({ 
      userId: session.user.id,
      read: false 
    })
    .sort({ createdAt: -1 })
    .limit(20)
    .exec();

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, title, message, type, relatedId } = await req.json();

    await connectDB();

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      relatedId
    });

    // Emit socket event
    const io = (req as any).socket?.server?.io;
    if (io) {
      io.to(`user:${userId}`).emit('notification', {
        title,
        message,
      });
    }

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notificationId } = await req.json();

    await connectDB();

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId: session.user.id },
      { read: true },
      { new: true }
    );

    return NextResponse.json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}