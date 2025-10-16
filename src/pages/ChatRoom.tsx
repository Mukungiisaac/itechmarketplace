import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  created_at: string;
  user_id: string;
}

const ChatRoom = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication and fetch user profile
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to use the chat",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      setUserId(session.user.id);

      // Fetch user profile
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load user profile",
          variant: "destructive",
        });
        return;
      }

      if (profile?.full_name) {
        setUsername(profile.full_name);
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate, toast]);

  // Fetch initial messages
  useEffect(() => {
    if (!userId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(100);

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      if (data) {
        setMessages(data);
      }
    };

    fetchMessages();
  }, [userId]);

  // Subscribe to realtime updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("chat_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !userId) return;

    const { error } = await supabase.from("chat_messages").insert({
      user_id: userId,
      username,
      message: newMessage.trim(),
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnimatedBackground />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading chat...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Header />
      
      <main className="flex-1 container px-4 py-8 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 md:p-8 bg-card/95 backdrop-blur shadow-elegant animate-fade-in">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <MessageCircle className="h-8 w-8 text-primary animate-pulse-scale" />
                <h1 className="text-3xl md:text-4xl font-bold gradient-text-animate">
                  iTech Live Chat
                </h1>
              </div>
              <p className="text-muted-foreground">
                Welcome to iTech Live Chat — connect, share, and have fun!
              </p>
            </div>

            <div className="space-y-4">
              <ScrollArea className="h-[400px] md:h-[500px] rounded-lg border bg-background/50 p-4">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No messages yet. Be the first to say hello! 👋
                    </p>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col gap-1 ${
                          msg.user_id === userId ? "items-end" : "items-start"
                        }`}
                      >
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-semibold">{msg.username}</span>
                          <span>•</span>
                          <span>{formatTime(msg.created_at)}</span>
                        </div>
                        <div
                          className={`rounded-lg px-4 py-2 max-w-[80%] break-words ${
                            msg.user_id === userId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  maxLength={500}
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>

              <p className="text-xs text-center text-muted-foreground">
                Chatting as <span className="font-semibold">{username}</span>
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatRoom;
