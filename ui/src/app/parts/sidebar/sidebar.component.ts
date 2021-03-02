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
  hasToken: boolean = false;
  canGoBack: boolean = false;
  goBackCallback: () => any;

  constructor(private router: Router, private tokenCheckService: TokenCheckService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = this.router.url)
  }

  ngOnInit(): void {
    this.populateHasToken();
  }

  isGroup(url: string): boolean {
    return this.currentUrl && this.currentUrl.startsWith(url);
  }

  isDeviceGroup(): boolean {
    return this.isGroup("/devices");
  }

  isSettingsGroup(): boolean {
    return this.isGroup("/settings");
  }

  isStatusGroup(): boolean {
    return this.isGroup("/status");
  }

  isHistoryGroup(): boolean {
    return this.isGroup("/history");
  }

  isLoginGroup(): boolean {
    return this.isGroup("/login");
  }

  setGoBackCallback(callback: () => any): void {
    this.canGoBack = true;
    this.goBackCallback = callback;
  }

  populateHasToken(): void {
    this.hasToken = !this.tokenCheckService.isExpiredToken();
  }

  logoutWithConfirmation(): void {
    if (confirm('Are you sure you want to logout?"')) {
      this.tokenCheckService.removeToken();
      this.populateHasToken();
      this.router.navigate(['/']);
    }
  }
}
