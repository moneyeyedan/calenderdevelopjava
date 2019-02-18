import {Component, OnInit} from '@angular/core';
import {environment} from '../../../environments/environment';
import {FormGroup} from '@angular/forms';
import {HttpService} from '../../services/http-service.service';
import swal from 'sweetalert2';
import {UtilityService} from '../../services/utility.service';
import {Router} from '@angular/router';

declare var $;

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  // public start_time = [new Date(), new Date()];
  public start_time = [new Date(), new Date()];

  p: number = 1;
  games: any = [];
  logindata: any;
  userdata: any = {};
  timesheet: any = [];
  dropdownSettings = {};
  dropdownList = [];
  values = [];
  datum = [];
  datas: any;
  selectedItems = [];
  client_id: any;
  net_rate: any;
  // start_time: any;
  start_time1: any;
  end_time: any;
  end_time1: any;
  incidant: any;
  shift_notes: any;
  client: any;
  Availability: any;
  a_24h: any;
  weekdays: any;
  weekend: any;
  profile_type: any;
  timesheet_data: any;

  // delivery_date: any;

  constructor(private http: HttpService, private utility: UtilityService, private router: Router) {

  }

  ngOnInit() {
    this.profile_type = localStorage.getItem('type');
    this.logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');
    this.userdata = this.utility.decryptData(JSON.parse(localStorage.getItem('userdata')), 'userdata');
    this.getTimeSheetDetails();
    this.getClientId();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'first_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 100,
      enableCheckAll: false,
      limitSelection: 1,
      allowSearchFilter: true,
    };
  }

  getTimeSheetDetails() {
    if (this.userdata.profile_type === 'CAREWORKER') {
      const filter = JSON.stringify({'where': {'user_id': this.logindata.userId}});
      var Url = environment.apiUrl + '/timesheets?filter=' + encodeURIComponent(filter) + '&access_token=' + this.logindata.id;
    } else if (this.userdata.profile_type === 'CLIENT') {
      const filter = JSON.stringify({'where': {'client_id': this.logindata.userId}});
      var Url = environment.apiUrl + '/timesheets?filter=' + encodeURIComponent(filter) + '&access_token=' + this.logindata.id;
    }
    this.http.httGet(Url).subscribe(
      data => {
        this.timesheet = data;
        console.log(this.timesheet);
        // console.log(this.timesheet);
      }, error => console.error(error));
  }

  getClientId() {
    const Url = environment.apiUrl + '/connections?filter=%7B%22where%22%3A%7B%22cw_id%22%3A%22' + this.logindata.userId + '%22%7D%7D&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.dropdownList = data;
        this.getClientDetails(this.dropdownList);
      }, error => console.error(error));
  }

  getClientDetails(datum) {
    const Url = environment.apiUrl + '/basic_infos?access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.datum = data;
        //  console.log(this.user_datum);
        //  console.log(user_datum);
        for (let dropdownvalue of datum) {
          for (let list of this.datum) {
            if (dropdownvalue.client_id == list.id) {
              this.values.push(list);
            }
          }
        }
        this.datas = this.values;
        //  console.log(this.datas);
      }, error => console.log(error)
    );
  }

  onItemSelect(item: any) {
    // alert(JSON.stringify(item));
    this.client_id = item.id;
    this.getAvailability(item.id);
  }

  getAvailability(id) {
    console.log(id);
    const condition = JSON.stringify({'where': {'user_id': id}});
    this.http.httpGetAuth(environment.apiUrl + '/cw_availabilities?filter=' + encodeURIComponent(condition) + '&access_token=' + this.logindata.id).subscribe(data => {
      if (data) {
        this.Availability = data[0];
        console.log(this.Availability);
        if (this.Availability.avail_24hour_rate !== 0 && this.Availability.avail_24hour_rate !== undefined) {
          this.a_24h = this.Availability.avail_24hour_rate;
        }

        if (this.Availability.avail_weekday_hourly_rate !== 0 && this.Availability.avail_weekday_hourly_rate !== undefined) {
          this.weekdays = this.Availability.avail_weekday_hourly_rate;
        }

        if (this.Availability.avail_weekend_hourly_rate !== 0 && this.Availability.avail_weekend_hourly_rate !== undefined) {
          this.weekend = this.Availability.avail_weekend_hourly_rate;
        }
      }
    });
  }

  onItemDeSelect(item: any) {
  }

  postSessionData(form) {
    const Url = environment.apiUrl + '/timesheets?access_token=' + this.logindata.id;
    /*let s_time = new Date(this.start_time + ' ' + this.start_time1);
    let e_time = new Date(this.end_time + ' ' + this.end_time1);*/
    const param = {
      'client_id': this.client_id,
      'start_time': this.start_time[0],
      'end_time': this.start_time[1],
      'incidant': this.incidant,
      'net_rate': this.net_rate,
      'user_id': this.logindata.userId
    };
    this.http.httpPost(param, Url).subscribe(
      data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Session added successfully! ',
            text: '',
            showConfirmButton: true,
            timer: 2000
          });
          this.net_rate = '';
        }
      }, error => console.log('error to update the availability value', error)
    );
    const Url1 = environment.apiUrl + '/shift_notes?access_token=' + this.logindata.id;
    const parameter = {
      'client_id': this.client_id,
      'delivery_date': this.start_time[1],
      'shift_notes': this.shift_notes,
      'user_id': this.logindata.userId
    };
    this.http.httpPost(parameter, Url1).subscribe(
      data => {
        if (data) {
          console.log('shift added');
        }
      }, error => console.log('error to add shift notes')
    );
    this.getTimeSheetDetails();
    form.reset();
  }

  timesheetData(i) {
    this.timesheet_data = this.timesheet[i];
    console.log(this.timesheet_data);
  }

  redirect() {
    $('#work').modal('hide');
    $('.modal-backdrop').remove();
    this.router.navigate(['billing'], {queryParams: {}});

  }
}
