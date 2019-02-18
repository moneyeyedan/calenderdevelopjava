import {Observable, Subject, BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Headers, Http, Request, RequestMethod, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class HttpService {

  header: string = '';

  constructor(private _http: Http) {
  }

  httGet(url: string) {
    return this._http.get(url)
      .map(res => res.json());
  }

  httDelete(url: string) {
    return this._http.delete(url)
      .map(res => res.json());
  }

  httpPost(param: any, url: string) {
    var headers = new Headers({
      'Content-Type': 'application/json'
    });
    var requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: param
    });

    return this._http.request(new Request(requestOptions))
      .map(res => res.json());
  }

  httpGetAuth(url: string) {
    let headers = new Headers();
    headers.append('Authorization', this.header.concat(localStorage.getItem('token')));
    let options = new RequestOptions({headers: headers});

    return this._http.get(url, {headers: headers})
      .map(res => res.json());
  }

  httpGetAuthWithoutJson(url: string) {
    let headers = new Headers();
    headers.append('Authorization', this.header.concat(localStorage.getItem('token')));
    let options = new RequestOptions({headers: headers});

    return this._http.get(url, {headers: headers})
      .map(res => res);
  }

  httpPostAuth(param: any, url: string) {
    const data = JSON.parse(localStorage.getItem('login_data'));
    const loginData = this.decryptData(data, 'login_data');
    const headers = new Headers();
    headers.append('Authorization', this.header.concat(loginData.id));
    const requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: param
    });

    return this._http.request(new Request(requestOptions))
      .map(res => res.json());
  }

  httpPutAuth(param: any, url: string) {
    let headers = new Headers();
    headers.append('Authorization', this.header.concat(localStorage.getItem('token')));
    var requestOptions = new RequestOptions({
      method: RequestMethod.Put,
      url: url,
      headers: headers,
      body: param
    });

    return this._http.request(new Request(requestOptions))
      .map(res => res.json());
  }

  httpPatch(param: any, url: string) {
    let headers = new Headers();
    headers.append('Authorization', this.header.concat(localStorage.getItem('token')));
    var requestOptions = new RequestOptions({
      method: RequestMethod.Patch,
      url: url,
      headers: headers,
      body: param
    });

    return this._http.request(new Request(requestOptions))
      .map(res => res.json());
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
  }
}
