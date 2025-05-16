"use client"

import { useState, useEffect } from "react"
import { Search, Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function InstructorMessagesPage() {
  const [messages, setMessages] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, this would fetch from your API
      // For now, we'll simulate a delay and use sample data
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessages(sampleConversations)
      setSelectedConversation(sampleConversations[0])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const updatedConversation = {
      ...selectedConversation,
      messages: [
        ...selectedConversation.messages,
        {
          id: `msg-${Date.now()}`,
          content: newMessage,
          sender: "me",
          timestamp: new Date().toISOString(),
          status: "sent",
        },
      ],
    }

    setMessages(
      messages.map((conversation) =>
        conversation.id === selectedConversation.id ? updatedConversation : conversation,
      ),
    )
    setSelectedConversation(updatedConversation)
    setNewMessage("")

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage = {
        id: `msg-${Date.now()}`,
        content: "Thank you for your message. I'll get back to you soon!",
        sender: updatedConversation.with.id,
        timestamp: new Date().toISOString(),
        status: "delivered",
      }

      const conversationWithReply = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, replyMessage],
      }

      setMessages(
        messages.map((conversation) =>
          conversation.id === selectedConversation.id ? conversationWithReply : conversation,
        ),
      )
      setSelectedConversation(conversationWithReply)
    }, 2000)
  }

  // Sample data for demonstration
  const sampleConversations = [
    {
      id: "conv-1",
      with: {
        id: "user-1",
        name: "Jennifer Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
      },
      lastMessage: "I have a question about the technical analysis course",
      unread: 2,
      timestamp: "10:23 AM",
      messages: [
        {
          id: "msg-1",
          content: "Hello, I'm interested in your Technical Analysis Masterclass",
          sender: "user-1",
          timestamp: "2023-06-10T10:15:00Z",
          status: "read",
        },
        {
          id: "msg-2",
          content: "Hi Jennifer! I'm glad to hear that. What specific aspects are you interested in?",
          sender: "me",
          timestamp: "2023-06-10T10:18:00Z",
          status: "delivered",
        },
        {
          id: "msg-3",
          content: "I'm particularly interested in the chart pattern recognition section",
          sender: "user-1",
          timestamp: "2023-06-10T10:20:00Z",
          status: "read",
        },
        {
          id: "msg-4",
          content: "I have a question about the technical analysis course",
          sender: "user-1",
          timestamp: "2023-06-10T10:23:00Z",
          status: "delivered",
        },
      ],
    },
    {
      id: "conv-2",
      with: {
        id: "user-2",
        name: "Robert Garcia",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "offline",
      },
      lastMessage: "Thank you for the detailed explanation",
      unread: 0,
      timestamp: "Yesterday",
      messages: [
        {
          id: "msg-1",
          content: "I'm having trouble understanding the risk management concepts in module 3",
          sender: "user-2",
          timestamp: "2023-06-09T14:30:00Z",
          status: "read",
        },
        {
          id: "msg-2",
          content: "Let me explain it in more detail. Risk management is about...",
          sender: "me",
          timestamp: "2023-06-09T14:35:00Z",
          status: "delivered",
        },
        {
          id: "msg-3",
          content: "Thank you for the detailed explanation",
          sender: "user-2",
          timestamp: "2023-06-09T14:40:00Z",
          status: "read",
        },
      ],
    },
    {
      id: "conv-3",
      with: {
        id: "user-3",
        name: "Emily Chen",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "online",
      },
      lastMessage: "When will the next webinar be scheduled?",
      unread: 1,
      timestamp: "Jun 8",
      messages: [
        {
          id: "msg-1",
          content: "I really enjoyed your last webinar on market psychology",
          sender: "user-3",
          timestamp: "2023-06-08T09:10:00Z",
          status: "read",
        },
        {
          id: "msg-2",
          content: "Thank you, Emily! I'm glad you found it valuable.",
          sender: "me",
          timestamp: "2023-06-08T09:15:00Z",
          status: "delivered",
        },
        {
          id: "msg-3",
          content: "When will the next webinar be scheduled?",
          sender: "user-3",
          timestamp: "2023-06-08T09:20:00Z",
          status: "delivered",
        },
      ],
    },
  ]

  // Filter conversations based on search term
  const filteredConversations = messages.filter((conversation) =>
    conversation.with.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="flex flex-col space-y-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with your students</p>
      </div>

      <div className="flex h-full border rounded-lg overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search conversations..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No conversations found</div>
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 ${
                    selectedConversation?.id === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={conversation.with.avatar || "/placeholder.svg"}
                          alt={conversation.with.name}
                        />
                        <AvatarFallback>{conversation.with.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {conversation.with.status === "online" && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conversation.with.name}</p>
                        <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                        {conversation.unread > 0 && (
                          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Conversation */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={selectedConversation.with.avatar || "/placeholder.svg"}
                      alt={selectedConversation.with.name}
                    />
                    <AvatarFallback>{selectedConversation.with.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.with.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.with.status === "online" ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
                      <DropdownMenuItem>Block User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {selectedConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                    >
                      {message.sender !== "me" && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={selectedConversation.with.avatar || "/placeholder.svg"}
                            alt={selectedConversation.with.name}
                          />
                          <AvatarFallback>{selectedConversation.with.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-muted-foreground"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Your Messages</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Select a conversation from the list to view messages or start a new conversation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
