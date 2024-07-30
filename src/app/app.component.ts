import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JoinRoomComponent } from './join-room/join-room.component';
import { ChatComponent } from './chat/chat/chat.component';
import { JoinService } from './common/data/join.service';
import { Message } from './common/data/message';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, FormsModule, ReactiveFormsModule, JoinRoomComponent, ChatComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  
  #joinService = inject(JoinService);
  
  user = this.#joinService.user;
  joinId$ = this.#joinService.joinId$;
  room$ = this.#joinService.room$;
  
  messages$: Observable<Message[]> = this.room$.pipe(map(room => room.messages));
}
