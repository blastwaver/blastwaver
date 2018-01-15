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
    MaterialModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
