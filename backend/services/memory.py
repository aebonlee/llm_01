from typing import List, Dict, Optional
from datetime import datetime, timedelta
import json

class ConversationMemory:
    def __init__(self, max_history: int = 20, ttl_hours: int = 24):
        self.conversations = {}
        self.max_history = max_history
        self.ttl_hours = ttl_hours
    
    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self.conversations:
            self.conversations[session_id] = {
                "messages": [],
                "created_at": datetime.now(),
                "last_accessed": datetime.now()
            }
        
        self.conversations[session_id]["messages"].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat()
        })
        
        self.conversations[session_id]["last_accessed"] = datetime.now()
        
        if len(self.conversations[session_id]["messages"]) > self.max_history:
            self.conversations[session_id]["messages"] = \
                self.conversations[session_id]["messages"][-self.max_history:]
        
        self._cleanup_old_sessions()
    
    def get_history(self, session_id: str) -> List[Dict]:
        if session_id not in self.conversations:
            return []
        
        self.conversations[session_id]["last_accessed"] = datetime.now()
        return self.conversations[session_id]["messages"]
    
    def clear_session(self, session_id: str):
        if session_id in self.conversations:
            del self.conversations[session_id]
    
    def _cleanup_old_sessions(self):
        current_time = datetime.now()
        expired_sessions = []
        
        for session_id, data in self.conversations.items():
            if current_time - data["last_accessed"] > timedelta(hours=self.ttl_hours):
                expired_sessions.append(session_id)
        
        for session_id in expired_sessions:
            del self.conversations[session_id]
    
    def get_session_info(self, session_id: str) -> Optional[Dict]:
        if session_id not in self.conversations:
            return None
        
        return {
            "session_id": session_id,
            "message_count": len(self.conversations[session_id]["messages"]),
            "created_at": self.conversations[session_id]["created_at"].isoformat(),
            "last_accessed": self.conversations[session_id]["last_accessed"].isoformat()
        }