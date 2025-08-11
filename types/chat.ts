export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  id: string;
  status?: "sending" | "sent" | "error" | "delivered";
  error?: string;
  isBookmarked?: boolean;
  category?: string;
};

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};