import { Injectable } from '@angular/core';
import {Observable, Subject, BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  private clientid = new BehaviorSubject('CLIENT');
  private jobid = new BehaviorSubject('');
  private agreement = new BehaviorSubject('');
  client_id = this.clientid.asObservable();
  job_id = this.jobid.asObservable();
  agreement_id = this.agreement.asObservable();

  constructor() { }

  getJobdata(message: string, msg: string) {
    this.clientid.next(message);
    this.jobid.next(msg);
    console.log('Agreement service was called');
  }

  agreementData(agreement: any) {
    this.agreement.next(agreement);
  }
}
