import { inject, Injectable, Signal } from '@angular/core';
import { map, Observable, shareReplay, startWith, Subject, switchMap } from 'rxjs';
import { Room } from './room';
import { FormBuilder } from '@angular/forms';
import { ChatCollectionService } from './chat-collection.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class JoinService {
  
  #chatCollectionService: ChatCollectionService = inject(ChatCollectionService);
  #fb: FormBuilder = inject(FormBuilder);
  
  #joinForm = this.#fb.group({
    user: [''],
    joinId: ['']
  });
  
  #joinIdSubject$ = new Subject<string>();
  
  joinId$ = this.#joinIdSubject$.asObservable()
    .pipe(shareReplay({bufferSize: 1, refCount: true}));
  
  user: Signal<string> = toSignal(this.#joinForm.controls.user.valueChanges
    .pipe(map(value => value ?? '')), {initialValue: ''});
  
  room$: Observable<Room> = this.#joinIdSubject$.pipe(
    switchMap(joinId => this.#chatCollectionService.getRoom(joinId))
  );
  
  disableJoin$ = this.#joinForm.controls.user.valueChanges.pipe(
    startWith(''),
    map(value => (value ?? '').length < 2)
  );
  
  get joinForm() {
    return this.#joinForm;
  }
  
  createNewRoom = async (): Promise<string> => {
    const joinId = await this.#chatCollectionService.initRoom();
    this.#joinIdSubject$.next(joinId);
    return joinId;
  };
  
  join = (): string => {
    const joinId: string = this.#joinForm.controls.joinId.value?.trim() ?? '';
    this.#joinIdSubject$.next(joinId);
    return joinId;
  };
  
}
