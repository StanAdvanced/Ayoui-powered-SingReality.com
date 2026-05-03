import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export interface ChatInteraction {
  userId?: string;
  userMessage: string;
  assistantResponse: string;
  persona: string;
  timestamp: any;
}

export const knowledgebaseService = {
  logInteraction: async (interaction: Omit<ChatInteraction, 'timestamp'>) => {
    try {
      await addDoc(collection(db, 'chat_interactions'), {
        ...interaction,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error logging interaction to knowledgebase:', error);
    }
  }
};
