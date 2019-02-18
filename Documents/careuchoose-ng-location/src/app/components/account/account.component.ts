import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http-service.service';
import {environment} from '../../../environments/environment';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
import {UtilityService} from '../../services/utility.service';

declare var $;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  emergencycontacts: any;
  State: any;
  relationship: any;
  emergencyname: any;
  emergencyphone: any;
  emergencyrelationship: any;
  isreligian: boolean;
  loginData: any;
  firstname: any;
  lastname: any;
  postcode: any;
  contactnumber: any;
  email: any = '';
  sms_alert: any = '';
  password: any = '';
  address: any = '';
  suburb: any = '';
  confirmpassword: any = '';
  primaryfunding: any = '';
  experience: any = '';
  existingclient: any = '';
  dob: any = '';
  emergencystate: boolean;

  constructor(private http: HttpService, private router: Router, private utility: UtilityService) {
  }

  ngOnInit() {
    const data = JSON.parse(localStorage.getItem('login_data'));
    this.loginData = this.utility.decryptData(data, 'login_data');
    if (this.loginData) {
      this.firstname = this.loginData.value.first_name;
      this.lastname = this.loginData.value.last_name;
      this.postcode = this.loginData.value.postcode;
      this.contactnumber = this.loginData.value.contact_number;
    }
    this.getEmergencyContact();
    this.getmasterAccount();
    this.getmasterAccountrelationship();
  }

  public handleAddressChange(address: any) {
    this.address = address.formatted_address;

  }
  getmasterAccount() {
    const condition = JSON.stringify({'where': {'category': 'state'}});
    const Url = environment.apiUrl + '/master_account_details?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id;
    this.http.httpGetAuth(Url).subscribe(data => {
      if (data.length > 0) {
        this.State = data;
        this.isreligian = true;
      } else {
        this.isreligian = false;
      }
    });
  }

  getmasterAccountrelationship() {
    const condition = JSON.stringify({'where': {'category': 'relationship'}});
    const Url = environment.apiUrl + '/master_account_details?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id;
    this.http.httpGetAuth(Url).subscribe(data => {
      if (data.length > 0) {
        this.relationship = data;
        this.isreligian = true;
      } else {
        this.isreligian = false;
      }
    });
  }


  postEmergencyContact(form) {
    const Url = environment.apiUrl + '/emergency_contacts?access_token' + this.loginData.id;
    this.emergencycontacts = {
      'name': this.emergencyname,
      'contact_number': this.emergencyphone,
      'relationship': this.emergencyrelationship,
      'user_id': this.loginData.userId
    };
    this.http.httpPost(this.emergencycontacts, Url).subscribe((data: any) => {
      if (data) {
        swal({
          type: 'success',
          title: 'Created',
          text: '',
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }

  editEmergencyContact(form) {
    const filter = JSON.stringify({'where': {'id': this.emergencycontacts.id}});
    const Url = environment.apiUrl + '/emergency_contacts/' + encodeURIComponent(filter) + '?access_token=' + this.loginData.id;
    this.emergencycontacts = {
      'name': this.emergencyname,
      'contact_number': this.emergencyphone,
      'relationship': this.emergencyrelationship,
      'user_id': this.loginData.userId
    };
    this.http.httpPutAuth(this.emergencycontacts, Url).subscribe(
      data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Updated',
            text: '',
            showConfirmButton: false,
            timer: 2000
          });
        }
        this.getEmergencyContact();
      });
  }

  getEmergencyContact() {
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    const Url = environment.apiUrl + '/emergency_contacts?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id;
    this.http.httpGetAuth(Url).subscribe(
      data => {
        if (data) {
          this.emergencystate = true;
          this.emergencycontacts = data[0];
          this.emergencyname = this.emergencycontacts.name;
          this.emergencyphone = this.emergencycontacts.contact_number;
          this.emergencyrelationship = this.emergencycontacts.relationship;
        } else {
          console.log('No data in emergency contacts');
        }
      }, error => console.log('error to get emergency contacts'));
  }

  postAccountDetails() {
    const filter = JSON.stringify({'where': {'id': this.loginData.userId}});
    const Url = environment.apiUrl + '/basic_infos/' + this.loginData.userId + '?access_token=' + this.loginData.id;
    const params = {
      'first_name': this.firstname,
      'last_name': this.lastname,
      'dob': this.dob,
      'email': this.email,
      'password': this.password
    };
    this.http.httpPatch(params, Url).subscribe(
      data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Updated',
            text: '',
            showConfirmButton: false,
            timer: 2000
          });
        }
      }, error => console.log(error));
  }

}
