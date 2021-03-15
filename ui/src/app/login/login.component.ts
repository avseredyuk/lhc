import {Base} from "../base/base";
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends Base implements OnInit {

  loginForm: FormGroup;
  usernameCtrl: FormControl;
  passwordCtrl: FormControl;

  constructor(private formBuilder: FormBuilder, private dataService: DataService, public router: Router,
    private tokenCheckService: TokenCheckService, public componentCommunicationService: ComponentCommunicationService) {
    super(router, componentCommunicationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.tokenCheckService.removeToken();

    this.usernameCtrl = this.formBuilder.control('', [Validators.required]);
    this.passwordCtrl = this.formBuilder.control('', [Validators.required]);

    this.loginForm = this.formBuilder.group({
      username: this.usernameCtrl,
      password: this.passwordCtrl
    });
  }

  onSubmit(): void {
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
        this.notificateThisPage([new AppNotification('Invalid credentials', AppNotificationType.ERROR)]);
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }

}
