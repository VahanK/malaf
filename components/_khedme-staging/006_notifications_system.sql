-- Migration: Notifications System
-- Auto-generated notifications for new projects and new messages

-- Create notification types enum
CREATE TYPE notification_type AS ENUM (
  'new_project',
  'new_message'
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- System can create notifications (will be done via triggers)
CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.uid());

-- Function to create project notification
CREATE OR REPLACE FUNCTION create_project_notification()
RETURNS TRIGGER AS $$
DECLARE
  project_title TEXT;
  client_name TEXT;
BEGIN
  -- Get project title and client name
  SELECT title INTO project_title FROM projects WHERE id = NEW.id;
  SELECT full_name INTO client_name FROM profiles WHERE id = NEW.client_id;

  -- Only notify freelancer about new projects (when status is 'open' and just created)
  IF NEW.status = 'open' AND NEW.created_at = NEW.updated_at THEN
    INSERT INTO notifications (user_id, type, title, message, link, metadata)
    VALUES (
      NEW.freelancer_id,
      'new_project',
      'New Project Assigned',
      client_name || ' has created a new project: ' || project_title,
      '/dashboard/projects/' || NEW.id,
      jsonb_build_object(
        'project_id', NEW.id,
        'client_id', NEW.client_id,
        'project_title', project_title
      )
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new projects
DROP TRIGGER IF EXISTS trigger_new_project_notification ON projects;
CREATE TRIGGER trigger_new_project_notification
  AFTER INSERT ON projects
  FOR EACH ROW
  EXECUTE FUNCTION create_project_notification();

-- Function to create message notification
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS TRIGGER AS $$
DECLARE
  recipient_id UUID;
  sender_name TEXT;
  conversation_project_id UUID;
  project_title TEXT;
BEGIN
  -- Get conversation participants
  SELECT
    CASE
      WHEN participant_1_id = NEW.sender_id THEN participant_2_id
      ELSE participant_1_id
    END,
    project_id
  INTO recipient_id, conversation_project_id
  FROM conversations
  WHERE id = NEW.conversation_id;

  -- Get sender name
  SELECT full_name INTO sender_name FROM profiles WHERE id = NEW.sender_id;

  -- Get project title if this is a project conversation
  IF conversation_project_id IS NOT NULL THEN
    SELECT title INTO project_title FROM projects WHERE id = conversation_project_id;
  END IF;

  -- Create notification for the recipient
  INSERT INTO notifications (user_id, type, title, message, link, metadata)
  VALUES (
    recipient_id,
    'new_message',
    'New Message from ' || sender_name,
    CASE
      WHEN LENGTH(NEW.content) > 100 THEN SUBSTRING(NEW.content, 1, 100) || '...'
      WHEN NEW.content = '' OR NEW.content IS NULL THEN 'Sent an attachment'
      ELSE NEW.content
    END,
    CASE
      WHEN conversation_project_id IS NOT NULL THEN '/dashboard/projects/' || conversation_project_id
      ELSE '/dashboard/messages?conversation=' || NEW.conversation_id
    END,
    jsonb_build_object(
      'conversation_id', NEW.conversation_id,
      'sender_id', NEW.sender_id,
      'project_id', conversation_project_id,
      'project_title', project_title,
      'message_id', NEW.id
    )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new messages
DROP TRIGGER IF EXISTS trigger_new_message_notification ON messages;
CREATE TRIGGER trigger_new_message_notification
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION create_message_notification();

COMMENT ON TABLE notifications IS 'User notifications for new projects and messages';
COMMENT ON COLUMN notifications.type IS 'Type of notification: new_project or new_message';
COMMENT ON COLUMN notifications.metadata IS 'Additional data about the notification (project_id, sender_id, etc.)';
COMMENT ON COLUMN notifications.link IS 'Link to navigate when notification is clicked';
