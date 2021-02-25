import {Component, OnInit} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {TokenCheckService} from "../service/token-check.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentUrl: string;
  hasToken: Boolean = false;
  canGoBack: Boolean = false;
  goBackCallback: () => any;

  constructor(private router: Router, private tokenCheckService: TokenCheckService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url)
  }

  ngOnInit() {
    this.hasToken = !this.tokenCheckService.isExpiredToken();
  }

  isDeviceGroup(): Boolean {
    let arr = [
    "/devices"
    ];
    if (this.currentUrl) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (this.currentUrl.startsWith(arr[i])) {
          return true;
        }
      }
    }
    return false;
  }

  isSettingsGroup(): Boolean {
    let arr = [
      "/settings"
    ];
    if (this.currentUrl) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (this.currentUrl.startsWith(arr[i])) {
          return true;
        }
      }
    }
    return false;
  }

  isStatusGroup(): Boolean {
    let arr = [
      "/status"
    ];
    if (this.currentUrl) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (this.currentUrl.startsWith(arr[i])) {
          return true;
        }
      }
    }
    return false;
  }

  isHistoryGroup(): Boolean {
    let arr = [
      "/history"
    ];
    if (this.currentUrl) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (this.currentUrl.startsWith(arr[i])) {
          return true;
        }
      }
    }
    return false;
  }

  isLoginGroup(): Boolean {
    let arr = [
      "/login"
    ];
    if (this.currentUrl) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (this.currentUrl.startsWith(arr[i])) {
          return true;
        }
      }
    }
    return false;
  }

  setGoBackCallback(callback: () => any) {
    this.canGoBack = true;
    this.goBackCallback = callback;
  }

  logoutWithConfirmation() {
    if (confirm('Are you sure you want to logout?"')) {
      this.router.navigate(['logout']);
    }
  }
}
