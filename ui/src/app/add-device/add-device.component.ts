import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../data.service";
import {AppNotification, AppNotificationType} from "../model/app-notification";

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.scss']
})
export class AddDeviceComponent implements OnInit {

  notifications: Array<AppNotification> = [];
  addForm: FormGroup;
  nameCtrl: FormControl;
  tokenCtrl: FormControl;

  constructor(private formBuilder: FormBuilder, private router: Router, private dataService: DataService) { }

  ngOnInit() {
  	if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }
    this.nameCtrl = this.formBuilder.control('', [Validators.required]);
    this.tokenCtrl = this.formBuilder.control('', [Validators.required]);

    this.addForm = this.formBuilder.group({
      name: this.nameCtrl,
      token: this.tokenCtrl,
    });
  }

 onSubmit() {
    this.dataService.createDevice(this.addForm.value)
      .subscribe( data => {
        this.router.navigate(['devices']);
      },
      error => { // HttpErrorResponse
          if (error.status === 400) {
            this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
          } else {
            this.notifications = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
          }
        });
  }

  hasNotifications(): Boolean {
    return this.notifications.length > 0;
  }
}