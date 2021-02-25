import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Configuration} from "../../model/configuration";
import {DataService} from "../../service/data.service";
import {ApiResult} from "../../model/api-result";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";

@Component({
  selector: 'app-settings-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class SettingsListComponent implements OnInit {

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
    this.router.navigate(['/settings/' + configuration.key + '/edit']);
  }

  addSettings() {
    this.router.navigate(['settings/add']);
  }

  deleteSettings(configuration: Configuration) {
    if (confirm('Are you sure you want to delete configuration "' + configuration.key + '" ?')) {
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

  }

  hasData(): Boolean {
    return typeof this.configurations !== 'undefined' && this.configurations.length > 0;
  }

  hasNotifications(): Boolean {
    return typeof this.notifications !== 'undefined' && this.notifications.length > 0;
  }

}
