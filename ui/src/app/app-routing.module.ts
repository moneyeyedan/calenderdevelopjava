import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRegisterComponent } from './admin-register/admin-register.component';
import {Routes ,RouterModule} from '@angular/router';
const routes: Routes = [
  
  {path:'admin',component:AdminRegisterComponent},
  { path: '',redirectTo:'admin',pathMatch:'full'}

];
@NgModule({
  imports: [
    CommonModule,RouterModule.forRoot(routes)
  ],exports:[RouterModule],
  declarations: []
})
export class AppRoutingModule { }
