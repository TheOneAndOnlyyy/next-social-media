import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Message } from '@/lib/db/models/message';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');

    await connectDB();

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'name image')
      .exec();

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversationId, content } = await req.json();

    await connectDB();

    const message = await Message.create({
      conversationId,
      sender: session.user.id,
      content,
    });

    const populatedMessage = await message.populate('sender', 'name image');

    return NextResponse.json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}