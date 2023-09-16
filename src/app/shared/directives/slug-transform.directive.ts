import {Directive, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[appSlugTransform]'
})
export class SlugTransformDirective implements OnInit, OnDestroy{
  valueSubscription: Subscription | undefined;

  constructor(public ngControl: NgControl) {}

  ngOnInit(): void {
    this.valueSubscription = this.ngControl.control?.valueChanges.subscribe(
        value => {
          const newVal = this.transform(value);
          this.ngControl.control?.setValue(newVal, { emitEvent: false });
        }
    );
  }

  transform(value: string) {
    let text = value.toLowerCase();
    if (text.charAt(0) == " ") {
      text = text.trim();
    }
    if (text.charAt(text.length - 1) == "-") {
      //text = (text.replace(/-/g, ""));
    }
    text = text.replace(/ +/g, "-");
    text = text.replace(/--/g, "-");
    text = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""); // Note: Normalize('NFKD') used to normalize special alphabets like óã to oa
    text = text.replace(/[^a-zA-Z0-9 -]/g, "");

    return text;
  }

  ngOnDestroy(): void {
    this.valueSubscription?.unsubscribe();
  }
}

