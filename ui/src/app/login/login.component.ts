import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  notifications: Array<AppNotification> = [];
  loginForm: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, private router: Router,
    private tokenCheckService: TokenCheckService) {
  }

  ngOnInit() {
    this.tokenCheckService.removeToken();

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
      this.tokenCheckService.saveToken(data);
      this.router.navigate(['/']);
    }, error => {
      if (error.status === 401) {
        this.notifications = [new AppNotification('Invalid credentials', AppNotificationType.ERROR)];
      } else {
        this.notifications = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
      }
    });
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }

}
