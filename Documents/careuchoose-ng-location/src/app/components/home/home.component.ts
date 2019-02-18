import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http-service.service';
import {Router, ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message: string;
  budget: any;
  clienttotal: any = 0;
  cwtotal: any = 0;
  // careuchoose fee on careworkers in %
  cwfee: any = 9;
  // careuchoose fee on clients in %
  clientfee: any = 4;
  total: any = 0;
  careWorkerjobs:any = [];
  jobs:any;
  jobdet:any;
  url:any=environment.apiUrl;
  navigatejob:any=[]

  constructor(private http: HttpService, private router: Router, private activaterouter: ActivatedRoute) {
    if (localStorage.getItem('login_data') != null) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit() {
    this.getjob();

  }

  calculatebadget() {
    if(this.budget > 0) {
      this.total = (parseFloat(this.budget) * parseFloat(this.clientfee) / 100) + (parseFloat(this.budget) * parseFloat(this.cwfee) / 100);
      this.clienttotal = parseFloat(this.budget) + (parseFloat(this.budget) * parseFloat(this.clientfee) / 100);
      this.cwtotal = parseFloat(this.budget) - (parseFloat(this.budget) * parseFloat(this.cwfee) / 100);
    }
    else {
      this.total = 0;
      this.clienttotal = 0;
      this.cwtotal = 0;
    }
  }

  newMessage(item) {
    this.router.navigate(['signup'], {queryParams: {id: item}});
  }
  getjob(){
    // this.careWorkerjobs=[];
    this.http.httGet(this.url+'/services').subscribe(res=>{
      //console.log(res.job_reference);
      this.careWorkerjobs=res;
      console.log(this.careWorkerjobs);

      // for(let work of res){
      //   let searchjob = this.job.toLowerCase();
      //   let defaultjob = work.job_reference.toLowerCase();
      //   if(searchjob==defaultjob){
      //     console.log(defaultjob,searchjob);
      //     this.careWorkerjobs.push(work);
      //     console.log(this.careWorkerjobs);
      //   }
        
      // }
    },error => {
      console.log(error);
    });

  }
  findjob(value){
    for(let job of this.careWorkerjobs){
      if(job.id==value){
        this.navigatejob=job;
        console.log(job);
      }
    }

  }
}
