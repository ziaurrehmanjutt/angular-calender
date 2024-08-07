import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { CalenderComponent } from './calender/calender.component';
import { HeaderComponent } from './header/header.component';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';  // Import FormsModule

import { MatSidenavModule } from '@angular/material/sidenav';  // Import MatSidenavModule
import { MatIconModule } from '@angular/material/icon';
import { AddCalenderComponent } from './add-calender/add-calender.component';        // Import MatIconModule
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent,
    CalenderComponent,
    HeaderComponent,
    AddCalenderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatDatepickerModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatIconModule,
    MatNativeDateModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
