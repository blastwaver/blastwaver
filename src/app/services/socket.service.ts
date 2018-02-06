import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  public socket = io({transports:['websocket'], upgrade: false});
  constructor() { }

}
