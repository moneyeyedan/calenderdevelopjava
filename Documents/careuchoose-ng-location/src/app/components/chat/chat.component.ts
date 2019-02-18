import {Component, OnInit} from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {environment} from '../../../environments/environment';
import {ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';
import {HttpService} from '../../services/http-service.service';
import {ViewEncapsulation} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import io from 'socket.io-client';
import swal from 'sweetalert2';
import _ from 'lodash';
import {ActivatedRoute, Router} from '@angular/router';
import {AgreementService} from '../../services/agreement.service';
import {UtilityService} from '../../services/utility.service';

declare var $;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ChatComponent implements OnInit {
  logindata: any;
  packet: any;
  txtmessage: any;
  conversation: any;
  services: any = [];
  localuser: any;
  chatlist: any = {};
  jobdata: any;
  clientdata: any;
  spinner = false;
  jobdetails: any;
  agreementid: any;
  agreement: any;
  agreement_status: boolean;
  agreement_info: any;
  ischatlistempty: boolean = true;
  ischatempty: boolean = true;
  activeroomid: any;
  chatdata: any;

  constructor(private http: HttpService, private Agreementservice: AgreementService, private chat: ChatService, private activateroute: ActivatedRoute, private router: Router, private utility: UtilityService) {
    this.logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');
  }

  ngOnInit() {
    const socket = io(environment.ws_url);
    this.logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');
    this.chat.messages.subscribe(message => {
        var roomid = '#chat-body-'+ message.packet.room_id;
        var time = message.packet.senton;
        time = new Date(time * 1000).toTimeString().split(" ")[0];
      if(message.packet.sender_id == this.logindata.userId) {
        $(roomid).append('<div class=\'message my-message\'> <img  class=\'img-circle medium-image\' src=\'https://bootdey.com/img/Content/avatar/avatar1.png\'><div class=\'message-body\'><div class=\'message-text\'>' + message.packet.body + '</div><div class="msgsenton">'+ time +'</div></div> <br></div>');
        }
        else {
        $(roomid).append('<div class=\'message info\'> <img  class=\'img-circle medium-image\' src=\'https://bootdey.com/img/Content/avatar/avatar1.png\'><div class=\'message-body\'><div class=\'message-text\'>' + message.packet.body + '</div><div class="msgsenton">'+ time +'</div></div> <br></div>');
        }
        var elem = document.getElementById('chat-body-'+message.packet.room_id);
        elem.scrollTop = elem.scrollHeight;
    });

    // get the chatlist of this owner
    this.getchatlist(this.logindata.userId);

    this.clientdata = this.utility.decryptData(this.activateroute.snapshot.queryParams['client_data'], 'clientdata');
    this.jobdata = this.utility.decryptData(this.activateroute.snapshot.queryParams['job_data'], 'jobdata');
    this.agreement = this.utility.decryptData(this.activateroute.snapshot.queryParams['agreement'], 'agreement');
    this.sendDataToAgreement();
    this.getJobDetails();
  }

  sendmessage(form) {
    this.activeroomid = $(".contacts-list ul li.active").attr('id');
    const jobid = this.activeroomid.split("-")[0];
    if(this.logindata.value.profile_type === 'CLIENT') {
      var sender = this.activeroomid.split("-")[2];
      var recipient = this.activeroomid.split("-")[1];
    }
    else {
      var sender = this.activeroomid.split("-")[1];
      var recipient = this.activeroomid.split("-")[2];
    }
    this.packet = {
      'job_id': jobid,
      'room_id': this.activeroomid,
      'sender_id': sender,
      'sender_name': this.utility.decryptData(JSON.parse(localStorage.getItem('userdata')), 'userdata')['first_name'],
      'recipient_id': recipient,
      'body': this.txtmessage,
    };
    this.chat.sendmsg(this.packet);
    this.txtmessage = '';
  }

  getchatlist(userid) {
    this.spinner = true;
    const url = environment.apiUrl + '/chatlist/' + userid;
    this.http.httGet(url).subscribe(
      data => {
        this.spinner = false;
        this.chatlist = data;
        if(Object.keys(this.chatlist).length > 0)
          this.ischatlistempty = false;
          return data;
      }, error => console.error('error in getting chat list')
    );
  }

  // Get the conversation on click of chatlist
  getchatconversation(roomid, chatdata) {
    // clear the old data if  requested again and make new call
    // Sync the delta data between server and client
    //$('#inbox-message-'+ roomid).empty();
    this.chatdata = chatdata;
    this.ischatempty = false;
    this.conversation = null;
    this.spinner = true;
    const filter = JSON.stringify({'where': {and: [{'room_id': roomid},{'body': {'neq': 'NULL'}}]}});
    const Url = environment.apiUrl + '/messages?filter=' + encodeURIComponent(filter) + '&access_token=' + this.logindata.id;
    this.http.httGet(Url).subscribe(
      data => {
        var logindata = this.utility.decryptData(JSON.parse(localStorage.getItem('login_data')), 'login_data');
        this.spinner = false;
        this.conversation = data;
        var chatroomid = '#inbox-message-'+ roomid +' .chat-body';
        if(Object.keys(this.conversation).length > 0)
          this.ischatempty = false;
        this.conversation.forEach(function (value) {
          var time = value.time;
          time = new Date(time * 1000).toTimeString().split(" ")[0];
          if (value.sender == logindata.userId) {
            $(chatroomid).append('<div class=\'message my-message\'> <img  class=\'img-circle medium-image\' src=\'https://bootdey.com/img/Content/avatar/avatar1.png\'><div class=\'message-body\'><div class=\'message-text\'>' + value.body + '</div><div class="msgsenton">'+ time +'</div></div> <br></div>');
          }
          else {
            $(chatroomid).append('<div class=\'message info\'> <img  class=\'img-circle medium-image\' src=\'https://bootdey.com/img/Content/avatar/avatar1.png\'><div class=\'message-body\'><div class=\'message-text\'>' + value.body + '</div><div class="msgsenton text-white">'+ time +'</div></div> <br></div>');
          }
        });
      }, error => console.error('error while getting chat conversation')
    );
    var elem = document.getElementById('chat-body-'+ roomid);
    elem.scrollTop = elem.scrollHeight;
  }

  getJobDetails() {
    if ( this.jobdata ) {
      const Url = environment.apiUrl + '/services/' + this.jobdata.id + '?access_token=' + this.logindata.id;
      this.http.httGet(Url).subscribe(
        data => {
          this.jobdetails = data;
          const filter = JSON.stringify({'where': {'user_id': this.logindata.value.id} });
          const Url = environment.apiUrl + '/agreements?filter=' + encodeURIComponent(filter) + '&access_token=' + this.logindata.id;
          this.http.httpGetAuth(Url).subscribe( aginfo => {
            for (let agreements of aginfo) {
              if (agreements.service_id === this.jobdetails.id) {
                this.agreement_status =  true;
                this.agreement_info = agreements;
              }
            }
          }, error => console.log(error));
        }, error => {
          console.log(error);
        });
    }
  }

  sendDataToAgreement() {
    const clientdata = this.utility.decryptData(this.activateroute.snapshot.queryParams['client_data'] , 'clientdata');
    this.Agreementservice.getJobdata(clientdata, this.jobdata);
    this.Agreementservice.agreementData('');
    // window.reload();
  }

  editDataToAgreement() {
    this.agreement_info['user_data'] = this.clientdata;
    this.agreement_info['job_data'] = this.jobdata;
    this.Agreementservice.agreementData(this.agreement_info);
    this.Agreementservice.getJobdata('', '');
  }

  viewAgreement(agreementid) {
    const filter = JSON.stringify({"where": {"user_id": this.logindata.userId} });
    const Url = environment.apiUrl + '/agreements/' + agreementid +  '?filter=' + encodeURIComponent(filter) + '&access_token=' + this.logindata.id;
    this.http.httpGetAuth(Url).subscribe( data => {
      this.agreement = data;

    }, error => console.log(error));

  }

  sendAccept(agreement) {
    const Url = environment.apiUrl + '/agreements/' + agreement.id + '?access_token=' + this.logindata.id;
    const param = {
      'working_day': agreement.working_day,
      'proposed_amount': agreement.proposed_amount,
      'working_hrs_scheme': agreement.working_hrs_scheme,
      'agreed_services': agreement.agreed_services,
      'status': 'accept',
      'client_id': agreement.client_id,
      'user_id': agreement.user_id,
      'service_id': agreement.service_id
    };
    this.http.httpPutAuth(param, Url).subscribe(
      data => {
        if (data) {
          swal({
            type: 'success',
            title: 'Accepted',
            text: '',
            showConfirmButton: true,
            timer: 2000
          });
          this.saveAgreement(agreement);
        }
      });
  }

  saveAgreement(agreement) {
    const  Url = environment.apiUrl + '/connections?access_token=' + this.logindata.id;
    const param = {
      'client_id': agreement.client_id,
      'cw_id': agreement.user_id
    };
    this.http.httpPost(param, Url).subscribe(
      data => {
        if (data) {
          console.log('connention Added !');
        }
      }, error => console.log(error)
    );
  }

}
