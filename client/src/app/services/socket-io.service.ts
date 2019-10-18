import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as socketio from 'socket.io-client';
import { Mensagem } from '../shared/domain/mensagem';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  private api = environment.api;
  private socket = socketio(this.api);
  private subjectMensagem: Subject<Mensagem> = new Subject<Mensagem>();

  constructor() {
    this.socket.on('eventMensagem', (mensagem: Mensagem) => {
      this.subjectMensagem.next(mensagem);
    });
  }

  enviarMensagem(mensagem: Mensagem){
    this.socket.emit('eventMensagem', mensagem);
  }

  verificarMensagens(): Observable<Mensagem>{
    return this.subjectMensagem.asObservable();
  }

}
