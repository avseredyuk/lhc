import {BaseComponent} from "../base/base.component";
import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {TokenCheckService} from "../service/token-check.service";

@Component({
  selector: 'app-base-auth',
  template: ''
})
export class BaseAuthComponent extends BaseComponent implements OnInit {

  constructor(public router: Router, public componentCommunicationService: ComponentCommunicationService, public tokenCheckService: TokenCheckService) {
  	super(router, componentCommunicationService);
  }

  ngOnInit(): void {
  	super.ngOnInit();
  	if (!this.tokenCheckService.getRawToken()) {
      this.router.navigate(['login']);
    }
  }

}
