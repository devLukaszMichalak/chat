import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from '../../common/data/message.service';
import { Message } from '../../common/data/message';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {
  
  messages: InputSignal<Message[]> = input.required<Message[]>();
  sender: InputSignal<string> = input.required<string>();
  joinId: InputSignal<string> = input.required<string>();
  
  #fb: FormBuilder = inject(FormBuilder);
  #messageService: MessageService = inject(MessageService);
  
  messageForm = this.#fb.group({
    message: ['']
  });
  
  #messageContent = toSignal(this.messageForm.controls.message.valueChanges
      .pipe(map(value => (value ?? ''))),
    {initialValue: ''});
  
  disableSend = computed(() => this.#messageContent().length < 1 || this.#messageContent().length > 250);
  
  sendMessage = async () => {
    const messageContent = this.#messageContent();
    this.messageForm.controls.message.setValue('');
    await this.#messageService.sendMessage(this.sender(), messageContent, this.joinId());
  };
  
  sendMessageIfEnabled() {
    return this.disableSend() ? () => null : this.sendMessage();
  }
  
  copyJoinId = () => navigator.clipboard.writeText(this.joinId());
}
