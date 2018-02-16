import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '../models/Message';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessageService {
  
  port =  process.env.port || 3000;
  private readonly url: String =`http://localhost:${this.port}`;

  constructor(private http :HttpClient) { }

  addMessage(data :Message) {
    return this.http.post(`${this.url}/api/messages/add`,data)
                    .map((res :Response) => { return res})
                    .catch(this.handleError);
  }

  addMessageToMultipleTarget(data :Message) {
    return this.http.post(`${this.url}/api/messages/add/multiple`,data)
                    .map((res :Response) => { return res})
                    .catch(this.handleError);
  }

  getMessages(_id :string){
    return this.http.get(`${this.url}/api/messages/get/${_id}`)
                    .map((res :Response) => { return res})
                    .catch(this.handleError);
  }

  setRead(_id :string, m_id :string){
    let data = {_id: _id, m_id: m_id};
    return this.http.post(`${this.url}/api/messages/read`,data)
                    .map((res :Response) => { return res})
                    .catch(this.handleError);
  }

  setReadAll(_id :string){
    let data = {_id: _id};
    return this.http.post(`${this.url}/api/messages/read/all`,data)
                    .map((res :Response) => { return res})
                    .catch(this.handleError);
  }

  deleteMessage(_id :string, m_id :string) {
    let data = {_id: _id, m_id: m_id};
    return this.http.post(`${this.url}/api/messages/delete`,data)
                    .map((res :Response) => { return res})
                    .catch(this.handleError);
  }

  deleteMessageAll(_id :string) {
    let data  = {_id: _id};
    return this.http.post(`${this.url}/api/messages/delete/all`,data)
                    .map((res :Response) => { return res})
                    .catch(this.handleError);
  }

  handleError (err: any) {
    let errMsg = (err.message) ? err.message :
        err.status ? `${err.status} - ${err.statusText}` : "Server error";
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
