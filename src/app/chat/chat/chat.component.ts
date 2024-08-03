import { ChangeDetectionStrategy, Component, computed, inject, input, InputSignal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../common/data/message.service';
import { Message } from '../../common/data/message';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, timer } from 'rxjs';
import { transition, trigger, useAnimation } from '@angular/animations';
import { slideInRight } from 'ng-animate';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
  animations: [
    trigger('slide', [
        transition(':enter', useAnimation(slideInRight, {params: {timing: 0.2}}))
      ]
    )
  ],
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
  
  showJoinIdButton = toSignal(timer(700).pipe(map(() => true)), {initialValue: false});
  
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
