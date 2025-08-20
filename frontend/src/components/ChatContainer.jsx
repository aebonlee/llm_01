import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import SuggestionChips from './SuggestionChips'
import { useChat } from '../context/ChatContext'
import { chatService } from '../services/chatService'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const { messages, addMessage, isLoading, setIsLoading, sessionId } = useChat()
  const [suggestions, setSuggestions] = useState([
    "AI 시장의 최신 트렌드는?",
    "2024년 반도체 산업 전망",
    "친환경 기술 시장 동향"
  ])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return

    addMessage({ role: 'user', content: message })
    setIsLoading(true)

    try {
      const response = await chatService.sendMessage(message, sessionId)
      
      addMessage({ role: 'assistant', content: response.response })
      
      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions)
      }
      
      if (!response.on_topic) {
        toast.error('시장/트렌드 관련 질문을 해주세요', {
          duration: 3000,
          style: {
            background: '#FEF2F2',
            color: '#991B1B',
          }
        })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('메시지 전송 중 오류가 발생했습니다')
      addMessage({ 
        role: 'assistant', 
        content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full p-8"
            >
              <div className="max-w-2xl text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  시장 트렌드 분석 AI에 오신 것을 환영합니다
                </h2>
                <p className="text-gray-600 mb-8">
                  최신 시장 동향, 산업 트렌드, 비즈니스 인사이트에 대해 질문해보세요
                </p>
                <SuggestionChips 
                  suggestions={suggestions} 
                  onSelect={handleSendMessage}
                />
              </div>
            </motion.div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <MessageList messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto p-4">
          {messages.length > 0 && suggestions.length > 0 && (
            <div className="mb-3">
              <SuggestionChips 
                suggestions={suggestions} 
                onSelect={handleSendMessage}
                small
              />
            </div>
          )}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}

export default ChatContainer