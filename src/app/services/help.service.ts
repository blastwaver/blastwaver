import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HelpService {
  url = 'http://www.naky.io';

  constructor(private http :HttpClient ) { }

  sendEmail() { 
    return this.http.get(`${this.url}/api/help/email`)
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
