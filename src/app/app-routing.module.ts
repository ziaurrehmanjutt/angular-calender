import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalenderComponent } from './calender/calender.component';

const routes: Routes = [
  { path: '', redirectTo: '/calender', pathMatch: 'full' },  // Set default route
  { path: 'calender', component: CalenderComponent },  // Define route for the new page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
