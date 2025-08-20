import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Message from './Message'
import LoadingIndicator from './LoadingIndicator'

const MessageList = ({ messages, isLoading }) => {
  return (
    <div className="p-4 space-y-4">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Message message={message} />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LoadingIndicator />
        </motion.div>
      )}
    </div>
  )
}

export default MessageList