import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http-service.service';
import {environment} from '../../../environments/environment';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import {UtilityService} from '../../services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  email: any = '';
  password: any = '';
  credentials: any = {};
  encryptedData: any;
  spinner = false;
  keepme = false;

  constructor(private http: HttpService, private router: Router, private utility: UtilityService) {
    if ( localStorage.getItem('login_data') != null ) {
      this.router.navigate(['dashboard']);

    }
  }

  ngOnInit() {

    if (localStorage.getItem('keep') !=  null) {
      this.keepme = true;
      const keep = this.utility.decryptData(JSON.parse(localStorage.getItem('keep')), 'keep');
      this.email = keep.email;
      this.password = keep.password;
    }
  }

  login(form) {
    this.spinner = true;
    this.credentials = {
      'email': this.email,
      'password': this.password
    };
    if (this.keepme === true) {
      localStorage.setItem('keep', JSON.stringify(this.utility.encryptData(this.credentials, 'keep')));
      // const keep = this.decryptData(JSON.parse(localStorage.getItem('keep')), 'keep');
      // console.log(keep);
    }

    if ( this.keepme === false) {
      localStorage.removeItem('keep');
    }

    this.http.httpPost(this.credentials, environment.apiUrl + '/basic_infos/login').subscribe((data: any) => {
      this.email = '';
      this.password = '';
      this.encryptedData = this.utility.encryptData(data,  'login_data');
        localStorage.setItem('login_data', JSON.stringify(this.encryptedData));
        this.router.navigate(['dashboard']);
        this.spinner = false;
        swal({
          type: 'success',
          title: 'Hello ' + data.value.first_name + ' ' + data.value.last_name,
          text: '',
          showConfirmButton: false,
          timer: 2000
        });
        this.router.navigate(['dashboard']);
      }, error => {
      this.spinner = false;
        swal({
          type: 'error',
          title: 'Invalid username or password',
          text: '',
          showConfirmButton: true,
          timer: 2000
        });
      },
    );
  }

/*// Todo: move this file into helper class
  encryptData(data, key) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    } catch (e) {
      console.error(e);
    }
  }

  decryptData(data, key) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, key);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.error(e);
    }
  }*/
}

