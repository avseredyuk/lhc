import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {Configuration} from "../model/configuration";
import {DataService} from "../data.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  configurations: Configuration[];

  constructor(private router: Router, private dataService: DataService) { }

  ngOnInit() {
    if (!window.localStorage.getItem('token')) {
      this.router.navigate(['login']);
      return;
    }

    this.dataService.getConfiguration().subscribe(
  		data => this.configurations = data
  	);
  }

}
