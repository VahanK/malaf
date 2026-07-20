'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Notification } from '@/types/database.types'
import { Card, CardBody, Button, Tabs, Tab, Chip } from '@heroui/react'
import { BellIcon, CheckIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface NotificationsPageClientProps {
  notifications: Notification[]
  userRole: 'freelancer' | 'client'
}

export default function NotificationsPageClient({
  notifications: initialNotifications,
  userRole
}: NotificationsPageClientProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [activeTab, setActiveTab] = useState('all')

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await fetch('/api/notifications/mark-read', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId: notification.id })
        })

        // Update local state
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        )
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }

    // Navigate to link
    if (notification.link) {
      router.push(notification.link)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      })

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })

      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`

    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_project':
        return '📋'
      case 'new_message':
        return '💬'
      default:
        return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'new_project':
        return 'primary'
      case 'new_message':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.is_read
    if (activeTab === 'projects') return n.type === 'new_project'
    if (activeTab === 'messages') return n.type === 'new_message'
    return true
  })

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="light"
            startContent={<ArrowLeftIcon className="w-4 h-4" />}
            onPress={() => router.back()}
            className="mb-4"
          >
            Back
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BellIcon className="w-8 h-8 text-primary" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                color="primary"
                variant="flat"
                startContent={<CheckIcon className="w-4 h-4" />}
                onPress={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          aria-label="Notification filters"
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as string)}
          className="mb-6"
        >
          <Tab key="all" title="All" />
          <Tab key="unread" title={`Unread ${unreadCount > 0 ? `(${unreadCount})` : ''}`} />
          <Tab key="projects" title="Projects" />
          <Tab key="messages" title="Messages" />
        </Tabs>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardBody className="p-12">
                <div className="text-center">
                  <BellIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-600">
                    {activeTab === 'unread'
                      ? "You're all caught up! No unread notifications."
                      : "You don't have any notifications yet."}
                  </p>
                </div>
              </CardBody>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                isPressable
                onPress={() => handleNotificationClick(notification)}
                className={`transition-all ${
                  !notification.is_read ? 'border-l-4 border-l-primary bg-primary/5' : ''
                }`}
              >
                <CardBody className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-sm font-semibold ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={getNotificationColor(notification.type) as any}
                            className="mb-2"
                          >
                            {notification.type === 'new_project' ? 'Project' : 'Message'}
                          </Chip>
                        </div>

                        {/* Delete Button */}
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-gray-400 hover:text-danger"
                          onPress={(e) => handleDeleteNotification(notification.id, e as any)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>

                      <p className="text-xs text-gray-400">
                        {formatTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
