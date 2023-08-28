import { Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {

  constructor() {
  }

  @HostListener('keypress', ['$event'])

  public onkeypress(ev: any): void {
    let isNumeric = (ev.charCode >= 48 && ev.keyCode <= 57);
    if (!isNumeric)
      ev.preventDefault();
  }
}
