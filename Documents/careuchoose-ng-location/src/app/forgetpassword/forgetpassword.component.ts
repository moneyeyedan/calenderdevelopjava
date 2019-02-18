import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {
email:any;
password:any;
repassword:any;
  constructor() { }

  ngOnInit() {
  }
  forgetpassword(){
    var param = {
      email:this.email,
      password:this.password,
      repassword:this.repassword
    }
    console.log(param);
  }
}
