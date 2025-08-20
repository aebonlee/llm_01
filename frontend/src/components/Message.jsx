import React from 'react'
import ReactMarkdown from 'react-markdown'
import { User, Bot } from 'lucide-react'
import { motion } from 'framer-motion'

const Message = ({ message }) => {
  const isUser = message.role === 'user'
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <motion.div 
        className={`flex space-x-3 max-w-3xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
        whileHover={{ scale: 1.01 }}
      >
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary-500' : 'bg-gray-200'
        }`}>
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-gray-600" />
          )}
        </div>
        
        <div className={`flex-1 px-4 py-3 rounded-lg ${
          isUser 
            ? 'bg-primary-500 text-white' 
            : 'bg-white border border-gray-200'
        }`}>
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-gray-800 mb-2">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  h3: ({ children }) => <h3 className="font-semibold text-gray-900 mt-3 mb-1">{children}</h3>,
                  code: ({ inline, children }) => 
                    inline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>
                    ) : (
                      <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
                        <code>{children}</code>
                      </pre>
                    )
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Message