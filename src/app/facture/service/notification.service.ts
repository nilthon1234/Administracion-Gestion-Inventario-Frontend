import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationData } from '../../shared/models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  private newCodeGeneratedSource = new Subject<NotificationData>();
  newCodeGenerated$ = this.newCodeGeneratedSource.asObservable();

  notifyNewCode(data: NotificationData) {
    this.newCodeGeneratedSource.next(data);
  }
  constructor() { }
}
