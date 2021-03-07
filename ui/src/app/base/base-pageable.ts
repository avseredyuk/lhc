import {Component, OnInit} from '@angular/core';
import {BaseAuthComponent} from "../base-auth/base-auth.component";
import {TokenCheckService} from "../service/token-check.service";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {Router} from "@angular/router";
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'app-base-pageable',
  template: ''
})
export abstract class BasePageableComponent extends BaseAuthComponent implements OnInit {

  totalElements: number;
  pageNumber = 0;
  pageSize = 10;

  constructor(public router: Router, public componentCommunicationService: ComponentCommunicationService, public tokenCheckService: TokenCheckService) {
    super(router, componentCommunicationService, tokenCheckService);
  }

  public abstract loadPageForDevice(): void;

  loadPage(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPageForDevice();
  }

}
