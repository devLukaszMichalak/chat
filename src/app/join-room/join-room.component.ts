import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { JoinService } from '../common/data/join.service';
import { MessageService } from '../common/data/message.service';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './join-room.component.html',
  styleUrl: './join-room.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JoinRoomComponent {
  
  #joinService: JoinService = inject(JoinService);
  #messageService: MessageService = inject(MessageService);
  
  joinForm = this.#joinService.joinForm;
  disableJoin$ = this.#joinService.disableJoin$;
  
  constructor() {
    this.disableJoin$
      .pipe(takeUntilDestroyed())
      .subscribe(shouldDisable => {
        if (shouldDisable) {
          this.joinForm.controls.joinId.disable();
        } else {
          this.joinForm.controls.joinId.enable();
        }
      });
  }
  
  createNewRoom = async () => {
    const joinId = await this.#joinService.createNewRoom();
    const user = this.#joinService.user();
    await this.#messageService.sendSystemMessage(`User ${user} has joined`, joinId);
  };
  
  join = async () => {
    const joinId = this.#joinService.join();
    const user = this.#joinService.user();
    await this.#messageService.sendSystemMessage(`User ${user} has joined`, joinId);
  };
  
}
