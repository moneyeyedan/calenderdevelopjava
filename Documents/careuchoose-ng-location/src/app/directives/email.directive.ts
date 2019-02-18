import {Directive, ElementRef} from '@angular/core';


@Directive({
  selector: '[appEmail]'
})
export class EmailDirective {

  constructor(private e: ElementRef) {
    this.e.nativeElement.setAttribute('pattern', '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$');
  }

}
