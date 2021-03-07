import {Component, OnInit} from '@angular/core';
import {BasePageable} from "../base/base-pageable";
import {TokenCheckService} from "../service/token-check.service";
import {ComponentCommunicationService} from "../service/component-communication.service";
import {Router} from "@angular/router";
import {PageEvent} from '@angular/material/paginator';

export abstract class BasePageableStorable extends BasePageable implements OnInit {
  
}
