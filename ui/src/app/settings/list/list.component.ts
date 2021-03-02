import {BaseComponent} from "../../base/base.component";
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
export class SettingsListComponent extends BaseComponent implements OnInit {

  configurations: Configuration[];

  constructor(public router: Router, private dataService: DataService, private tokenCheckService: TokenCheckService,
    public componentCommunicationService: ComponentCommunicationService) {
    super(router, componentCommunicationService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.dataService.getConfiguration().subscribe(data => 
      this.configurations = data
    );
  }

  clearCache(): void {
    this.dataService.clearCache().subscribe((data: ApiResult<boolean>) => {
      this.notificateThisPage([new AppNotification('Cache cleared', AppNotificationType.SUCCESS)]);
    }, error => {
      if (error.status === 400) {
        this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
      } else {
        this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
      }
    });
  }

  editSettings(configuration: Configuration): void {
    this.router.navigate(['/settings/' + configuration.key + '/edit']);
  }

  addSettings(): void {
    this.router.navigate(['settings/add']);
  }

  deleteSettings(configuration: Configuration): void {
    if (confirm('Are you sure you want to delete configuration "' + configuration.key + '" ?')) {
      this.dataService.deleteConfiguration(configuration).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted configuration with key: ' + configuration.key, AppNotificationType.SUCCESS)]);
        this.loadData();
      }, error => {
        if (error.status === 400) {
          this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
        } else {
          this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.loadData();
      });
    }
  }

  hasData(): boolean {
    return typeof this.configurations !== 'undefined' && this.configurations.length > 0;
  }

}
