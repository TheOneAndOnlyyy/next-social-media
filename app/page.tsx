'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Heart, MessageCircle, Share2, BookmarkPlus } from 'lucide-react';
import Link from 'next/link';
import { UserButton } from '@/components/auth/user-button';
import { NotificationButton } from '@/components/notifications/notification-button';
import { notificationService } from '@/lib/services/notification-service';
import { useSession } from 'next-auth/react';

const posts = [
  {
    id: 1,
    author: 'Sarah Wilson',
    authorId: '1',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    content:
      'Just launched my new portfolio website! Check it out and let me know what you think 🚀',
    image:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop',
    likes: 142,
    comments: 28,
    timeAgo: '2h',
  },
  {
    id: 2,
    author: 'Alex Chen',
    authorId: '2',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    content:
      'Beautiful sunset at the beach today. Nature never fails to amaze! 🌅',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop',
    likes: 89,
    comments: 12,
    timeAgo: '4h',
  },
];

export default function Home() {
  const { data: session } = useSession();

  const handleLike = async (postId: number, authorId: string) => {
    if (!session?.user) return;

    try {
      // Handle like logic here (e.g., API call to like the post)
      await notificationService.sendLikeNotification(authorId, {
        id: session.user.id as string,
        name: session.user.name as string,
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId: number, authorId: string) => {
    if (!session?.user) return;

    try {
      // Handle comment logic here (e.g., open comment modal)
      await notificationService.sendCommentNotification(authorId, {
        id: session.user.id as string,
        name: session.user.name as string,
      });
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">SocialHub</h1>
          <div className="flex items-center gap-4">
            <Input className="w-64" placeholder="Search..." type="search" />
            <NotificationButton />
            <UserButton />
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Sidebar */}
          <div className="space-y-4">
            <Card className="p-4">
              <h2 className="font-semibold mb-3">Quick Links</h2>
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block hover:bg-gray-50 p-2 rounded-lg transition"
                >
                  Home
                </Link>
                <Link
                  href="/profile"
                  className="block hover:bg-gray-50 p-2 rounded-lg transition"
                >
                  Profile
                </Link>
                <Link
                  href="/messages"
                  className="block hover:bg-gray-50 p-2 rounded-lg transition"
                >
                  Messages
                </Link>
                <Link
                  href="/notifications"
                  className="block hover:bg-gray-50 p-2 rounded-lg transition"
                >
                  Notifications
                </Link>
              </nav>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="col-span-2 space-y-6">
            <Card className="p-4">
              <Input className="mb-4" placeholder="What's on your mind?" />
              <div className="flex justify-end">
                <Button>Post</Button>
              </div>
            </Card>

            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{post.author}</h3>
                      <p className="text-sm text-gray-500">{post.timeAgo}</p>
                    </div>
                  </div>
                  <p className="mb-4">{post.content}</p>
                  <img
                    src={post.image}
                    alt=""
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-between text-gray-500">
                    <button
                      className="flex items-center gap-1 hover:text-primary transition"
                      onClick={() => handleLike(post.id, post.authorId)}
                    >
                      <Heart className="w-5 h-5" />
                      {post.likes}
                    </button>
                    <button
                      className="flex items-center gap-1 hover:text-primary transition"
                      onClick={() => handleComment(post.id, post.authorId)}
                    >
                      <MessageCircle className="w-5 h-5" />
                      {post.comments}
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition">
                      <Share2 className="w-5 h-5" />
                      Share
                    </button>
                    <button className="flex items-center gap-1 hover:text-primary transition">
                      <BookmarkPlus className="w-5 h-5" />
                      Save
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
