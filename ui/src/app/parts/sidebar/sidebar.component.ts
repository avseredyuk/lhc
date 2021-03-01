import {Component, OnInit} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {TokenCheckService} from "../../service/token-check.service";

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
    this.populateHasToken();
  }

  isGroup(url: string) {
    return this.currentUrl && this.currentUrl.startsWith(url);
  }

  isDeviceGroup(): Boolean {
    return this.isGroup("/devices");
  }

  isSettingsGroup(): Boolean {
    return this.isGroup("/settings");
  }

  isStatusGroup(): Boolean {
    return this.isGroup("/status");
  }

  isHistoryGroup(): Boolean {
    return this.isGroup("/history");
  }

  isLoginGroup(): Boolean {
    return this.isGroup("/login");
  }

  setGoBackCallback(callback: () => any) {
    this.canGoBack = true;
    this.goBackCallback = callback;
  }

  populateHasToken() {
    this.hasToken = !this.tokenCheckService.isExpiredToken();
  }

  logoutWithConfirmation() {
    if (confirm('Are you sure you want to logout?"')) {
      this.tokenCheckService.removeToken();
      this.populateHasToken();
      this.router.navigate(['/']);
    }
  }
}
