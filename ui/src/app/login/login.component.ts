import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;

  invalidLogin: boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService) { }

  ngOnInit() {
    window.localStorage.removeItem('token');
    this.usernameCtrl = this.formBuilder.control('', [Validators.required]);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required]);

    this.loginForm = this.formBuilder.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    const loginPayload = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value
    }
    this.dataService.login(loginPayload).subscribe(data => {
      window.localStorage.setItem('token', data.token);
      this.router.navigate(['/']);
    }, error => {
      this.invalidLogin = true;
    });
  }

}
