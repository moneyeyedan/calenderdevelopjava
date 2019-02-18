import {Component, OnInit} from '@angular/core';
import {UtilityService} from '../../services/utility.service';
import {environment} from '../../../environments/environment';
import {HttpService} from '../../services/http-service.service';
import {TSMap} from 'typescript-map';

@Component({
  selector: 'app-myclients',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.css']
})
export class ConnectionComponent implements OnInit {
  logindata: any;
  connections: any = [];
  clients: TSMap<any, any> = new TSMap<any, any>();
  careworkers: TSMap<any, any> = new TSMap<any, any>();

  constructor(private utility: UtilityService, private http: HttpService) {
    this.logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');

  }

  ngOnInit() {
    this.getConnectionData();
  }

  getConnectionData() {
    if (this.logindata.value.profile_type === 'CLIENT') {
      var filter = JSON.stringify({'where': {'client_id': this.logindata.userId}});
    } else {
      var filter = JSON.stringify({'where': {'cw_id': this.logindata.userId}});
    }
    const Url = environment.apiUrl + '/connections?filter=' + encodeURIComponent(filter) + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.connections = data;
        console.log('connections', this.connections);
        if (this.logindata.value.profile_type === 'CLIENT') {
          for (const careworker of this.connections) {
            this.getCareWorkerData(careworker.cw_id);
          }
        } else {
          for (const client of this.connections) {
            this.getClientData(client.client_id);
          }
        }
      });
  }

  getCareWorkerData(id) {
    const Url = environment.apiUrl + '/basic_infos/' + id + '?access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.careworkers.set(data.id, data);

        console.log(this.careworkers);
      }, error => {
        console.error(error);
      });
  }

  getClientData(id) {
    const Url = environment.apiUrl + '/basic_infos/' + id + '?access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        this.clients.set(data.id, data);
        console.log(this.clients);
      }, error => {
        console.error(error);
      });
  }

}
