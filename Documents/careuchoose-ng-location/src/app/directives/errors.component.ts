import {Component, Input} from '@angular/core';
import {AbstractControlDirective, AbstractControl} from '@angular/forms';


@Component({
  selector: 'app-error',
  template: `
    <div *ngIf="shouldShowErrors()">
      <p class="text-danger" *ngFor="let error of listOfErrors()">{{error}}</p>
    </div>`,
  styleUrls: ['./error.component.css']
})
export class ShowErrorsComponent {

  private static readonly errorMessages = {
    'required': () => 'This field is required',
    'minlength': (params) => 'The min number of characters is ' + params.requiredLength,
    'maxlength': (params) => 'The max allowed number of characters is ' + params.requiredLength,
    'pattern': (params) => 'Incorrect Format ',
    'years': (params) => params.message,
    'countryCity': (params) => params.message,
    'uniqueName': (params) => params.message,
    'telephoneNumbers': (params) => params.message,
    'telephoneNumber': (params) => params.message
  };

  @Input()

  private control: AbstractControlDirective | AbstractControl;

  shouldShowErrors(): boolean {
    return this.control &&
      this.control.errors &&
      (this.control.dirty || this.control.touched);
  }

  listOfErrors(): string[] {
    return Object.keys(this.control.errors)
      .map(field => this.getMessage(field, this.control.errors[field]));
  }

  private getMessage(type: string, params: any) {

    return ShowErrorsComponent.errorMessages[type](params);

  }

}
