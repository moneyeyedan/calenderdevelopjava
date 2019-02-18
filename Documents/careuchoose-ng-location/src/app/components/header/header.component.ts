import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http-service.service';
import {environment} from '../../../environments/environment';
import {Router} from '@angular/router';
import {UtilityService} from '../../services/utility.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  data: any;
  datum: any = {};
  decryptedData: any;
  profiletype: any = '';


  constructor(private http: HttpService, private router: Router, private utility: UtilityService) {
    if (localStorage.getItem('login_data') === 'undefined' || localStorage.getItem('login_data') === null) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.data = JSON.parse(localStorage.getItem('login_data'));
    this.decryptedData = this.utility.decryptData(this.data, 'login_data');
    this.getdata();

  }

  getdata() {
    this.http.httGet(environment.apiUrl + '/basic_infos/' + this.decryptedData.userId + '?access_token=' + this.decryptedData.id).subscribe(
      data => {
        this.datum = data;
        this.profiletype = this.datum.profile_type;
        localStorage.setItem('type', this.profiletype);
        const userdata = this.utility.encryptData(this.datum, 'userdata');
        localStorage.setItem('userdata', JSON.stringify(userdata));
      }, error => {
        console.log('Error in getdata ');
      });
  }

/*
// Todo: move this file into helper class
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
  }

  // Todo: move this file into helper class
  encryptData(data, key) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    } catch (e) {
      console.log(e);
    }
  }
*/

  logout() {
    this.data = null;
    const Url = environment.apiUrl + '/basic_infos/logout?access_token=' + this.decryptedData.id;
    this.http.httpPost(null , Url).subscribe(
      data => {
        console.log('logout successfully !!!');
      });
    localStorage.removeItem('login_data');
    localStorage.removeItem('userdata');
    this.router.navigate(['/login']);

  }
}
