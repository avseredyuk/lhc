import {Component, OnInit} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {TokenCheckService} from "../token-check.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentUrl: string;
  hasToken: Boolean = false;

  constructor(private router: Router, private tokenCheckService: TokenCheckService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url)
  }

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this.hasToken = !this.tokenCheckService.isExpiredToken();
  }

  isDeviceGroup(): Boolean {
    let arr = [
    "/devices", // list
    "/add-device", // add
    "/devices/" // view
    ];
    if (this.currentUrl) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (this.currentUrl.includes(arr[i])) {
          return true;
        }
      }
    }
    return false;
  }
}
