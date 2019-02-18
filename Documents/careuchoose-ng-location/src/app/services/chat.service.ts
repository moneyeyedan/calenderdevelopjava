import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable, Subject } from 'rxjs/Rx';

declare var $;
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages: Subject<any>;
  notification: Subject<any>;

  constructor(private wsservice: WebsocketService) {
    this.messages = <Subject<any>>wsservice
    .chatconnect()
    .map((response: any): any => {
      return response;
    });

  }

  sendmsg(msg) {
    this.messages.next(msg);
    $('#message').val('');
  }

  joinchat(session) {
    this.messages.next(session);
  }

}
