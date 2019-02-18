import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '../../services/http-service.service';
import { Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';
import swal from 'sweetalert2';

declare var $;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {
  numberOnlyError:any;
  gender:any;
  firstName: any = '';
  lastName: any = '';
  Password: any = '';
  email: any = '';
  postcode: any = '';
  contactNo: any = '';
  username: any = '';
  found_us: any = '';
  caretype: any = '';
  recivesupport: boolean;
  workhours: any = '';
  primaryfunding: any = '';
  experience: any = '';
  existingclient: any = '';
  contribution_hours: any = '';
  error: any;
  endpoint: any;
  radioValue: any = 'CLIENT';
  status: boolean;
  mail_error = false;
  spinner = false;
  message: string;
  // workers: boolean;

  constructor(private http: HttpService, private router: Router, private activateroute: ActivatedRoute) {
    this.endpoint = environment.apiUrl;
    this.radioValue = this.activateroute.snapshot.queryParams['id'];
    if ( localStorage.getItem('login_data') != null ) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit() {
    this.onItemChange(this.radioValue);
    $(document).ready(function(){

      $('#amount').bind('keyup keydown', function() {
        var amount = parseFloat($(this).val());
        if (amount) {
          if (amount < 800 || amount > 9999) {
            $('span.paymentalert').html('Your Postcode must be between 0800 and 9999');
          } else {
            $('span.paymentalert').html('');
          }
        }
      });

    });
  }
  radioevent(event: any) {
    this.gender = event.target.value;
  }

// Used to store the user signup details
  register(form) {
    this.spinner = true;
    const url = environment.apiUrl + '/basic_infos';
    const param = {
      'profile_type': this.radioValue,
      'first_name': this.firstName,
      'last_name': this.lastName,
      'postcode': this.postcode,
      'contact_number': this.contactNo,
      'username': new Date().getTime,
      'password': this.Password,
      'email': this.email,
      'how_you_found_us': this.found_us,
      'c_care_type': this.caretype,
      'gender': this.gender,
      'c_currently_receiving_support': this.recivesupport,
      'c_working_hours': this.workhours,
      'c_primary_funding_method': this.primaryfunding,
      'cw_supportwork_exp': this.experience,
      'cw_migrating_existing_clients': this.existingclient,
      'cw_work_contrib_hours': this.contribution_hours,
    };
    // localStorage.setItem('basic_info', JSON.stringify(this.param) );
    this.http.httpPost(param, url).subscribe(
      data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Success',
            text: 'Registered Sucessfully. Verify your email to activate the account!',
            showConfirmButton: false,
            timer: 2000
          });
          this.email = '';
          this.Password = '';
          this.username = '';
          this.mail_error = false;
          this.router.navigate(['/login']);
          this.spinner = false;
        } else {
          this.email = '';
          this.Password = '';
          this.username = '';
          this.mail_error = false;
          this.spinner = false;
        }
      }, error => {
        // const error1 = JSON.parse(JSON.stringify(error._body));
        if (error.status == 422) {
          this.mail_error = true;
        }
        this.error = 'problem in sign up ';
        this.spinner = false;
      });

  }

  onItemChange(item) {
    this.radioValue = (item === 'CAREWORKER') ? 'CAREWORKER' : 'CLIENT';
    this.status = (item === 'CAREWORKER') ? true : false;
  }
// Finding value contains number only or not
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.numberOnlyError = 'Numerics only';

      return false;

    }
    this.numberOnlyError = '';
    return true;

  }
  /*confirmPassword() {
   if (this.registerPassword !== this.cofPassword) {
   this.passwordMatch = true;
   } else {
   this.passwordMatch = false;
   }
   }*/
}
