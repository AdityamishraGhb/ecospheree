import { NextResponse } from 'next/server';

// Mock notifications data
const notifications = [
  {
    id: 'notif1',
    userId: 'user1',
    type: 'challenge',
    title: 'New Challenge Available',
    message: 'A new "Water Conservation Week" challenge is now available. Join today!',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    link: '/challenges'
  },
  {
    id: 'notif2',
    userId: 'user1',
    type: 'reward',
    title: 'Reward Claimed',
    message: 'You have successfully claimed the "15% Off Sustainable Fashion" reward.',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    link: '/rewards'
  },
  {
    id: 'notif3',
    userId: 'user1',
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'Congratulations! You\'ve earned the "5-Day Streak" achievement.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
    link: '/profile'
  },
  {
    id: 'notif4',
    userId: 'user1',
    type: 'event',
    title: 'Event Reminder',
    message: 'Don\'t forget about the "Sustainable Living Workshop" tomorrow at 6:30 PM.',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: false,
    link: '/events'
  },
  {
    id: 'notif5',
    userId: 'user1',
    type: 'system',
    title: 'Profile Incomplete',
    message: 'Complete your profile to get personalized eco recommendations.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    read: true,
    link: '/profile'
  },
  {
    id: 'notif6',
    userId: 'user2',
    type: 'challenge',
    title: 'Challenge Completed',
    message: 'Great job! You\'ve completed the "Bike to Work Week" challenge.',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    read: false,
    link: '/challenges'
  }
];

/**
 * GET handler for retrieving user notifications
 * 
 * Query parameters:
 * - userId: User ID to fetch notifications for
 * - limit: Maximum number of notifications to return (default: 10)
 * - read: Filter by read status (optional, 'true' or 'false')
 */
export async function GET(request) {
  try {
    // Get URL parameters 
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limitParam = searchParams.get('limit');
    const readParam = searchParams.get('read');
    
    // Return 400 if userId is not provided
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    // Filter notifications by userId
    let userNotifications = notifications.filter(
      notification => notification.userId === userId
    );
    
    // Filter by read status if provided
    if (readParam !== null) {
      const isRead = readParam === 'true';
      userNotifications = userNotifications.filter(
        notification => notification.read === isRead
      );
    }
    
    // Sort notifications by date (newest first)
    userNotifications.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    
    // Apply limit if provided
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    userNotifications = userNotifications.slice(0, limit);
    
    // Return notifications with count of unread notifications
    const unreadCount = notifications.filter(
      n => n.userId === userId && !n.read
    ).length;
    
    return NextResponse.json({
      notifications: userNotifications,
      unreadCount,
      total: notifications.filter(n => n.userId === userId).length
    });
  } catch (error) {
    console.error('Error handling notifications request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for marking notifications as read
 * 
 * Expected request body:
 * {
 *   userId: string,
 *   notificationIds: string[] | 'all'
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, notificationIds } = body;
    
    // Return 400 if required fields are missing
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    if (!notificationIds) {
      return NextResponse.json(
        { error: 'notificationIds is required' },
        { status: 400 }
      );
    }
    
    // Mark notifications as read
    let updatedCount = 0;
    
    if (notificationIds === 'all') {
      // Mark all notifications for user as read
      notifications.forEach(notification => {
        if (notification.userId === userId && !notification.read) {
          notification.read = true;
          updatedCount++;
        }
      });
    } else if (Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      notifications.forEach(notification => {
        if (
          notification.userId === userId &&
          notificationIds.includes(notification.id) &&
          !notification.read
        ) {
          notification.read = true;
          updatedCount++;
        }
      });
    } else {
      return NextResponse.json(
        { error: 'notificationIds must be an array or "all"' },
        { status: 400 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      updatedCount,
      unreadCount: notifications.filter(
        n => n.userId === userId && !n.read
      ).length
    });
  } catch (error) {
    console.error('Error handling mark-as-read request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 