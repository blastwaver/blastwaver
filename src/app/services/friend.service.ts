import { Injectable } from '@angular/core';
// import { Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FriendService {

  private readonly url: String ='http://localhost:3000';

  constructor(private http:HttpClient) { }
  
  //data sould be {my_id:"abc",f_id:"abc"}
  addFriend (data :{my_id:string, f_id:string}) {
    return this.http.post(`${this.url}/api/users/friends`, data)
                    .map((res: Response) => { return res;})
                    .catch(this.handleError); 
  }

  getFriendsList (id :string) {
    return this.http.get(`${this.url}/api/users/friends/list/${id}`)
                    .map((res: Response) => {return res;})
                    .catch(this.handleError)  
  }

  handleError (err: any) {
    let errMsg = (err.message) ? err.message :
        err.status ? `${err.status} - ${err.statusText}` : "Server error";
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
