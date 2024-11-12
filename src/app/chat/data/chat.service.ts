import { computed, inject, Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom, map } from 'rxjs';
import { MessageService } from '../../common/data/message.service';
import { JoinService } from '../../common/data/join.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  
  #fb: FormBuilder = inject(FormBuilder);
  #messageService: MessageService = inject(MessageService);
  #joinService = inject(JoinService);
  
  #user = this.#joinService.user;
  #joinId$ = this.#joinService.joinId$;
  
  #messageForm = this.#fb.group({
    message: ['']
  });
  
  get messageForm() {
    return this.#messageForm;
  }
  
  #messageContent = toSignal(this.#messageForm.controls.message.valueChanges
      .pipe(map(value => (value ?? ''))),
    {initialValue: ''});
  
  disableSend = computed(() => this.#messageContent().length < 1 || this.#messageContent().length > 250);
  
  sendMessage = async (): Promise<void> => {
    const joinId = await firstValueFrom(this.#joinId$);
    const messageContent = this.#messageContent();
    this.#messageForm.controls.message.setValue('');
    await this.#messageService.sendMessage(this.#user(), messageContent, joinId);
  };
  
}
