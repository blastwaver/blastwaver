import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  
  private readonly url: String ='http://localhost:3000';

  constructor(private http:HttpClient) {
    
  }

  getUsers() { 
    return this.http.get(`${this.url}/api/users`)
               .map((res: Response) => { return res;})
               .catch(this.handleError); 
  } 


  getUser(id :String) {
    return this.http.get(`${this.url}/api/users/${id}`)
                    .map((res: Response) => { return res;})
                    .catch(this.handleError); 
  }

  getUserByGoogle(id :String) {
    return this.http.get(`${this.url}/api/users/google/${id}`)
                    .map((res: Response) => { return res})
                    .catch(this.handleError); 
  }

  updateUser(data) {
    return this.http.post(`${this.url}/api/users/update`,data)
                    .map((res: Response) => { return res})
                    .catch(this.handleError); 
  }

  createUser(data) {
    return this.http.post(`${this.url}/api/users/create`, data)
                    .map((res: Response) => { return res})
                    .catch(this.handleError);
  }


  deleteUser(id: String){
    return this.http.post(`${this.url}/api/users/create`,id)
                    .map((res: Response) => { return res})
                    .catch(this.handleError);
  }

  searchUsers(name :String) { 
    return this.http.get(`${this.url}/api/users/search/name/${name}`)
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
