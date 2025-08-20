import axios from 'axios'
import { API_ENDPOINTS } from '../config/api'

class ChatService {
  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  async sendMessage(message, sessionId = null) {
    try {
      const response = await this.client.post(API_ENDPOINTS.CHAT, {
        message,
        session_id: sessionId
      })
      return response.data
    } catch (error) {
      console.error('Chat API Error:', error)
      throw this.handleError(error)
    }
  }

  async checkHealth() {
    try {
      const response = await this.client.get(API_ENDPOINTS.HEALTH)
      return response.data
    } catch (error) {
      console.error('Health Check Error:', error)
      throw this.handleError(error)
    }
  }

  handleError(error) {
    if (error.response) {
      const message = error.response.data?.detail || '서버 오류가 발생했습니다'
      return new Error(message)
    } else if (error.request) {
      return new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.')
    } else {
      return new Error('요청 처리 중 오류가 발생했습니다')
    }
  }
}

export const chatService = new ChatService()