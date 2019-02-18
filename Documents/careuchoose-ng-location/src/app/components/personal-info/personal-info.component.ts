import { Component, OnInit } from '@angular/core';
import {UtilityService} from '../../services/utility.service';
import {environment} from '../../../environments/environment';
import {HttpService} from '../../services/http-service.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})

export class PersonalInfoComponent implements OnInit {
  progress: any = 60;
  logindata: any;
  service: any;
  isreligian: boolean;
  connection: any;
  description: any;
  url: any;
  constructor(private  utility: UtilityService, private http: HttpService) {
    this.progress = localStorage.getItem('progress');
  }

  ngOnInit() {
    this.logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');
    this.getConnectionDetails();
    // this.progress = localStorage.getItem('progress');
  }

  getConnectionDetails() {
    this.description = this.logindata.value.description;
    // this.url = this.logindata.value.profile_image_url;
    if (this.logindata.value.profile_type === 'CLIENT') {
      var filter = JSON.stringify({'where': {'client_id': this.logindata.userId} });
    } else {
      var filter = JSON.stringify({'where': {'cw_id': this.logindata.userId} });
    }
    const Url = environment.apiUrl + '/connections?filter=' + encodeURIComponent(filter) + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        if (data) {
        this.connection = data.length;
        }
      }, error => console.log(error)
    );
  }

  readUrl(event: any) {
  //  this.spinner = true;
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('image', file);
      let Url = environment.apiUrl + '/containers/careuchoose-media/upload?access_token=' + this.logindata.id;
      this.http.httpPost(formData, Url).subscribe(
        data => {
          console.log(data);
          swal({
            title: 'Data Added',
            text: 'Image Added !',
            confirmButtonText: 'Ok',

          });
        //  this.spinner = false;
        }, error => {
          swal({
            title: 'ERROR',
            text: 'Error to update the image !!!',
            confirmButtonText: 'Ok'
          });
          console.log(error);
         // this.spinner = false;
        },
      );
      var reader = new FileReader();

      reader.onload = (e: ProgressEvent) => {
        this.url = (<FileReader>e.target).result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  saveDescription(form) {
    const Url = environment.apiUrl + '/basic_infos/' + this.logindata.userId + '?access_token=' + this.logindata.id;
    const param = {
      'description': this.description,
      'profile_image_url': this.url,
    };
    this.http.httpPatch(param, Url).subscribe(
      data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Data saved successfully' ,
            text: '',
            showConfirmButton: false,
            timer: 2000
          });
        }
      }, error => {
        console.log('error to update data');
      });
  }
}
