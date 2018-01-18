import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { AppComponent } from './app.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SideBarTableComponent } from './components/side-bar/side-bar-table/side-bar-table.component';
import { CoreModule } from './modules/auth.module';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { MatIconRegistry } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    SideBarComponent,
    SideBarTableComponent,
    LoginModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    MaterialModule,
    CoreModule,
    HttpClientModule
  ],
  providers: [
    UserService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
