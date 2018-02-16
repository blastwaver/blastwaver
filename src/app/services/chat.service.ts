import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chat } from '../models/Chat';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ChatService {
  private port =  3000;
  private readonly url: String =`http://localhost:${this.port}`;

  constructor(private http:HttpClient) { }

  addChat(data :Chat) {
    return this.http.post(`${this.url}/api/chat/add`, data)
          .map((res: Response) => { return res;})
          .catch(this.handleError); 
  }

  getChat(roomNumber :string) {
    return this.http.get(`${this.url}/api/chat/get/${roomNumber}`)
          .map((res: Response) => { return res;})
          .catch(this.handleError); 
  }

  handleError (err: any) {
    let errMsg = (err.message) ? err.message :
        err.status ? `${err.status} - ${err.statusText}` : "Server error";
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
