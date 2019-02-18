import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http-service.service';
import {environment} from '../../../environments/environment';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {TSMap} from 'typescript-map';
import {UtilityService} from '../../services/utility.service';
import {AgreementService} from '../../services/agreement.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  encryptedData: any;
  user_datum: any = {};
  agreementlist: any = [];
  abn: any;
  police_check: any;
  children_check: any;
  logindata: any;
  clientinfo: TSMap<any, any> = new TSMap<any, any>();
  recentjobs: TSMap<any, any> = new TSMap<any, any>();
  recentjob: any = [];
  progress: any = 0;
  profiletype: any;
  careworkerdata: any;
  jobdata: any;

  constructor(private http: HttpService, private router: Router, private utility: UtilityService, private Agreementservice: AgreementService) {
    this.encryptedData = JSON.parse(localStorage.getItem('userdata'));
    this.user_datum = this.utility.decryptData(this.encryptedData, 'userdata');
    if (this.user_datum) {
      this.profiletype = this.user_datum.profile_type;
    }
    this.logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');
    this.profiletype = localStorage.getItem('type');
    this.getAbn();
  }

  ngOnInit() {
    this.getagreement();
    this.getRecentjobs();
    this.getAbn();
  }

  getagreement() {
    if (this.user_datum.profile_type === 'CLIENT') {
      var whereVar = JSON.stringify({'where': {'client_id': this.logindata.userId}});
    } else {
      var whereVar = JSON.stringify({'where': {'user_id': this.logindata.userId}});
    }
    const Url = environment.apiUrl + '/agreements?filter=' + encodeURIComponent(whereVar) + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.agreementlist = data.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
        for (let agreements of this.agreementlist) {
          this.getUserData(agreements.user_id);
          if (this.profiletype === 'CAREWORKER') {
            this.getClientData(agreements.client_id, agreements.id);
          } else {
            this.getClientData(agreements.user_id, agreements.id);
          }
        }
        console.log(this.clientinfo);
      }, error => {
        console.error(error);
      });
  }

  getUserData(id) {
    const Url = environment.apiUrl + '/basic_infos/' + id + '?access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
  }

  getClientData(id, agreement_id) {
    const Url = environment.apiUrl + '/basic_infos/' + id + '?access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.clientinfo.set(agreement_id, data);
      }, error => {
        console.log(error);
      });
  }

  getAbn() {
    var whereVar = JSON.stringify({'where': {'user_id': this.logindata.userId}});
    const Url = environment.apiUrl + '/cw_verifications?filter=' +  encodeURIComponent(whereVar)  + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.abn = data.abn;
        console.log(this.abn);
        this.police_check = data.police_check;
        this.children_check = data.children_check;
        if ((this.abn !== null && this.abn !== undefined) && this.police_check !== true && this.children_check !== true) {
          this.progress = 100;
        } else if ((this.abn !== true && this.police_check !== true && this.children_check === true) ||
          (this.abn !== null && this.police_check === true && this.children_check !== true) ||
        (this.abn === null && this.police_check !== true && this.children_check !== true )) {
          this.progress = 70;
        } else if ((this.abn !== null && this.police_check === true && this.children_check === true ) ||
        (this.abn === null && this.police_check === true && this.children_check !== true) ||
        (this.abn === null && this.police_check !== true && this.children_check === true )) {
          this.progress = 35;
        } else {
          this.progress = 0;
        }
        localStorage.setItem('progress', this.progress);
      }, error => {
        console.error(error);
        localStorage.setItem('progress', this.progress);
      });
  }

  redirect(agreement) {
    for ( let job of this.recentjob) {
      if (job.id === agreement.service_id) {
        this.jobdata = job;
      }
    }
    agreement['user_data'] = this.clientinfo.get(agreement.id);
    agreement['job_data'] = this.jobdata;
    this.Agreementservice.agreementData(agreement);
    this.Agreementservice.getJobdata('', '');
  }

  agreement(status) {
    this.router.navigate(['agreement'], {queryParams: { status: status }});
  }

  getRecentjobs() {
    if (this.user_datum.profile_type === 'CAREWORKER') {
      var Url = environment.apiUrl + '/services?access_token=' + this.logindata.id;
    } else {
      var whereVar = JSON.stringify({'where': {'user_id': this.logindata.userId}});
      var Url = environment.apiUrl + '/services?filter=' + encodeURIComponent(whereVar) + '&access_token=' + this.logindata.id;
    }
    this.http.httGet(Url).subscribe(
      data => {
        if (data) {
          this.recentjob = data.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
          console.log(this.recentjob);
          for (let caredata of data) {
            this.recentjobs.set(caredata.id, caredata);
          }
        }
      });
  }
}
