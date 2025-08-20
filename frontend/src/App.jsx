import React, { useState, useRef, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import ChatContainer from './components/ChatContainer'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { ChatProvider } from './context/ChatContext'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <ChatProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <ChatContainer />
        </div>
        
        <Toaster position="top-right" />
      </div>
    </ChatProvider>
  )
}

export default App