import {Component, OnInit} from '@angular/core';
import swal from 'sweetalert2';
import _ from 'lodash';
import {environment} from '../../../environments/environment';
import {ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import {HttpService} from '../../services/http-service.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as CryptoJS from 'crypto-js';
import {AgreementService} from '../../services/agreement.service';
import {UtilityService} from '../../services/utility.service';
import {TSMap} from 'typescript-map';

declare var $;

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.css']
})
export class AgreementComponent implements OnInit {

  proposedAmount: any = '';
  workingDay: any = '';
  workingHoursScheme: any = 'hour';
  agreedService: any;
  status: any;
  rates: any = [];
  admins: any = [];
  moreText: string;
  spinner: any;
  clientid: any;
  jobid: any;
  logindata: any;
  jobdetails: TSMap<any, any> = new TSMap<any, any>();
  agreements: any = [];
  userinfo: TSMap<any, any> = new TSMap<any, any>();
  index: any;
  days: any = [];
  amount: any = [];
  agreement_info: any;
  profile_type: string;
  list: boolean;

  // What to clone
  @ViewChild('clone') template;

  // Where to insert the cloned content
  @ViewChild('container', {read: ViewContainerRef}) container;

  constructor(private http: HttpService, private Agreementservice: AgreementService, private activaterouter: ActivatedRoute,
              private utility: UtilityService, private router: Router) {
    const use = this.activaterouter.snapshot.queryParams['id'];
    this.list = this.activaterouter.snapshot.queryParams['status'];
    this.Agreementservice.client_id.subscribe(message => {
      this.clientid = message;
    });
    this.Agreementservice.job_id.subscribe(message => {
      this.jobid = message;
    });
    this.Agreementservice.agreement_id.subscribe(message => {
      this.agreement_info = message;
      this.getAgmntdata();
    });
    this.logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');
    // this.getJobDetails();
    this.profile_type = localStorage.getItem('type');
  }

  ngOnInit() {
    // this.getJobDetails();
    this.getAgreement();

  }

  getAgmntdata() {
    if (this.agreement_info !== '' && this.agreement_info !== undefined) {
      console.log(this.agreement_info);
      console.log(this.agreement_info.working_day, this.agreement_info.proposed_amount, this.agreement_info.agreed_services, this.agreement_info.working_hrs_scheme);
      const day = this.agreement_info.working_day;
      this.days = day.split(',', 7);
      const amount = this.agreement_info.proposed_amount;
      const amountsplit = amount.split(',', 7);
      this.amount = amountsplit;
      const data = [];
      let i = 0;
      for (const amt of this.amount) {
        this.rates[i] = {'proposed_amount': amt};
        i++;
      }
      let j = 0;
      for (const date of this.days) {
        this.rates[j] = {'working_day': date};
        j++;
        //  data['working_day'] = date;
      }
      console.log(this.rates);
      console.log(this.days);
      console.log(this.amount);
      this.agreedService = this.agreement_info.agreed_services;
      this.workingHoursScheme = this.agreement_info.working_hrs_scheme;
    }
  }


  onItemChange(item) {
    this.workingHoursScheme = (item.target.value === 'flateRate') ? 'flateRate' : 'hour';
  }

  sendAnOffer() {
    this.spinner = true;
    if (this.workingDay !== '' && this.proposedAmount !== '') {
      this.days.push(this.workingDay);
      this.amount.push(this.proposedAmount);
      this.workingDay = '';
      this.proposedAmount = '';
    } else {
      if (this.days.length === 0 && this.amount.length === 0) {
        swal({
          title: 'Please enter all data !!!',
          text: '',
          showConfirmButton: true,
          timer: 3000
        });
      }
    }
    const url = environment.apiUrl + '/agreements?access_token=' + this.logindata.id;
    const params = {
      'working_day': this.days,
      'proposed_amount': this.amount,
      'working_hrs_scheme': this.workingHoursScheme,
      'agreed_services': this.agreedService,
      'status': 'request',
      'client_id': this.jobid.user_id,
      'user_id': this.logindata.userId,
      'service_id': this.jobid.id
    };
    this.http.httpPost(params, url).subscribe(
      data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Success',
            text: 'Agreement request sent successfully!',
            showConfirmButton: false,
            timer: 2000
          });
          this.rates = [];
          this.days = [];
          this.amount = [];
          this.agreedService = '';
          this.spinner = false;
        }
        $('#sendoffer').modal('hide');
        $('.modal-backdrop').remove();
      }, error => {
        swal({
          type: 'error',
          title: 'Error to post Agreement',
          text: '',
          showConfirmButton: true,
          timer: 2000
        });
      });

  }

  add() {
    const rate = {
      'working_day': this.workingDay,
      'proposed_amount': this.proposedAmount,
    };
    this.rates.push(rate);
    this.days.push(rate.working_day);
    this.amount.push(rate.proposed_amount);
    this.workingDay = '';
    this.proposedAmount = '';
  }

  redirect(agreement) {
    this.router.navigate(['chat'], {
      queryParams: {
        agreement: this.utility.encryptData(agreement, 'agreement'),

      }
    });
    $('#sendoffer').modal('hide');
    $('.modal-backdrop').remove();
  }

  sendAccept(agreement) {
    const Url = environment.apiUrl + '/agreements/' + agreement.id + '?access_token=' + this.logindata.id;
    const param = {
      'status': 'accept',
    };
    this.http.httpPatch(param, Url).subscribe(
      data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Accepted',
            text: '',
            showConfirmButton: true,
            timer: 2000
          });
          const Url1 = environment.apiUrl + '/services/' + agreement.service_id + '?access_token=' + this.logindata.id;
          const jobupdate = {
            'cw_id': agreement.user_id,
            'job_status': 'ongoing'
          }
          this.http.httpPatch(jobupdate, Url1).subscribe(
            service => {
              if (service) {
                console.log('job status updated');
              }
            }, error => console.log('job status update error', error));
          this.saveAgreement(agreement);
          $('#sendoffer').modal('hide');
          $('.modal-backdrop').remove();
        }
      });
  }

  saveAgreement(agreement) {
    const Url = environment.apiUrl + '/connections?access_token=' + this.logindata.id;
    const param = {
      'client_id': agreement.client_id,
      'cw_id': agreement.user_id
    };
    this.http.httpPost(param, Url).subscribe(
      data => {
        if (data) {
          console.log('connention Added !');
        }
      }, error => console.log(error)
    );
  }

  sendReject(agreement) {
    const Url = environment.apiUrl + '/agreements/' + agreement.id + '?access_token=' + this.logindata.id;
    const param = {
      'status': 'rejected',
    };
    this.http.httpPatch(param, Url).subscribe(data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Rejected',
            text: '',
            showConfirmButton: true,
            timer: 2000
          });
          $('#sendoffer').modal('hide');
          $('.modal-backdrop').remove();
        }
      }, error => console.log(error)
    );
  }

  remove(i) {
    this.rates.splice(i, 1);
    this.days.splice(i, 1);
    this.amount.splice(i, 1);
  }

  getAgreement() {
    if (this.profile_type === 'CLIENT') {
      var whereVar = JSON.stringify({'where': {'client_id': this.logindata.userId}});
    } else {
      var whereVar = JSON.stringify({'where': {'user_id': this.logindata.userId}});
    }
    const Url = environment.apiUrl + '/agreements?filter=' + encodeURIComponent(whereVar) + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.agreements = data.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
        for (let agreements of this.agreements) {
          if (this.profile_type === 'CAREWORKER') {
            this.getClientData(agreements.client_id, agreements.id);
            this.getJobDetails(agreements.service_id, agreements.id);
          } else {
            this.getClientData(agreements.user_id, agreements.id);
            this.getJobDetails(agreements.service_id, agreements.id);
          }
        }
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
        this.userinfo.set(agreement_id, data);
      }, error => {
        console.log(error);
      });
  }

  getJobDetails(id, agreement_id) {
    const Url = environment.apiUrl + '/services/' + id + '?access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.jobdetails.set(agreement_id, data);
      }, error => {
        console.log(error);
      });
    }
}
