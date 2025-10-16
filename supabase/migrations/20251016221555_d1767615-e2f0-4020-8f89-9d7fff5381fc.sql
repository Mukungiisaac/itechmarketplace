-- Create chat_messages table for community chat
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view messages
CREATE POLICY "Anyone can view chat messages"
ON public.chat_messages
FOR SELECT
USING (true);

-- Allow anyone to send messages
CREATE POLICY "Anyone can send chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (true);

-- Enable realtime for the chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;