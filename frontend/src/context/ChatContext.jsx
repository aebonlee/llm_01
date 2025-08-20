import React, { createContext, useContext, useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

const ChatContext = createContext()

export const useChat = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(() => uuidv4())
  const [isLoading, setIsLoading] = useState(false)

  const addMessage = useCallback((message) => {
    setMessages(prev => [...prev, { ...message, id: uuidv4(), timestamp: new Date() }])
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setSessionId(uuidv4())
  }, [])

  const value = {
    messages,
    sessionId,
    isLoading,
    setIsLoading,
    addMessage,
    clearMessages
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}