//app
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

//components & pipes
import { PeopleSearchComponent } from './components/people-search/people-search.component';
import { SideBarTableComponent } from './components/side-bar-table/side-bar-table.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SearchComponent } from './components/search/search.component';
import { ChatComponent } from './components/chat/chat.component';
import { EmojiComponent } from './components/emoji/emoji.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UsersModalComponent } from './components/users-modal/users-modal.component';
import { ProfileComponent } from './components/profile/profile.component';
import { QuotationPipe } from './pipes/quotation.pipe';
import { NamePipe } from './pipes/name.pipe';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';


//module
import { MaterialModule } from './modules/material.module';
import { CoreModule } from './modules/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { EmojiModule } from 'angular-emojione';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

//services
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { FriendService } from './services/friend.service';
import { UploadService } from './services/upload.service';
import { SocketService } from './services/socket.service';
import { MessageService } from './services/message.service';


//ng material
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconRegistry } from '@angular/material';
import { environment } from '../environments/environment';


//redux
import { IAppState, rootReducer, INITIAL_STATE } from './store';
import { NgRedux, NgReduxModule} from '@angular-redux/store';
import { SanitizerHtmlPipe } from './pipes/sanitizer-html.pipe';

//directive
import { FileSelectDirective } from 'ng2-file-upload';
import { ImgUrlPipe } from './pipes/img-url.pipe';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    MainPageComponent,
    SideBarTableComponent,
    LoginModalComponent,
    SearchComponent,
    PeopleSearchComponent,
    ChatComponent,
    EmojiComponent,
    QuotationPipe,
    SanitizerHtmlPipe,
    HomeComponent,
    NotFoundComponent,
    UsersModalComponent,
    ProfileComponent,
    FileSelectDirective,
    NamePipe,
    ImgUrlPipe,
    SnackBarComponent,
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    MaterialModule,
    CoreModule,
    HttpClientModule,
    NgReduxModule,
    EmojiModule,
    ReactiveFormsModule,
    // RouterModule.forRoot(routes,{useHash: true})
    RouterModule.forRoot([
      { path: '', component: HomeComponent},
      { path: 'home', component: HomeComponent},
      { path:'search', component: SearchComponent},
      { path:'main', component: MainPageComponent},
      { path:'profile', component: ProfileComponent},      
      { path: '**', component: NotFoundComponent}
    ])
  ],
  providers: [
    UserService,
    FriendService,
    ChatService,
    UploadService,
    SocketService,
    MessageService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { 
  
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer,INITIAL_STATE);
  } 
}
