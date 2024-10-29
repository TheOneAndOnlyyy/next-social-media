import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { Conversation } from '@/lib/db/models/conversation';
import { getServerSession } from 'next-auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const conversations = await Conversation.find({
      participants: session.user.id
    })
    .populate('participants', 'name image')
    .populate('lastMessage.sender', 'name')
    .sort({ updatedAt: -1 })
    .exec();

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { participantId } = await req.json();

    await connectDB();

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [session.user.id, participantId] }
    });

    if (existingConversation) {
      return NextResponse.json(existingConversation);
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [session.user.id, participantId]
    });

    const populatedConversation = await conversation
      .populate('participants', 'name image');

    return NextResponse.json(populatedConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}