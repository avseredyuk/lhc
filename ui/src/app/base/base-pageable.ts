import {Component, OnInit} from '@angular/core';
import {BaseAuth} from "../base/base-auth";
import {TokenCheckService} from "../service/token-check.service";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {Router} from "@angular/router";
import {PageEvent} from '@angular/material/paginator';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Page} from "../model/page";

@Injectable()
export abstract class BasePageable<T> extends BaseAuth implements OnInit {

  totalElements: number;
  pageNumber = 0;
  pageSize = 10;

  data: Array<T> = [];

  constructor(public router: Router, public componentCommunicationService: ComponentCommunicationService, public tokenCheckService: TokenCheckService) {
    super(router, componentCommunicationService, tokenCheckService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public abstract providePageData(): Observable<Page<T>>

  loadPage(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPageData();
  }

  loadPageData() {
    this.providePageData().subscribe(page => {
      this.data = page.content;
      this.totalElements = page.totalElements;
    });
  }

  hasData(): boolean {
    return typeof this.data !== 'undefined' && this.data.length > 0;
  }

}
