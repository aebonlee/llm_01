import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const SuggestionChips = ({ suggestions, onSelect, small = false }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {!small && (
        <div className="w-full flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-sm text-gray-600 font-medium">추천 질문</span>
        </div>
      )}
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(suggestion)}
          className={`${
            small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          } bg-white border border-gray-200 rounded-full hover:bg-primary-50 hover:border-primary-300 transition-colors`}
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  )
}

export default SuggestionChips