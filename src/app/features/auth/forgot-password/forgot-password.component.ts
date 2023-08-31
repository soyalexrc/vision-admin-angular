import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../core/services/auth.service";
import {UiService} from "../../../core/services/ui.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit{
  form!: FormGroup;
  loading: any;
  isSent = false;
  message = ''

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UiService
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}/)]],
    })
  }

  submitForm() {
    this.loading = true;
    this.authService.forgotPassword(this.form.get('email')?.value).subscribe(result => {
      this.uiService.createMessage('success', result.message)
      this.isSent = true;
      this.message = result.message
    }, (error) => {
      this.uiService.createMessage('error', error.error.message)
      this.loading = false;
    }, () => {
      this.loading = false;
    })
  }
}
