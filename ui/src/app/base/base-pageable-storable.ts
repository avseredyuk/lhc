import {Component, OnInit} from '@angular/core';
import {BasePageable} from "../base/base-pageable";
import {TokenCheckService} from "../service/token-check.service";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {Router} from "@angular/router";
import {PageEvent} from '@angular/material/paginator';
import {Injectable} from "@angular/core";

@Injectable()
export abstract class BasePageableStorable<T> extends BasePageable<T> implements OnInit {

  className: string;

  constructor(className: string, public router: Router, public componentCommunicationService: ComponentCommunicationService,
    public tokenCheckService: TokenCheckService) {
    super(router, componentCommunicationService, tokenCheckService);
    this.className = className;
  }

  ngOnInit(): void {
    super.ngOnInit();
    const storedPageNumber = this.componentCommunicationService.getPageNumber(this.className);
    if (storedPageNumber !== undefined) {
      this.pageNumber = storedPageNumber;
    }
    this.loadPageData();
  }
}
