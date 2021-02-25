import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DataService} from "../service/data.service";
import {TokenCheckService} from "../service/token-check.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router, private tokenCheckService: TokenCheckService) { }

  ngOnInit() {
    this.tokenCheckService.removeToken();
    this.router.navigate(['/']);
  }

}
