import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material/material.module';
import { AppComponent } from './app.component';
import { TopNavComponent } from './components/top-nav/top-nav.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { SideBarTableComponent } from './components/side-bar/side-bar-table/side-bar-table.component';



@NgModule({
  declarations: [
    AppComponent,
    TopNavComponent,
    SideBarComponent,
    SideBarTableComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
