import { inject, Injectable } from '@angular/core';
import { arrayUnion, updateDoc } from '@angular/fire/firestore';
import { Message } from './message';
import { ChatCollectionService } from './chat-collection.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  #chatCollectionService: ChatCollectionService = inject(ChatCollectionService);
  
  sendMessage = (sender: string, content: string, joinId: string): Promise<void> => {
    const roomReference = this.#chatCollectionService.getRoomRef(joinId);
    
    return updateDoc(roomReference, {
      messages: arrayUnion(this.#getMessage(sender, content))
    });
  };
  
  
  sendSystemMessage = (content: string, joinId: string): Promise<void> => {
    const roomReference = this.#chatCollectionService.getRoomRef(joinId);
    
    return updateDoc(roomReference, {
      messages: arrayUnion(this.#getSystemMessage(content))
    });
  };
  
  
  #getSystemMessage = (content: string) => this.#getMessage('System', content);
  
  #getMessage = (sender: string, content: string): Message => ({sender: sender, content: content, date: new Date()});
  
}
