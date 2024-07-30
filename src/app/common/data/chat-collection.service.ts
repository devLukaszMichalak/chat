import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, documentId, Firestore, query, setDoc, where } from '@angular/fire/firestore';
import { nanoid } from 'nanoid';
import { map, Observable } from 'rxjs';
import { Room } from './room';

@Injectable({
  providedIn: 'root'
})
export class ChatCollectionService {
  
  #firestore: Firestore = inject(Firestore);
  #chatCollection = collection(this.#firestore, 'chat');
  
  getRoomRef = (joinId: string) => doc(this.#chatCollection, joinId);
  
  initRoom = async (): Promise<string> => {
    const joinId: string = this.#generateRoomId();
    const roomReference = this.getRoomRef(joinId);
    await setDoc(roomReference, {messages: []});
    return joinId;
  };
  
  getRoom = (joinId: string): Observable<Room> => {
    const queryToJoin = query(
      this.#chatCollection,
      where(documentId(), '==', joinId)
    );
    
    return collectionData<Room>(queryToJoin)
      .pipe(map((arrWithOneItem: Room[]) => arrWithOneItem[0]));
  };
  
  #generateRoomId = (): string => new Date().toISOString() + '=' + nanoid();
}
