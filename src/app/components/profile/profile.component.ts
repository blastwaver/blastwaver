import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgRedux, NgReduxModule } from '@angular-redux/store';
import { IAppState } from '../../store';
import { ISubscription } from 'rxjs/Subscription';
import { User } from '../../models/User';
import { UploadService } from '../../services/upload.service';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { UPDATE_USER } from '../../actions';
import { Router, NavigationStart } from '@angular/router';
import { MatSnackBar } from '@angular/material';

// const path ="http://localhost:3000/images/";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  
  public cProfileCheck : boolean;

  public checked = new BehaviorSubject<boolean>(null);
  
  private checkedObservable = this.checked.asObservable();
  
  private checkedSubscription$ : ISubscription;

  public disabled : boolean;

  public user : User;
  
  private userSubscription$ : ISubscription;

  private uploadedFileNameSubscription$ : ISubscription;

  private routerChangeSubscription$ : ISubscription;

  public uploader : FileUploader;

  public uploadedFilePath : string;

  public uploaded : boolean = false;

  constructor(private ngRedux :NgRedux<IAppState>,
              private uploadService :UploadService,
              private userService :UserService,
              private router: Router,
              private snackBar :MatSnackBar
            ) { }

  form = new FormGroup({
    username: new FormControl('',[
      Validators.maxLength(50),
      Validators.minLength(3),
      Validators.required
    ]),
    email: new FormControl('', Validators.email),
    comment: new FormControl('', Validators.maxLength(200))
  });

  get username() { return this.form.get('username');}  
  get email() { return this.form.get('email');}  
  get comment() { return this.form.get('comment');}  
  

  ngOnInit() {

    this.checkcProfileFromUser();

    this.observeCheckedForDisablityOfInput();
    
    this.getUploadedFileName();

    this.observeRouterChangeForDeletingSotoredFile()

  }
  
  checkcProfileFromUser() {
    this.userSubscription$ = this.ngRedux.select('user').subscribe((state) => {
      let array = []; array.push(state);
      this.user = array[0];
      // console.log(this.user.cProfile)
      this.cProfileCheck = this.user.cProfile;
      this.checked.next(this.user.cProfile);
    }, (err) => { console.log(err)});
  }

  async getUploadedFileName() {
    
    this.uploader = this.uploadService.uploader;
    let file = null;
    

    let result = await new Promise( (resolve) => {
        
      this.uploadedFileNameSubscription$ =  this.uploadService.fileNameSubscription$.subscribe((fileName) => {
        if(fileName) {  
          
          file = fileName;

          //when upload is done, change the image url to generate new image to img tag
          this.uploadedFilePath = this.uploadService.destination + fileName;
          this.uploaded = true;

          //get the old filename before update
          let oldImageUrl = this.ngRedux.getState().user.photoUrl.split('/');
          let oldImage = oldImageUrl[oldImageUrl.length -1];
          
          //upadate
          //second promise called to awit update result
          resolve(this.update()); 

          // delete old image ;
          this.uploadService.deleteFile(oldImage).subscribe((res) =>{
            //reste uploaded 
            this.uploaded = false;
          }, (err) =>{/* leave emty for parse issue*/}); 
        } else {
          // in the case upload failed then uploaded has to be false to prevent update 
          this.uploaded = false;
        }
          // console.log(this.uploaded)
        },(err) => console.log(err));
    }); 

    //retun value of observable(promise) needs type conversion to be used as an object, in the case use array
    let resutBox= []; resutBox.push(result);
      
    if(resutBox[0].result == 'success') {
      
    } else {

    }
  
  }

  observeCheckedForDisablityOfInput() {
    this.checkedSubscription$ = this.checkedObservable.subscribe((check) => {
      if(check) {
        this.username.enable();
        this.email.enable();
        this.comment.enable();
      } else if(!check) {
        this.username.disable();
        this.email.disable();
        this.comment.disable();
      }
    },(err) => console.log(err));
  }

  observeRouterChangeForDeletingSotoredFile() {
    this.routerChangeSubscription$ = this.router.events.filter(event => event instanceof NavigationStart).subscribe((val) => {
      let array=[]; array.push(val);
      // console.log(array[0].url);
    }, (err) => {console.log(err)})
  }

 async toggleChange(check) {
    this.checked.next(check.checked);
    this.cProfileCheck = check.checked;
    let result  = await this.update();     
  }
  
  async save($event) {
    
    let result;
    if(this.username.status == 'INVALID') {
      this.snackBar.open('please change the value', null, {
        duration: 5000,
      });
    }else {
      result = await this.update(); 
      if(result.result == 'success'){
        this.snackBar.open('Data has successfully changed ', null, {
          duration: 5000,
        });
      } else {
        this.snackBar.open("Error. Data hasn't updated.", null, {
          duration: 5000,
        });
      }
    }
    event.preventDefault();   
  }

  //update return promise value of update result;
  update() {
    let changes :User = {_id:"", username:"", email: "", photoUrl: "", comment:"", cProfile: false};
    let userFromRedux = this.ngRedux.getState().user;
    let userFromForm = this.form.value;
    let returnValue = null;

    changes._id = userFromRedux._id;
    changes.cProfile = this.cProfileCheck;
    changes.username = (userFromForm.username) ? userFromForm.username : userFromRedux.username;
    changes.email = (userFromForm.email) ? userFromForm.email : userFromRedux.email;
    changes.comment = (userFromForm.comment) ? userFromForm.comment : userFromRedux.comment;
    changes.photoUrl = (this.uploaded) ? this.uploadedFilePath : userFromRedux.photoUrl;
    return new Promise((resolve) => {
      this.userService.updateUser(changes).subscribe((result) => {
        //the result shows the data before update but aleady the data is updated in mongoDb, therefore ignore it.
        //statechange
        this.ngRedux.dispatch({type: UPDATE_USER, body: changes});
        resolve(result);
      },(err) => {
        resolve(err);
      });
    }) 
    
    
  }
  
  cancel () {
    this.router.navigate(['/main']);
  }

  ngOnDestroy() {
    this.userSubscription$.unsubscribe();
    this.uploadedFileNameSubscription$.unsubscribe();
    this.checkedSubscription$.unsubscribe();
    this.routerChangeSubscription$ .unsubscribe();
  }
}
