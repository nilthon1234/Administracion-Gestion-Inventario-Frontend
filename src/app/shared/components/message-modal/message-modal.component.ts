import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-modal',
  imports: [],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.css'
})
export class MessageModalComponent {
  @Input() message: string = '';
  @Input() isError: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
