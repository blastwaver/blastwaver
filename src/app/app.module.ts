//app
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

//components & pipes
import { PeopleSearchComponent } from './components/main-page/search/people-search/people-search.component';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { SideBarTableComponent } from './components/main-page/side-bar-table/side-bar-table.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SearchComponent } from './components/main-page/search/search.component';
import { ChatComponent } from './components/main-page/chat/chat.component';
import { EmojiComponent } from './components/main-page/chat/emoji/emoji.component';
import { QuotationPipe } from './pipes/quotation.pipe';


//module
import { MaterialModule } from './modules/material.module';
import { CoreModule } from './modules/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { EmojiModule } from 'angular-emojione';


//services
import { UserService } from './services/user.service';
import { ChatService } from './services/chat.service';
import { FriendService } from './services/friend.service';

//ng material
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconRegistry } from '@angular/material';
import { environment } from '../environments/environment';


//redux
import { IAppState, rootReducer, INITIAL_STATE } from './store';
import { NgRedux, NgReduxModule} from '@angular-redux/store';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    MainPageComponent,
    SideBarTableComponent,
    LoginModalComponent,
    SearchComponent,
    PeopleSearchComponent,
    ProfileModalComponent,
    ChatComponent,
    EmojiComponent,
    QuotationPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    MaterialModule,
    CoreModule,
    HttpClientModule,
    NgReduxModule,
    EmojiModule
  ],
  providers: [
    UserService,
    FriendService,
    ChatService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { 
  
  constructor(ngRedux: NgRedux<IAppState>) {
    ngRedux.configureStore(rootReducer,INITIAL_STATE);
  } 
}
