import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Configuration} from "../model/configuration";
import {DataService} from "../data.service";
import {ApiResult} from "../model/api-result";
import {AppNotification, AppNotificationType} from "../model/app-notification";
import {TokenCheckService} from "../token-check.service";
import {ComponentCommunicationService} from "../component-communication.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  configurations: Configuration[];
  notifications: Array<AppNotification> = [];

  constructor(private router: Router, private dataService: DataService, private tokenCheckService: TokenCheckService,
    private componentCommunicationService: ComponentCommunicationService) { }

  ngOnInit() {
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.notifications = this.componentCommunicationService.getNotification();

    this.loadData();
  }

  loadData() {
    this.dataService.getConfiguration().subscribe(
      data => this.configurations = data
     );
  }

  clearCache() {
    this.dataService.clearCache().subscribe(
      (data: ApiResult<Boolean>) => {
        this.notifications = [new AppNotification('Cache cleared', AppNotificationType.SUCCESS)];
      },
      error => {
        if (error.status === 400) {
          this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
        } else {
          this.notifications = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
        }
      }
      );
  }

  editSettings(configuration: Configuration) {
    this.router.navigate(['/edit-settings/' + configuration.key]);
  }

  addSettings() {
    this.router.navigate(['/add-settings']);
  }

  deleteSettings(configuration: Configuration) {
    this.dataService.deleteConfiguration(configuration).subscribe(
      data => {
        this.notifications = [new AppNotification('Deleted configuration with key: ' + configuration.key, AppNotificationType.SUCCESS)];
        this.loadData();
      },
      error => {
        if (error.status === 400) {
          this.notifications = error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)});
        } else {
          this.notifications = [new AppNotification('Unknown error', AppNotificationType.ERROR)];
        }
        this.loadData();
      });
  }

  hasData(): Boolean {
    return typeof this.configurations !== 'undefined' && this.configurations.length > 0;
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }

}
