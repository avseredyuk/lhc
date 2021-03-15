import {BasePageableStorable} from "../../base/base-pageable-storable";
import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Configuration} from "../../model/configuration";
import {DataService} from "../../service/data.service";
import {ApiResult} from "../../model/api-result";
import {AppNotification, AppNotificationType} from "../../model/app-notification";
import {TokenCheckService} from "../../service/token-check.service";
import {ComponentCommunicationService} from "../../service/component-communication.service";
import {UtilService} from "../../service/util.service";

@Component({
  selector: 'app-settings-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class SettingsListComponent extends BasePageableStorable<Configuration> implements OnInit {

  constructor(public router: Router, private dataService: DataService, public tokenCheckService: TokenCheckService,
    public componentCommunicationService: ComponentCommunicationService, public utilService: UtilService) {
    super(utilService.PAGINATED_COMPONENT_SETTINGS_LIST, router, componentCommunicationService, tokenCheckService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  loadPageData(): void {
    this.dataService.getConfiguration(this.pageNumber, this.pageSize).subscribe(settings => {
      this.data = settings.content;
      this.totalElements = settings.totalElements;
    });
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
    this.componentCommunicationService.setPageNumber(this.utilService.PAGINATED_COMPONENT_SETTINGS_LIST, this.pageNumber);
    this.router.navigate(['settings', configuration.key, 'edit']);
  }

  addSettings(): void {
    this.componentCommunicationService.setPageNumber(this.utilService.PAGINATED_COMPONENT_SETTINGS_LIST, this.pageNumber);
    this.router.navigate(['settings', 'add']);
  }

  deleteSettings(configuration: Configuration): void {
    if (confirm('Are you sure you want to delete configuration "' + configuration.key + '" ?')) {
      this.dataService.deleteConfiguration(configuration).subscribe(data => {
        this.notificateThisPage([new AppNotification('Deleted configuration with key: ' + configuration.key, AppNotificationType.SUCCESS)]);
        this.loadPageData();
      }, error => {
        if (error.status === 400) {
          this.notificateThisPage(error.error.errors.map(function(n) {return new AppNotification(n, AppNotificationType.ERROR)}));
        } else {
          this.notificateThisPage([new AppNotification('Unknown error', AppNotificationType.ERROR)]);
        }
        this.loadPageData();
      });
    }
  }

}
