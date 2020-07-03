import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./dashboard.component";
import {AuthGuard} from "../guard/auth.guard";
import {UserComponent} from "./user/user.component";
import {UserDetailComponent} from "./user-detail/user-detail.component";
import {ServiceComponent} from "./service/service.component";


const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'user', pathMatch: 'full'},
      {path: 'user', component: UserComponent},
      {path: 'user/:id', component: UserDetailComponent},
      {path: 'user/:id/:service', component: ServiceComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
