import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {HttpService} from './services/http-service.service';
import {LoginComponent} from './components/login/login.component';
import {EmailDirective} from './directives/email.directive';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {ShowErrorsComponent} from './directives/errors.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {SignupComponent} from './components/signup/signup.component';
import {ProfileComponent} from './components/profile/profile.component';
import {JobsComponent} from './components/jobs/jobs.component';
import {TimesheetComponent} from './components/timesheet/timesheet.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { HomeComponent } from './components/home/home.component';
import { ChatComponent } from './components/chat/chat.component';
import { NgxMultiLineEllipsisModule } from 'ngx-multi-line-ellipsis';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { ChatService } from './services/chat.service';
import { WebsocketService } from './services/websocket.service';
import {AgreementComponent} from './components/agreement/agreement.component';
import { RecentMessagesComponent } from './components/recent-messages/recent-messages.component';
import { AccountComponent } from './components/account/account.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConnectionComponent} from './components/connection/connection.component';
import { BillingComponent } from './components/billing/billing.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { ShiftnotesComponent } from './components/shiftnotes/shiftnotes.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AgmCoreModule } from '@agm/core';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'jobs', component: JobsComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'timesheet', component: TimesheetComponent},
  {path: 'home', component: HomeComponent},
  {path: 'chat', component: ChatComponent},
  {path: 'agreement', component: AgreementComponent},
  {path: 'account', component: AccountComponent},
  {path: 'billing', component: BillingComponent},
  {path: 'shiftnotes', component: ShiftnotesComponent},
  {path: 'connection', component: ConnectionComponent},

  {path: '', redirectTo: 'home', pathMatch: 'full'}
];
export declare const ACTIVE: string;

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmailDirective,
    SignupComponent,
    ShowErrorsComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    ProfileComponent,
    FooterComponent,
    JobsComponent,
    TimesheetComponent,
    HomeComponent,
    ChatComponent,
    AgreementComponent,
    PersonalInfoComponent,
    RecentMessagesComponent,
    AccountComponent,
    ConnectionComponent,
    BillingComponent,
    ShiftnotesComponent,
    ForgetpasswordComponent,
  ],
  imports: [
    GooglePlaceModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgxPaginationModule,
    NgxMultiLineEllipsisModule,
    OwlDateTimeModule,
    NgxPayPalModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true }),
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SearchPipeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBx3mB6iVt9EjzLDmb8xx17bB_VPZYLUZQ'
    }),
  ],
  providers: [
    HttpService,
    HeaderComponent,
    ChatService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
