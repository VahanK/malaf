'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
  Badge,
  Spinner
} from '@heroui/react'
import { BellIcon, CheckIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Notification } from '@/types/database.types'

export default function NotificationBell() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [showAllModal, setShowAllModal] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?limit=10')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/notifications/unread-count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.count)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount()
      if (isOpen) {
        fetchNotifications()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [isOpen])

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
        setUnreadCount(prev => Math.max(0, prev - 1))
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
      }
    }

    // Navigate to link
    if (notification.link) {
      router.push(notification.link)
      setIsOpen(false)
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
      setUnreadCount(0)
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
      const deletedNotification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))

      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
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
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

  if (!isMounted) {
    return (
      <Button
        isIconOnly
        variant="light"
        className="relative"
      >
        <BellIcon className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <>
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
    >
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
        >
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <BellIcon className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full min-w-[18px]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </>
          )}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Notifications"
        className="w-96 max-h-96 overflow-y-auto bg-white"
        emptyContent="No notifications"
      >
        {unreadCount > 0 ? (
          <DropdownSection title="Notifications" showDivider>
            <DropdownItem
              key="mark-all-read"
              className="text-primary"
              startContent={<CheckIcon className="w-4 h-4" />}
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </DropdownItem>
          </DropdownSection>
        ) : null}

        <DropdownSection>
          {notifications.length === 0 ? (
            <DropdownItem key="empty" isReadOnly>
              <div className="text-center py-8 text-gray-500">
                <BellIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            </DropdownItem>
          ) : (
            notifications.map((notification) => (
              <DropdownItem
                key={notification.id}
                className={`py-3 ${!notification.is_read ? 'bg-primary/5' : ''}`}
                textValue={notification.title}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-400">
                          {formatTime(notification.created_at)}
                        </p>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-gray-400 hover:text-danger"
                          onClick={(e) => handleDeleteNotification(notification.id, e)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </DropdownItem>
            ))
          )}
        </DropdownSection>

        {notifications.length > 0 ? (
          <DropdownSection>
            <DropdownItem
              key="view-all"
              className="text-center text-primary"
              onClick={() => {
                setShowAllModal(true)
                setIsOpen(false)
              }}
            >
              View all notifications
            </DropdownItem>
          </DropdownSection>
        ) : null}
      </DropdownMenu>
    </Dropdown>

    {/* View All Notifications Modal */}
    {showAllModal && (
      <div className="fixed inset-0 bg-black/50 z-[70] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Notifications</h2>
              <p className="text-sm text-gray-600 mt-1">{notifications.length} total notifications</p>
            </div>
            <button
              onClick={() => setShowAllModal(false)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Actions Bar */}
          {unreadCount > 0 && (
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium inline-flex items-center gap-2"
              >
                <CheckIcon className="w-4 h-4" />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-6">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <BellIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                      !notification.is_read
                        ? 'bg-purple-50 border-purple-200 hover:bg-purple-100'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={`text-sm font-semibold ${
                            !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">
                            {formatTime(notification.created_at)}
                          </p>
                          <button
                            onClick={(e) => handleDeleteNotification(notification.id, e)}
                            className="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  )
}
