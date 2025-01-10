import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from '../app/user-list/user-list.component';
import { AddUpdateComponent } from '../app/add-update/add-update.component';

const routes: Routes = [
  { path: '', redirectTo: 'add-update', pathMatch: 'full' },

  { path: 'user-list', component: UserListComponent },
  { path: 'add-update', component: AddUpdateComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
