import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCurrencyInput]'
})
export class CurrencyInputDirective {

  @Input() currencySymbol: string = '$';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const input = event.target as HTMLInputElement;

    // Get the current input value
    let value = input.value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters except for the dot (.)

    // Format the value with thousands separators and two decimal places
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (parts[1]) {
      parts[1] = parts[1].substring(0, 2); // Limit to 2 decimal places
    }
    value = parts.join('.');

    // Add currency symbol
    value = `${this.currencySymbol} ${value}`;

    // Update the input value
    this.renderer.setProperty(input, 'value', value);
  }
}
