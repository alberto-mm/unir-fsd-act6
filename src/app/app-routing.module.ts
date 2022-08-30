import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404Component } from './components/error404/error404.component';
import { FormComponent } from './components/form/form.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { UsersListComponent } from './components/users-list/users-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: UsersListComponent },
  { path: 'user/:iduser', component: UserViewComponent },
  { path: 'newuser', component: FormComponent },
  { path: 'updateuser/:iduser', component: FormComponent },
  { path: '**', component: Error404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
