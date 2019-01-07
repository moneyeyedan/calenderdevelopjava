import { Injectable } from '@angular/core';
import 'rxjs/Rx';
import {Headers, Http, Request, RequestMethod, RequestOptions} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http:Http) { }
  httGet(url: string) {
    return this._http.get(url)
      .map(res => res.json());
  }

  httDelete(url: string) {
    return this._http.delete(url)
      .map(res => res.json());
  }

  httPost(param: any, url: string) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let requestOptions = new RequestOptions({
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
    headers.append('Authorization', localStorage.getItem(''));
    let options = new RequestOptions({headers: headers});

    return this._http.get(url, {headers: headers})
      .map(res => res.json());
  }

  httpPostAuth(param: any, url: string) {
    let headers = new Headers();
    headers.append('Authorization', localStorage.getItem(''));

    let requestOptions = new RequestOptions({
      method: RequestMethod.Post,
      url: url,
      headers: headers,
      body: param
    });

    return this._http.request(new Request(requestOptions))
      .map(res => res.json());
  }
}
