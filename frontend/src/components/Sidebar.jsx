import React from 'react'
import { X, Plus, MessageSquare, TrendingUp, BarChart, PieChart, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../context/ChatContext'

const Sidebar = ({ isOpen, onClose }) => {
  const { clearMessages } = useChat()

  const menuItems = [
    { icon: TrendingUp, label: 'AI 시장 트렌드', query: 'AI 시장의 최신 트렌드는?' },
    { icon: BarChart, label: '반도체 산업', query: '반도체 업계 전망을 알려주세요' },
    { icon: PieChart, label: '친환경 산업', query: '2024년 친환경 산업 동향' },
    { icon: FileText, label: '핀테크 동향', query: '핀테크 시장 현황과 전망' }
  ]

  const handleNewChat = () => {
    clearMessages()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black md:hidden z-40"
            onClick={onClose}
          />
          
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed md:relative w-72 h-full bg-white border-r border-gray-200 z-50 flex flex-col"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">대화 기록</h2>
                <button
                  onClick={onClose}
                  className="md:hidden p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={handleNewChat}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>새 대화 시작</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">추천 질문</h3>
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 text-left transition-colors"
                    onClick={() => {
                      onClose()
                    }}
                  >
                    <item.icon className="w-5 h-5 text-primary-500" />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-gray-500 truncate">{item.query}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                Powered by OpenAI GPT-4
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default Sidebar