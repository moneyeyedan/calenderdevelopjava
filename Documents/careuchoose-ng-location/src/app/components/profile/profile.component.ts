import {Component, OnInit} from '@angular/core';
import {HttpService} from '../../services/http-service.service';
import {environment} from '../../../environments/environment';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
import {UtilityService} from '../../services/utility.service';
import {ViewChild, ViewContainerRef, ComponentFactoryResolver} from '@angular/core';

declare var $;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  // What to clone
  @ViewChild('clone') template;

  // Where to insert the cloned content
  @ViewChild('container', {read: ViewContainerRef}) container;
  public course_start_date = [new Date(), new Date()];
  public job_start_date = [new Date(), new Date()];
  address: any = '';
  numberOnlyError:any;
  socialneeds: any;
  educationDate: any;
  profiletype: any = '';
  Availability: any = {};
  ssad_typecare: any = [];
  prs_typecare: any = [];
  nurs_typecare: any = [];
  allied_typecare: any = [];
  workHistory: any = {};
  educationHistory: any = {};
  badge: any = {};
  backgrounds: any = {};
  verification: any = {};
  encryptSecretKey = 'availability_data';
  loginData: any;
  isAvailable: boolean;
  isAvails: boolean;
  iseducationHistory: boolean;
  isworkHistory: boolean;
  ssda: boolean;
  ssadvalues: string = '';
  Religion: any = [];
  Interest: any = [];
  cb_western_european: any = [];
  Languages: any = [];
  secLanguages: any = [];
  cultural_background: any = [];
  State: any;
  relationship: any;
  personal_care: boolean;
  personal_value: any = [];
  nursing_services: boolean;
  nursing_value: any = [];
  allied_health_service: boolean;
  allied_health_value: any = [];
  pw_no_preferences: boolean;
  pw_no_pets: boolean;
  pw_male_only: boolean;
  pw_female_only: boolean;
  pw_non_smoker: boolean;
  lgbti: boolean;
  data: any;
  cb_middle_eastern: any = [];
  url: any;
  cb_southern: any = [];
  cw_personality: any;
  ssad_value: any = [];
  religion: any = [];
  Asian: any = [];
  hobbies: any = [];
  firstLan: any = [];
  secondLan: any = [];
  culturalBac: any = [];
  religionvalues: string;
  cb_asiannvalues: string;
  interstvalues: string = '';
  so_status: any = [];
  isTcAvailable: boolean;
  isBadges: boolean;
  isreligian: boolean;
  back: boolean;
  isverification: boolean;
  tct: any = [];
  hobbies1: string = '';
  firstlanguage: string = '';
  secondlanguage: string = '';
  cultural: string = '';
  western: boolean;
  cb_asian: any = [];
  course_degree: any;
  course_institution: any;
  asian: boolean;
  Southern: boolean;
  middleeastern: boolean;
  id: any;
  dateerror: any = 'End date should be greater than Start date';
  error: boolean;
  typeofcare_id: any;
  lat:any;
  lng:any;

  constructor(private http: HttpService, private router: Router, private utility: UtilityService, private resolver: ComponentFactoryResolver) {
    // event.preventDefault();
  }

  cloneTemplate() {
    this.container.createEmbeddedView(this.template);
  }

  ngOnInit() {
   
    const data = JSON.parse(localStorage.getItem('login_data'));
    this.loginData = this.utility.decryptData(data, 'login_data');
    /*    $('#EndDate').change(function () {
          var startDate = document.getElementById('StartDate').value;
          var endDate = document.getElementById('EndDate').value;

          if ((Date.parse(startDate) >= Date.parse(endDate))) {
            $('.dateerror:first').text('End date should be greater than Start date');
            // alert('End date should be greater than Start date');
            document.getElementById('EndDate').value = '';
          }
        });*/

    // if (this.Availability !== undefined || this.Availability !== null || this.Availability !== 'undefined') {
    //  to avoid async call here i just call typeofcare here. inside typeofcare i call another function
    this.getAvailability();
    this.getTypeofcare();
    this.getmasterData();
    this.getworkhistory();
    this.getEducationhistory();
    this.getBadge();
    this.getbackground();
    this.getMasterBackground();
    this.getverification();
  }

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
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.numberOnlyError = 'Numerics only';

      return false;

    }
    this.numberOnlyError = '';
    return true;

  }
  putData(data, event) {
    if ( event.target.checked) {
      if (data.category === 'ssda') {
        this.ssad_value.push(data.label);
        // console.log(this.ssad_value);
      } else if (data.category === 'personal_care_main') {
        this.personal_value.push(data.label);
        // console.log(this.personal_value);
      } else if (data.category === 'nursing_services_main') {
        this.nursing_value.push(data.label);
        // console.log(this.nursing_value);
      } else if (data.category === 'allied_health_services') {
        this.allied_health_value.push(data.label);
        // console.log(this.allied_health_value);
      }
    } else {
      if (data.category === 'ssda') {
        let index = this.ssad_value.lastIndexOf(data.label);
        this.ssad_value.splice(index, 1);
        console.log(this.ssad_value);
      } else if (data.category === 'personal_care_main') {
        let index = this.personal_value.lastIndexOf(data.label);
        this.personal_value.splice(index, 1);
      } else if (data.category === 'nursing_services_main') {
        let index = this.nursing_value.lastIndexOf(data.label);
        this.nursing_value.splice(index, 1);
      } else if (data.category === 'allied_health_services') {
        let index = this.allied_health_value.lastIndexOf(data.label);
        this.allied_health_value.splice(index, 1);
      }
    }
  }

  isPresent(data, category) {
    if (category === 'ssad') {
      for ( let ssadcare of this.ssad_value) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    } else if (category === 'pc_care') {
      for ( let pccare of this.personal_value) {
        if (pccare === data.label) {
          return true;
        }
      }
    } else if (category === 'nursing') {
      for ( let nursing of this.nursing_value) {
        if (nursing === data.label) {
          return true;
        }
      }
    } else if (category === 'alliedservice') {
      for ( let allid of this.allied_health_value) {
        if (allid === data.label) {
          return true;
        }
      }
    }
  }

  updateCheckedOptions(tc, event) {
    if (event.target.checked === true) {
      this.ssad_typecare[tc] = event.target.checked;
      this.data = tc;
      this.ssad_value.push(this.data.label);
      this.ssadvalues.concat(tc.label + ',');
      console.log(this.ssad_value);
      console.log(this.ssad_typecare[tc]);
    } else if (event.target.checked === false) {
      _.remove(this.ssad_value, (sv) => {
        return sv === tc.label;
      });
      console.log(this.ssad_value);
    }
  }

  Checkedreligian(religion, event) {
    if (event.target.checked === true) {
      this.Religion[religion] = event.target.checked;
      this.data = religion;
      this.religion.push(this.data.label);
      this.religionvalues.concat(religion.label + ',');
      console.log(this.religion);
      console.log(this.Religion[religion]);
    } else if (event.target.checked === false) {
      _.remove(this.religion, (sv) => {
        return sv === religion.label;
      });
      console.log(this.religion);
    }
  }

  Checkedfirst(language, event) {
    if (event.target.checked === true) {
      this.Languages[language] = event.target.checked;
      this.data = language;
      this.firstLan.push(this.data.label);
      this.firstlanguage.concat(language.label + ',');
      console.log('this is firstLan' + this.firstLan);
      console.log(this.Languages[language]);
    } else if (event.target.checked === false) {
      _.remove(this.firstLan, (sv) => {
        return sv === language.label;
      });
    }
  }

  Checkedasian(Asian, event) {
    if (event.target.checked === true) {
      this.cb_asian[Asian] = event.target.checked;
      this.data = Asian;
      this.Asian.push(this.data.label);
      this.cb_asiannvalues.concat(Asian.label + ',');
      console.log(this.Asian);
      console.log(this.cb_asian[Asian]);
    } else if (event.target.checked === false) {
      _.remove(this.Asian, (sv) => {
        return sv === Asian.label;
      });
      console.log(this.Asian);
    }
  }

  Checkedinterst(interest, event) {
    if (event.target.checked === true) {
      this.Interest[interest] = event.target.checked;
      this.data = interest;
      this.hobbies.push(this.data.label);
      this.interstvalues.concat(interest.label + ',');
      console.log(this.hobbies);
      console.log(this.Interest[interest]);
    } else if (event.target.checked === false) {
      _.remove(this.hobbies, (sv) => {
        return sv === interest.label;
      });
      console.log(this.hobbies);
    }
  }

  Checkedsec(seclanguage, event) {
    if (event.target.checked === true) {
      this.secLanguages[seclanguage] = event.target.checked;
      this.data = seclanguage;
      this.secondLan.push(this.data.label);
      this.secondlanguage.concat(seclanguage.label + ',');
      console.log('this is second' + this.secondLan);
      console.log(this.secLanguages[seclanguage]);
    } else if (event.target.checked === false) {
      _.remove(this.secondLan, (se) => {
        return se === seclanguage.label;
      });
      console.log('second' + this.secondLan);
    }
  }
  public handleAddressChange(address: any) {
    this.address = address.formatted_address;

  }
  Checkedcultural(cultural, event) {
    this.checkevent(cultural.label, event);
    if (event.target.checked === true) {
      this.cultural_background[cultural] = event.target.checked;
      this.data = cultural;
      this.culturalBac.push(this.data.label);
      this.cultural.concat(cultural.label + ',');
      console.log('this is second' + this.culturalBac);
      console.log(this.cultural_background[cultural]);
    } else if (event.target.checked === false) {
      _.remove(this.culturalBac, (se) => {
        return se === cultural.label;
      });
      console.log('second' + this.culturalBac);
    }
  }

  radioevent(event: any) {
    this.cw_personality = event.target.value;
    console.log(this.cw_personality);
  }

  checkevent(label, event) {
    if (label === 'Western European' && event.target.checked === true) {
      this.western = true;
    }
    if (label === 'Western European' && event.target.checked === false) {
      this.western = false;
    }
    if (label === 'Asian' && event.target.checked === true) {
      this.asian = true;
    }
    if (label === 'Asian' && event.target.checked === false) {
      this.asian = false;
    }
    if (label === 'Middle Eastern' && event.target.checked === true) {
      this.middleeastern = true;
    }
    if (label === 'Middle Eastern' && event.target.checked === false) {
      this.middleeastern = false;
    }
    if (label === 'Southern & Eastern European' && event.target.checked === true) {
      this.Southern = true;
    }
    if (label === 'Southern & Eastern European' && event.target.checked === false) {
      this.Southern = false;
    }
  }

// Todo: This for verification Api calls
  createverification() {
    $('#verifypost').html('Posting...');
    $('#verifypost').prop('disabled', true);
    this.verification['user_id'] = this.loginData.userId;
    this.http.httpPost(this.verification, environment.apiUrl + '/cw_verifications?access_token' + this.loginData.id).subscribe((data: any) => {
        console.log(data);
        swal({
          type: 'success',
          title: 'Added',
          text: '',
          showConfirmButton: false,
          timer: 2000
        });
        $('#verification').modal('hide');
        $('.modal-backdrop').remove();
      }, error => {
        console.error('error while saving');
      },
    );
  }

  getverification() {
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.http.httpGetAuth(environment.apiUrl + '/cw_verifications?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.verification = data[0];
        this.isverification = true;
      } else {
        this.isverification = false;
      }
    });

    $('#verification').modal('hide');
    $('#myModal').modal('hide');
    $('.modal-backdrop').remove();
  }

  editverification() {
    $('#verify').html('Saving...');
    $('#verify').prop('disabled', true);
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.verification['user_id'] = this.loginData.userId;
    console.log(this.verification);
    this.http.httpPutAuth(this.verification, environment.apiUrl + '/cw_verifications?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.verification = data[0];
        $('#verify').html('Save');
        $('#verify').prop('enable', true);
      }
      swal({
        type: 'success',
        title: 'Updated',
        text: '',
        showConfirmButton: false,
        timer: 2000
      });
      $('#verification').modal('hide');
      this.getverification();
      $('#myModal').modal('hide');
      $('.modal-backdrop').remove();
    });
  }

// Todo: This for Badge Api callls
  createBadge() {
    $('#badges').html('Posting...');
    $('#badges').prop('disabled', true);
    this.badge['user_id'] = this.loginData.userId;
    this.http.httpPost(this.badge, environment.apiUrl + '/cw_other_qualifications?access_token' + this.loginData.id).subscribe((data: any) => {
        console.log(data);
        swal({
          type: 'success',
          title: 'Added',
          text: '',
          showConfirmButton: false,
          timer: 2000
        });
        $('#badgemodal').modal('hide');
        $('.modal-backdrop').remove();
      }, error => {
        console.error('error while saving');
      },
    );
  }

  getBadge() {
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.http.httpGetAuth(environment.apiUrl + '/cw_other_qualifications?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.badge = data[0];
        this.isBadges = true;
      } else {
        this.isBadges = false;
      }
    });

    $('#badgemodal').modal('hide');
    $('.modal-backdrop').remove();
  }

  editBadge() {
    $('#badgesedit').html('Saving...');
    $('#badgesedit').prop('disabled', true);
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.badge['user_id'] = this.loginData.userId;
    this.http.httpPutAuth(this.badge, environment.apiUrl + '/cw_other_qualifications?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.badge = data[0];
      }
      swal({
        type: 'success',
        title: 'Updated',
        text: '',
        showConfirmButton: false,
        timer: 2000
      });
      $('#badgemodal').modal('hide');
      $('.modal-backdrop').remove();
      this.getBadge();
    });
  }

  // Todo: This for Availability Api callls
  createAvailability() {
    $('.btn-disable').html('Posting...');
    $('.btn-disable').prop('disabled', true);
    this.Availability['user_id'] = this.loginData.userId;
    this.Availability['avail_location'] = this.address;

    this.http.httpPost(this.Availability, environment.apiUrl + '/cw_availabilities?access_token' + this.loginData.id).subscribe((data: any) => {
        console.log(data);
        swal({
          type: 'success',
          title: 'Added',
          text: '',
          showConfirmButton: false,
          timer: 2000
        });
        $('#myModal').modal('hide');
        $('.modal-backdrop').remove();
      }, error => {
        console.error('error while saving');
      },
    );
    this.getCoordinates();
  }

  getAvailability() {
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.http.httpGetAuth(environment.apiUrl + '/cw_availabilities?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.isAvails = true;
        this.Availability = data[0];
        this.address = this.Availability.avail_location;
        this.getCoordinates();
        console.log("**",this.Availability)
        
      } else {
        this.isAvails = false;
      }
    });
    $('#myModal').modal('hide');
    $('.modal-backdrop').remove();
  }

  editAvailability() {
    $('.btn-disable').html('Saving...');
    $('.btn-disable').prop('disabled', true);
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.Availability['user_id'] = this.loginData.userId;
    this.Availability['avail_location'] = this.address;
    this.http.httpPutAuth(this.Availability, environment.apiUrl + '/cw_availabilities?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.Availability = data[0];
      }
      swal({
        type: 'success',
        title: 'Updated',
        text: '',
        showConfirmButton: false,
        timer: 2000
      });
      $('.btn-disable').html('save');
      $('.btn-disable').prop('disabled', false);
      $('#myModal').modal('hide');
      $('.modal-backdrop').remove();
      this.getAvailability();
    });
  }

  // Todo: This for Type of care Api callls
  splitData(data) {
    let value = ''
    for (let datum of data) {
      if ( value !== '') {
        value = value + ';' + datum;
      } else {
        value = datum;
      }
    }
    return value;
  }

  createTypeofcare() {
    $('#isType').html('Posting...');
    $('#isType').prop('disabled', true);
    const Url = environment.apiUrl + '/cw_services_offereds?access_token' + this.loginData.id;
    const params = {
      'ssda': this.ssda,
      'ssda_value': this.splitData(this.ssad_value),
      'personal_care': this.personal_care,
      'personal_care_level1_value': this.splitData(this.personal_value),
      'nursing_services': this.nursing_services,
      'nursing_services_value': this.splitData(this.nursing_value),
      'allied_health_service': this.allied_health_service,
      'allied_health_service_value': this.splitData(this.allied_health_value),
      'lgbti': this.lgbti,
      'pw_male_only': this.pw_male_only,
      'pw_female_only': this.pw_female_only,
      'pw_no_preferences': this.pw_no_preferences,
      'pw_non_smoker': this.pw_non_smoker,
      'pw_no_pets': this.pw_no_pets,
      'user_id': this.loginData.userId
    };
    this.http.httpPost(params, Url).subscribe(
      data => {
        console.log(data);
        swal({
          type: 'success',
          title: 'Added',
          text: '',
          showConfirmButton: false,
          timer: 2000
        });
        $('#typeofcare').modal('hide');
        $('.modal-backdrop').remove();
      }, error => {
        console.error('error while saving');
      },
    );

  }

  getTypeofcare() {
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.http.httpGetAuth(environment.apiUrl + '/cw_services_offereds?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.data = data[0];
        this.isTcAvailable = true;
        this.typeofcare_id = this.data.id;
        if (this.data.ssda === true) {
          this.ssda = true;
          this.ssad_value = this.data.ssda_value.split(';', 12);
        }
        if (this.data.personal_care === true) {
          this.personal_care = true;
          this.personal_value = this.data.personal_care_level1_value.split(';', 12);
        }
        if (this.data.nursing_services === true) {
          this.nursing_services = true;
          this.nursing_value = this.data.nursing_services_value.split(';', 12);
        }
        if (this.data.allied_health_service === true) {
          this.allied_health_service = true;
          this.allied_health_value = this.data.allied_health_service_value.split(';', 12);
        }
        this.pw_no_preferences = this.data.pw_no_preferences === true ? true : false;
        this.pw_male_only = this.data.pw_male_only === true ? true : false;
        this.pw_female_only = this.data.pw_female_only === true ? true : false;
        this.pw_non_smoker = this.data.pw_non_smoker === true ? true : false;
        this.pw_no_pets = this.data.pw_no_pets === true ? true : false;
      } else {
        this.isTcAvailable = false;
      }
    });
  }

  editTypeofcare() {
    $('#istypedit').html('Saving...');
    $('#istypedit').prop('disabled', true);
    const Url = environment.apiUrl + '/cw_services_offereds/' + this.typeofcare_id + '?access_token=' + this.loginData.id;
    const params = {
      'ssda': this.ssda,
      'ssda_value': this.splitData(this.ssad_value),
      'personal_care': this.personal_care,
      'personal_care_level1_value': this.splitData(this.personal_value),
      'nursing_services': this.nursing_services,
      'nursing_services_value': this.splitData(this.nursing_value),
      'allied_health_service': this.allied_health_service,
      'allied_health_service_value': this.splitData(this.allied_health_value),
      'lgbti': this.lgbti,
      'pw_male_only': this.pw_male_only,
      'pw_female_only': this.pw_female_only,
      'pw_no_preferences': this.pw_no_preferences,
      'pw_non_smoker': this.pw_non_smoker,
      'pw_no_pets': this.pw_no_pets,
      'user_id': this.loginData.userId
    };
    this.http.httpPutAuth(params, Url).subscribe(data => {
      if (data.length > 0) {
        this.data = data[0];
        swal({
          type: 'success',
          title: 'Updated',
          text: '',
          showConfirmButton: false,
          timer: 2000
        });
      }
      $('#typeofcare').modal('hide');
      $('.modal-backdrop').remove();
      this.getTypeofcare();
    });

  }

  createworkhistory(form) {
    $('#work').html('Posting...');
    $('#work').prop('disabled', true);
    this.workHistory['job_start_date'] = this.job_start_date[0];
    this.workHistory['job_end_date'] = this.job_start_date[1];
    this.workHistory['user_id'] = this.loginData.userId;
    this.http.httpPost(this.workHistory, environment.apiUrl + '/cw_work_histories?access_token' + this.loginData.id).subscribe((data: any) => {
        console.log(data);
        $('#work').modal('hide');
        $('.modal-backdrop').remove();
      }, error => {
        console.error('error while saving');
      },
    );
    this.educationHistory['course_start_date'] = this.course_start_date[0];
    this.educationHistory['course_end_date'] = this.course_start_date[1];

    this.educationHistory['user_id'] = this.loginData.userId;
    this.http.httpPost(this.educationHistory, environment.apiUrl + '/cw_educations?access_token' + this.loginData.id).subscribe((data: any) => {
        if (data.length > 0) {
          this.educationHistory = data[0];
          console.log(this.educationHistory);
        }

        $('#work').modal('hide');
        $('.modal-backdrop').remove();
      }, error => {
        console.error('error while saving');
      },
    );

  }

  getworkhistory() {
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.http.httpGetAuth(environment.apiUrl + '/cw_work_histories?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.workHistory = data[0];
        this.job_start_date = [new Date(this.workHistory.job_start_date)];
        this.job_start_date = [new Date(this.workHistory.job_end_date)];
        // console.log(this.workHistory);
        this.isworkHistory = true;
      } else {
        this.isworkHistory = false;
      }
    });

    this.http.httpGetAuth(environment.apiUrl + '/cw_educations?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.educationHistory = data[0];
        /*this.course_institution = this.educationHistory.course_institution;
        this.course_degree = this.educationHistory.course_degree;*/
        this.course_start_date = [new Date(this.educationHistory.course_start_date)];
        this.course_start_date = [new Date(this.educationHistory.course_end_date)];
        this.iseducationHistory = true;
      } else {
        this.iseducationHistory = false;
      }
    });
    $('#work').modal('hide');
    $('.modal-backdrop').remove();
  }

  editworkhistory() {
    $('#workedit').html('Saving...');
    $('#workedit').prop('disabled', true);
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    // this.workHistory['user_id'] = this.loginData.userId;
    this.workHistory['job_start_date'] = this.job_start_date[0];
    this.workHistory['job_end_date'] = this.job_start_date[1];
    this.http.httpPutAuth(this.workHistory, environment.apiUrl + '/cw_work_histories?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data !== null && data !== undefined) {
        this.workHistory = data;
        this.isworkHistory = true;
      }
      this.educationHistory['course_start_date'] = this.course_start_date[0];
      this.educationHistory['course_end_date'] = this.course_start_date[1];
      this.http.httpPutAuth(this.educationHistory, environment.apiUrl + '/cw_educations?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
        if (data !== null && data !== undefined) {
          this.educationHistory = data;
          this.iseducationHistory = true;
          if (this.isworkHistory === true && this.iseducationHistory === true) {
            this.getworkhistory();
            swal({
              type: 'success',
              title: 'Updated',
              text: '',
              showConfirmButton: false,
              timer: 2000
            });

            $('#work').modal('hide');
            $('.modal-backdrop').remove();
          }
        }
      });
    });
  }

  // Todo: This for education history Api callls

  getEducationhistory() {
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.http.httpGetAuth(environment.apiUrl + '/cw_educations?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        this.educationHistory = data[0];
        this.isAvailable = true;
      } else {
        this.isAvailable = false;
      }
    });
    $('#work').modal('hide');
    $('.modal-backdrop').remove();
  }

// Todo: This for Type of care Api callls
  getmasterData() {
    this.http.httpGetAuth(environment.apiUrl + '/master_services_offereds?access_token=' + this.loginData.id).subscribe(data => {
      if (data.length > 0) {
        console.log(data);
        for (let datum of data) {
          if (datum.category === 'ssda') {
            this.ssad_typecare.push(datum);
          } else if (datum.category === 'personal_care_main') {
            this.prs_typecare.push(datum);
          } else if (datum.category === 'nursing_services_main') {
            this.nurs_typecare.push(datum);
          } else if (datum.category === 'allied_health_services') {
            this.allied_typecare.push(datum);
          }
        }
        this.isAvailable = true;
      } else {
        this.isAvailable = false;
      }
    });
  }

// Todo: This for background Api callls
  createbackground(form) {
    $('#back').html('Posting...');
    $('#back').prop('disabled', true);
    this.religionvalues = ' ';
    const length = this.religion.length - 1;
    for (let j = 1; j < this.religion.length; j++) {
      if (j < length) {
        this.religionvalues = this.religionvalues.concat(this.religion[j] + ',');
      } else {
        this.religionvalues = this.religionvalues.concat(this.religion[j]);
      }
    }
    this.interstvalues = '';
    const inter = this.hobbies.length - 1;
    for (let j = 0; j < this.hobbies.length; j++) {
      if (j < inter) {
        this.interstvalues = this.interstvalues.concat(this.hobbies[j] + ',');
      } else {
        this.interstvalues = this.interstvalues.concat(this.hobbies[j]);
      }
    }
    this.cb_asiannvalues = '';
    const asian = this.Asian.length - 1;
    for (let j = 0; j < this.Asian.length; j++) {
      if (j < asian) {
        this.cb_asiannvalues = this.cb_asiannvalues.concat(this.Asian[j] + ',');
      } else {
        this.cb_asiannvalues = this.cb_asiannvalues.concat(this.Asian[j]);
      }
    }
    this.firstlanguage = '';
    const firlength = this.firstLan.length - 1;
    for (let j = 0; j < this.firstLan.length; j++) {
      if (j < firlength) {
        this.firstlanguage = this.firstlanguage.concat(this.firstLan[j] + ',');
      } else {
        this.firstlanguage = this.firstlanguage.concat(this.firstLan[j]);
      }
    }
    this.secondlanguage = '';
    const seclength = this.secondLan.length - 1;
    for (let j = 0; j < this.secondLan.length; j++) {
      if (j < seclength) {
        this.secondlanguage = this.secondlanguage.concat(this.secondLan[j] + ',');
      } else {
        this.secondlanguage = this.secondlanguage.concat(this.secondLan[j]);
      }
    }
    this.cultural = '';
    const culture = this.culturalBac.length - 1;
    for (let j = 0; j < this.culturalBac.length; j++) {
      if (j < culture) {
        this.cultural = this.cultural.concat(this.culturalBac[j] + ',');
      } else {
        this.cultural = this.cultural.concat(this.culturalBac[j]);
      }
    }
    const data = {
      'required_social_needs': this.socialneeds,
      'hobbies': this.interstvalues,
      'first_language': this.firstlanguage,
      'second_language': this.secondlanguage,
      'cultural_background': this.cultural,
      'religion': this.religionvalues,
      'cw_smoking_habit': this.pw_non_smoker,
      'cw_pet_friendly': this.pw_no_pets,
      'cw_profile_photo': null,
      'cw_about_you': null,
      'cw_personality': this.cw_personality,
      'western_european_bg_value': null,
      'asian_bg_value': this.cb_asiannvalues,
      'middle_east_bg_value': null,
      'south_and_east_european_bg_value': null,
      'user_id': this.loginData.userId
    };
    this.http.httpPost(data, environment.apiUrl + '/social_needs?access_token' + this.loginData.id).subscribe((data: any) => {

      swal({
        type: 'success',
        title: 'Added',
        text: '',
        showConfirmButton: false,
        timer: 2000
      });

    });
    this.getbackground();
    $('#personal').modal('hide');
    $('.modal-backdrop').remove();
  }

  getbackground() {
    const condition = JSON.stringify({'where': {'user_id': this.loginData.userId}});
    this.http.httpGetAuth(environment.apiUrl + '/social_needs?filter=' + encodeURIComponent(condition) + '&access_token=' + this.loginData.id).subscribe(
      data => {
        if (data.length > 0) {
          this.data = data[0];
          console.log(this.data);
          this.religion = this.data.religion.split(',');
          this.firstLan = this.data.first_language.split(',');
          this.secondLan = this.data.second_language.split(',');
          this.culturalBac = this.data.cultural_background.split(',');
          this.hobbies = this.data.hobbies.split(',');
          this.cw_personality = this.data.cw_personality;
          this.Asian = this.data.asian_bg_value.split(',');
          this.back = true;
          this.id = this.data.id;
        } else {
          this.back = false;
        }
      }, error => console.log(error)
    );

    $('#personal').modal('hide');
    $('.modal-backdrop').remove();
  }

  isAvail(data, category) {
    if (category === 'cultural_background') {
      for ( let ssadcare of this.culturalBac) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    } else if (category === 'cb_southern_&_eastern_european') {
      for ( let ssadcare of this.ssad_value) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    } else if (category === 'cb_middle_eastern') {
      for ( let ssadcare of this.ssad_value) {
        if (ssadcare === data.label) {
          return true;
        }
      }    } else if (category === 'cb_asian') {
      for ( let ssadcare of this.Asian) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    } else if (category === 'cb_western_european') {
      for ( let ssadcare of this.ssad_value) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    } else if (category === 'languages') {
      for ( let ssadcare of this.firstLan) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    }  else if (category === 'second_languages') {
      for ( let ssadcare of this.secondLan) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    } else if (category === 'interests_hobbies_loves') {
      for ( let ssadcare of this.hobbies) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    } else if (category === 'religion') {
      for ( let ssadcare of this.religion) {
        if (ssadcare === data.label) {
          return true;
        }
      }
    }
  }


  editbackground(form) {
    $('#backedit').html('Saving...');
    $('#backedit').prop('disabled', true);
    this.religionvalues = '';
    const length = this.religion.length - 1;
    for (let j = 0; j < this.religion.length; j++) {
      if (j < length) {
        this.religionvalues = this.religionvalues.concat(this.religion[j] + ',');
      } else {
        this.religionvalues = this.religionvalues.concat(this.religion[j]);
      }
    }
    this.interstvalues = '';
    const inter = this.hobbies.length - 1;
    for (let j = 0; j < this.hobbies.length; j++) {
      if (j < inter) {
        this.interstvalues = this.interstvalues.concat(this.hobbies[j] + ',');
      } else {
        this.interstvalues = this.interstvalues.concat(this.hobbies[j]);
      }
    }
    this.cb_asiannvalues = '';
    const asian = this.Asian.length - 1;
    for (let j = 0; j < this.Asian.length; j++) {
      if (j < asian) {
        this.cb_asiannvalues = this.cb_asiannvalues.concat(this.Asian[j] + ',');
      } else {
        this.cb_asiannvalues = this.cb_asiannvalues.concat(this.Asian[j]);
      }
    }
    this.firstlanguage = '';
    const firlength = this.firstLan.length - 1;
    for (let j = 0; j < this.firstLan.length; j++) {
      if (j < firlength) {
        this.firstlanguage = this.firstlanguage.concat(this.firstLan[j] + ',');
      } else {
        this.firstlanguage = this.firstlanguage.concat(this.firstLan[j]);
      }
    }
    this.secondlanguage = '';
    const seclength = this.secondLan.length - 1;
    for (let j = 0; j < this.secondLan.length; j++) {
      if (j < seclength) {
        this.secondlanguage = this.secondlanguage.concat(this.secondLan[j] + ',');
      } else {
        this.secondlanguage = this.secondlanguage.concat(this.secondLan[j]);
      }
    }
    this.cultural = '';
    const culture = this.culturalBac.length - 1;
    for (let j = 0; j < this.culturalBac.length; j++) {
      if (j < culture) {
        this.cultural = this.cultural.concat(this.culturalBac[j] + ',');
      } else {
        this.cultural = this.cultural.concat(this.culturalBac[j]);
      }
    }
    const param = {
      'required_social_needs': this.socialneeds,
      'hobbies': this.interstvalues,
      'first_language': this.firstlanguage,
      'second_language': this.secondlanguage,
      'cultural_background': this.cultural,
      'religion': this.religionvalues,
      'cw_smoking_habit': this.pw_non_smoker,
      'cw_pet_friendly': this.pw_no_pets,
      'cw_profile_photo': null,
      'cw_about_you': null,
      'cw_personality': this.cw_personality,
      'western_european_bg_value': null,
      'asian_bg_value': this.cb_asiannvalues,
      'middle_east_bg_value': null,
      'south_and_east_european_bg_value': null,
      'user_id': 2
    };
    this.http.httpPutAuth(param, environment.apiUrl + '/social_needs/' + this.id + '?access_token=' + this.loginData.id).subscribe(data => {
      console.log(data);
      if (data) {
        swal({
          type: 'success',
          title: 'Updated',
          text: '',
          showConfirmButton: false,
          timer: 2000
        });
      }
      $('#personal').modal('hide');
      $('.modal-backdrop').remove();
      this.getbackground();
    }, error1 => console.log(error1));

  }

  getMasterBackground() {
    this.http.httpGetAuth(environment.apiUrl + '/master_social_needs?access_token=' + this.loginData.id).subscribe(
      data => {
        console.log(data);
        for (let datum of data) {
          if (datum.category === 'cultural_background') {
            this.cultural_background.push(datum);
          } else if (datum.category === 'cb_southern_&_eastern_european') {
            this.cb_southern.push(datum);
          } else if (datum.category === 'cb_middle_eastern') {
            this.cb_middle_eastern.push(datum);
          } else if (datum.category === 'cb_asian') {
            this.cb_asian.push(datum);
          } else if (datum.category === 'cb_western_european') {
            this.cb_western_european.push(datum);
          } else if (datum.category === 'languages') {
            this.Languages.push(datum);
            this.secLanguages.push(datum);
          } else if (datum.category === 'interests_hobbies_loves') {
            this.Interest.push(datum);
          } else if (datum.category === 'religion') {
            this.Religion.push(datum);
          }
        }
    }, error => console.log(error));
  }
  getCoordinates(){
    this.http.httGet('https://maps.google.com/maps/api/geocode/json?address='+this.address+'&sensor=false&key=AIzaSyBx3mB6iVt9EjzLDmb8xx17bB_VPZYLUZQ').subscribe(res=>{
      console.log(res.results[0].geometry.location)
      this.lat= res.results[0].geometry.location.lat;
      this.lng = res.results[0].geometry.location.lng;
     
    });
  }
}
