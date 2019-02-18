import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpService} from '../../services/http-service.service';
import {FormGroup} from '@angular/forms';
import swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import {TSMap} from 'typescript-map';
import {Router} from '@angular/router';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {ChatService} from '../../services/chat.service';
import {UtilityService} from '../../services/utility.service';
import {a} from '@angular/core/src/render3';
import {AgreementService} from '../../services/agreement.service';
import { timeout } from 'rxjs/operators';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

declare var $;
declare var google: any;
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})

export class JobsComponent implements OnInit {

  encryptedData: any;
  spinner = false;
  userdata: any = {};
  postedjobdetails: any = [];
  careWorkerjobs: any = [];
  careworkerjobmap: TSMap<any, any> = new TSMap<any, any>();
  ongoingjobs: TSMap<any, any> = new TSMap<any, any>();
  suburb: string;
  hours: any = '';
  jobref: string;
  gender = 'any';
  when_required: string = 'I am flexible';
  lookingfor: any;
  job_regularity: string = 'Once off';
  jobreg: boolean;
  services: any = [];
  splitted: any = [];
  id: any;
  datenow: any;
  job_index: any;
  clientid: any;
  clientdata: any = {};
  logindata: any;
  monday = false;
  tuesday = false;
  wednesday = false;
  thursday = false;
  friday = false;
  saturday = false;
  sunday = false;
  clientavailability: any;
  availability: TSMap<any, any> = new TSMap<any, any>();
  job_id: any;
  update = false;
  companion: boolean;
  community: boolean;
  provide: boolean;
  meal: boolean;
  house: boolean;
  showering: boolean;
  mobility: boolean;
  assist: boolean;
  nursing: boolean;
  health: boolean;
  availability_id: any;
  value: boolean = true;
  agreements: any = [];
  careworkerdata: any;
  title: any;

  constructor(private http: HttpService, private router: Router, private chat: ChatService, private utility: UtilityService, private Agreementservice: AgreementService) {
  }

  ngOnInit() {
    this.encryptedData = JSON.parse(localStorage.getItem('userdata'));
    this.userdata = this.utility.decryptData(this.encryptedData, 'userdata');
    this.logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');
    this.getAgreement();
    this.getClientAvailabilityAll();
    this.getJobdetails();
    this.datenow = Date.now();
    this.getCareWorkerJobDetails();

  }
  public handleAddressChange(address: any) {
    this.suburb = address.formatted_address;

  }
  postJob(form) {

    const Url = environment.apiUrl + '/services?access_token=' + this.logindata.id;
    const param = {
      'suburb': this.suburb,
      'job_regularity': this.job_regularity,
      'work_hours': this.hours,
      'when_exactly': this.when_required,
      'job_reference': this.jobref,
      'looking_for': this.lookingfor,
      'gender': this.gender,
      'services': this.services,
      'user_id': this.userdata.id,
      'job_status': 'posted'
    };
    this.http.httpPost(param, Url).subscribe(
      data => {
        if (data) {
          let serviceid = data;
          this.services = [];
          this.job_regularity = 'Once off';
          swal({
            type: 'success',
            title: 'Job posted',
            text: '',
            showConfirmButton: true,
            timer: 2000
          });
          this.getJobdetails();
          $('#myModal').modal('hide');
          $('.modal-backdrop').remove();
          if (this.when_required === 'Particular days') {
            let Url = environment.apiUrl + '/cw_availabilities?access_token=' + this.logindata.id;
            const parameter = {
              'avail_monday': this.monday,
              'avail_tuesday': this.tuesday,
              'avail_wednesday': this.wednesday,
              'avail_thursday': this.thursday,
              'avail_friday': this.friday,
              'avail_saturday': this.saturday,
              'avail_sunday': this.sunday,
              'user_id': this.userdata.id,
              'service_id': serviceid.id
            };
            this.http.httpPost(parameter, Url).subscribe(
              availability => {
                if (availability) {
                  console.log('data added successfully');
                  this.when_required = 'I am flexible';
                  form.reset();
                }
              }, error => console.log('error to update the availability value'));
          } else {
            form.reset();
          }
        }
      }, error => {
        swal({
          type: 'error',
          title: 'Error to posted job details',
          text: '',
          showConfirmButton: true,
          timer: 2000
        });
      });
  }

  radioevent(event: any) {
    this.gender = event.target.value;
  }

  getJobdetails() {
    this.spinner = true;
    const whereVar = JSON.stringify({'where': {'user_id': this.userdata.id}});
    const Url = environment.apiUrl + '/services?filter=' + encodeURIComponent(whereVar) + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).pipe(
      timeout(10000) //10 seconds
    ).subscribe(
      data => {
        this.postedjobdetails = data.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));
        for (let caredata of this.postedjobdetails) {
          if (caredata.job_status === 'ongoing' && caredata.user_id === this.logindata.userId) {
            const Url1 = environment.apiUrl + '/basic_infos/' + caredata.cw_id + '?access_token=' + this.logindata.id;
            this.http.httGet(Url1).subscribe(
              user => {
                caredata['user'] = user;
              });
            this.ongoingjobs.set(caredata.id, caredata);

          }
        }
        this.spinner = false;
      }, error => {
        this.spinner = false;
        console.error('error in get Job details');
      }
    );
  }

  onSelected(event) {
    if (event.target.checked) {
      this.services.push(event.target.value);
      if (event.target.value === 'Companionship And socila support') {
        this.companion = true;
      } else if (event.target.value === 'Community participation & sports activities') {
        this.community = true;
      } else if (event.target.value === 'Provide transport') {
        this.provide = true;
      } else if (event.target.value === 'Meal preparation and shopping') {
        this.meal = true;
      } else if (event.target.value === 'Light house work') {
        this.house = true;
      } else if (event.target.value === 'Showering Toileting and Dressing') {
        this.showering = true;
      } else if (event.target.value === 'Manual Transfer and mobility') {
        this.mobility = true;
      } else if (event.target.value === 'Assist with medication') {
        this.assist = true;
      } else if (event.target.value === 'Nursing Services') {
        this.nursing = true;
      } else if (event.target.value === 'Allied Health Services') {
        this.health = true;
      }
    }
    if (!event.target.checked) {

      this.ondelete(event.target.value);
    }
  }

  ondelete(name) {
    let i = 0;
    let index;

    if (name === 'Companionship And socila support') {
      this.companion = false;
    } else if (name === 'Community participation & sports activities') {
      this.community = false;
    } else if (name === 'Provide transport') {
      this.provide = false;
    } else if (name === 'Meal preparation and shopping') {
      this.meal = false;
    } else if (name === 'Light house work') {
      this.house = false;
    } else if (name === 'Showering Toileting and Dressing') {
      this.showering = false;
    } else if (name === 'Manual Transfer and mobility') {
      this.mobility = false;
    } else if (name === 'Assist with medication') {
      this.assist = false;
    } else if (name === 'Nursing Services') {
      this.nursing = false;
    } else if (name === 'Allied Health Services') {
      this.health = false;
    }

    for (let check of this.services) {
      if (check === name) {
        index = i;
        break;
      }
      i++;
    }
    this.services.splice(index, 1);
  }

  getCareWorkerJobDetails() {
    const filter = JSON.stringify({'where': {'job_status': 'posted'}});
    const Url = environment.apiUrl + '/services?filter=' + filter + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.careWorkerjobs = data.sort((a, b) => parseFloat(b.id) - parseFloat(a.id));

        for (let job of this.careWorkerjobs) {
          job['agreement_status'] = false;
          job['agreement'] = '';
          this.careworkerjobmap.set(job.id, job);
        }
        console.log(this.careWorkerjobs);
      }, error => console.error('error in get Job details')
    );
  }

  ifApplied(job) {
    for (let agreement of this.agreements) {
      if (agreement.service_id === job.id) {
        job['agreement_status'] = true;
        job['agreement'] = agreement;
       // this.careworkerjobmap.set(job.id, job);
        return true;
      }
    }
  }

  getAgreement() {
    this.http.httGet(environment.apiUrl + '/agreements').subscribe(
      data => {
        this.agreements = data;
        // console.log('agreementdata', data);
      }
    );
  }

  sendAgreementData(job, agreement, clientdata) {
    $('#jobview').modal('hide');
    $('.modal-backdrop').remove();
    agreement['user_data'] = clientdata;
    agreement['job_data'] = job;
    this.Agreementservice.agreementData(agreement);
    this.Agreementservice.getJobdata('', '');
  }

  getClientAvailabilityAll() {
    const Url = environment.apiUrl + '/cw_availabilities?access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.clientavailability = data;
        for (let available of this.clientavailability) {
          this.availability.set(available.service_id, available);
        }
      }, error => {
        console.error(error);
      });
  }

  viewjob(index, clientdetails: any, key) {
    this.job_index = index;
    this.job_id = key;
    this.clientid = this.careworkerjobmap.get(this.job_id).user_id;
    const str = this.careworkerjobmap.get(this.job_id).services;
    const splitted = str.split(',', 12);
    this.splitted = splitted;
    this.getClientData(this.clientid);
  }

  getClientData(clientid) {
    const Url = environment.apiUrl + '/basic_infos/' + clientid + '?access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.clientdata = data;
      }, error => {
        console.error(error);
      });
    return this.clientdata;
  }

  applyToJob(clientdata, jobdata) {
    this.router.navigate(['chat'], {
      queryParams: {
        client_data: this.utility.encryptData(clientdata, 'clientdata'),
        job_data: this.utility.encryptData(jobdata, 'jobdata')
      }
    });
    $('#jobview').modal('hide');
    $('.modal-backdrop').remove();

    // create a chat session/room for specific job
    var packet = {
      'room_id': jobdata.id +'-'+ this.userdata.id +'-'+ clientdata.id,
      'job_id': jobdata.id,
      'recipient_id': clientdata.id,
      'recipient_name': clientdata.first_name + ' '+ clientdata.last_name,
      'sender_id': this.userdata.id,
      'sender_name': this.userdata.first_name + ' '+ this.userdata.last_name,
      'first_chat': jobdata.id +'-'+ this.userdata.id +'-'+ clientdata.id,
    };
    this.chat.joinchat(packet);
  }

  editJobDetails(item) {
    console.log(item);
    this.update = true;
    this.id = item.id;
    /*    this.companion = false;
        this.community = false;
        this.provide = false;
        this.meal = false;
        this.house = false;
        this.showering = false;
        this.mobility = false;
        this.assist = false;
        this.nursing = false;
        this.health = false;*/
    this.suburb = item.suburb;
    this.job_regularity = item.job_regularity;
    this.hours = item.work_hours;
    this.when_required = item.when_exactly;
    if (this.when_required === 'Particular days') {
      this.getAvailability(item.id);
    } else if (this.when_required === 'I am flexible') {
      this.availability_id = 0;
    }
    this.jobref = item.job_reference;
    const split = item.services;
    const serv = split.split(',', 12);
    this.services = serv;
    for (let service of this.services) {
      if (service === 'Companionship And social support') {
        this.companion = true;
      } else if (service === 'Community participation & sports activities') {
        this.community = true;
      } else if (service === 'Provide transport') {
        this.provide = true;
      } else if (service === 'Meal preparation and shopping') {
        this.meal = true;
      } else if (service === 'Light house work') {
        this.house = true;
      } else if (service === 'Showering Toileting and Dressing') {
        this.showering = true;
      } else if (service === 'Manual Transfer and mobility') {
        this.mobility = true;
      } else if (service === 'Assist with medication') {
        this.assist = true;
      } else if (service === 'Nursing Services') {
        this.nursing = true;
      } else if (service === 'Allied Health Services') {
        this.health = true;
      }
    }
    this.lookingfor = item.looking_for;
    this.gender = item.gender;
  }

  getAvailability(service_id) {
    const filter = JSON.stringify({'where': {'service_id': service_id}});
    const Url = environment.apiUrl + '/cw_availabilities?filter=' + encodeURIComponent(filter) + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        if (data) {
          this.availability_id = data.id;
          console.log(data);
          this.monday = data[0].avail_monday;
          this.tuesday = data[0].avail_tuesday;
          this.wednesday = data[0].avail_wednesday;
          this.thursday = data[0].avail_thursday;
          this.friday = data[0].avail_friday;
          this.saturday = data[0].avail_saturday;
          this.sunday = data[0].avail_sunday;
        }
      }, error => {
        console.error(error);
      });
  }

  updateJobDetails(form) {
    this.spinner = true;
    const Url = environment.apiUrl + '/services/' + this.id + '?access_token=' + this.logindata.id;
    const param = {
      'suburb': this.suburb,
      'job_regularity': this.job_regularity,
      'work_hours': this.hours,
      'when_exactly': this.when_required,
      'job_reference': this.jobref,
      'looking_for': this.lookingfor,
      'gender': this.gender,
      'services': this.services,
      'user_id': this.userdata.id
    };
    var when = this.when_required;
    this.http.httpPutAuth(param, Url).subscribe(
      data => {
        this.spinner = false;
        if (data) {
          const serviceid = data;
          this.gender = 'any';
          this.services = [];
          this.job_regularity = 'Once off';
          swal({
            type: 'success',
            title: 'Job updated',
            text: '',
            showConfirmButton: true,
            timer: 2000
          });
          $('#myModal').modal('hide');
          $('.modal-backdrop').remove();
          if (when === 'Particular days') {
            this.postCareWorkerAvailability(serviceid);
          }
        }
      }, error => {
        this.spinner = false;
        swal({
          type: 'error',
          title: 'Error to posted job details',
          text: '',
          showConfirmButton: true,
          timer: 2000
        });
      });
    this.getJobdetails();
    form.reset();
  }

  postCareWorkerAvailability(item) {
    const Url = environment.apiUrl + '/cw_availabilities/' + this.availability_id + '?access_token=' + this.logindata.id;
    const parameter = {
      'avail_monday': this.monday,
      'avail_tuesday': this.tuesday,
      'avail_wednesday': this.wednesday,
      'avail_thursday': this.thursday,
      'avail_friday': this.friday,
      'avail_saturday': this.saturday,
      'avail_sunday': this.sunday,
      'user_id': this.userdata.id,
      'service_id': item.id
    };
    this.http.httpPutAuth(parameter, Url).subscribe(
      data => {
        if (data) {
          console.log('data added successfully');
          this.when_required = 'I am flexible';
        }
      }, error => console.log('error to update the availability value'));
  }

  deleteJob(jobdetails) {
    let Url = environment.apiUrl + '/services/' + jobdetails.id + '?access_token=' + this.logindata.id;
    this.http.httDelete(Url).subscribe(data => {
      if (data) {
        swal({
          type: 'success',
          title: 'Job Deleted Successfully',
          text: '',
          showConfirmButton: true,
          timer: 2000
        });
        this.getJobdetails();
      }
    }, error => console.log(error));
  }

  reset(form) {
    this.suburb = '';
    this.jobref = '';
    this.hours = '';
    this.services = [];
    this.update = false;
    this.companion = false;
    this.community = false;
    this.provide = false;
    this.meal = false;
    this.house = false;
    this.showering = false;
    this.mobility = false;
    this.assist = false;
    this.nursing = false;
    this.health = false;
    this.monday = false;
    this.tuesday = false;
    this.wednesday = false;
    this.thursday = false;
    this.friday = false;
    this.saturday = false;
    this.sunday = false;
    this.when_required = 'I am flexible';
    this.job_regularity = 'Once off';
    this.gender = 'any';
  }
}
