import { ChangeDetectionStrategy, Component, inject, input, InputSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Message } from '../../common/data/message';
import { map, timer } from 'rxjs';
import { transition, trigger, useAnimation } from '@angular/animations';
import { slideInRight } from 'ng-animate';
import { ChatService } from '../data/chat.service';
import { toSignal } from '@angular/core/rxjs-interop';

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
  
  #chatService: ChatService = inject(ChatService);
  
  disableSend = this.#chatService.disableSend;
  messageForm = this.#chatService.messageForm;
  
  showJoinIdButton = toSignal(timer(700).pipe(map(() => true)), {initialValue: false});
  
  sendMessage = this.#chatService.sendMessage;
  
  sendMessageIfEnabled = () => this.disableSend() ? () => null : this.sendMessage();
  
  copyJoinId = () => navigator.clipboard.writeText(this.joinId());
}
