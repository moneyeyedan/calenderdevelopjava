import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'; 
import { HttpService } from '../http.service'
@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent implements OnInit {
  Admin_Register = new FormGroup ({
    email: new FormControl(),
    password: new FormControl(),

  });
  constructor(private httpService:HttpService) { }

  ngOnInit() {
  }

  Register_Admin(){
    console.log(this.Admin_Register.value)

    this.httpService.httPost(this.Admin_Register.value,'http://192.168.0.127:1337/admin/signup').subscribe(res=>{
      if(res.status){
        alert(res.msg)
      }
    })
  }

}
