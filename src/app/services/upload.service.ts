import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// const URL = 'http://localhost:3000/api/upload';
const URL = 'http://www.naky.io/api/upload';

@Injectable()
export class UploadService {
  
  private readonly url: String ='http://localhost:3000';

  private readonly URL: String = this.url + '/api/upload'; 

  public readonly destination = 'http://localhost:3000/images/';
  
  private path = new BehaviorSubject<string>(null);
  
  public fileNameSubscription$ = this.path.asObservable();

  public uploader:FileUploader = new FileUploader({url: URL, itemAlias: 'photo'});
  
  constructor(private http:HttpClient) { 
    //override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
    this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };
    //overide the onCompleteItem property of the uploader so we are 
    //able to deal with the server response.
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      console.log(response);    
      this.path.next(response);
    };

  }

  
  deleteFile(fileName :string) {
    return this.http.delete(`${this.url}/api/upload/delete/${fileName}`)
                    .map((res: Response) => { return res.body;})
                    // .catch(this.handleError); 

                    //json parson plobel need to fix.
  }
  
  handleError (err: any) {
    let errMsg = (err.message) ? err.message :
        err.status ? `${err.status} - ${err.statusText}` : "Server error";
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
