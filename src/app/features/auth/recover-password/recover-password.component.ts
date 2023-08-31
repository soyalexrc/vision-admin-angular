import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, UntypedFormControl, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {UiService} from "../../../core/services/ui.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit, OnDestroy{
  form!: FormGroup;
  loading: any;
  passwordVisible = false;
  confirmPasswordVisible = false;
  email = '';
  code = '';
  routeSubscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.confirmationValidator]],
    })

    this.routeSubscription = this.route.queryParams.subscribe((params: any) => {
      this.code = params['code'];
      this.email = params['email'];
    })
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  submitForm() {
    this.loading = true;
    this.authService.recoverPassword(this.email, this.form.get('password')?.value, this.code).subscribe(result => {
      this.uiService.createMessage('success', result.message)
      this.router.navigate(['/autentificacion/login'])
    }, (error) => {
      this.uiService.createMessage('error', error.error.message)
      this.loading = false;
    }, () => {
      this.loading = false;
    })
  }

  confirmationValidator = (control: UntypedFormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.form.get('password')?.value) {
      return { confirm: true, error: true };
    }
    return {};
  };


  // updateConfirmValidator(): void {
  //   Promise.resolve().then(() => this.form.get('confirmPassword')?.updateValueAndValidity());
  // }

}
