import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app-routing.module";
import {BootupsComponent} from './bootups/bootups.component';
import {BrowserModule} from "@angular/platform-browser";
import {CropAddComponent} from './crop/add/add.component';
import {CropEditComponent} from './crop/edit/edit.component';
import {DataService} from "./service/data.service";
import {DeviceAddComponent} from "./device/add/add.component";
import {DeviceEditComponent} from './device/edit/edit.component';
import {DeviceListComponent} from "./device/list/list.component";
import {DeviceNameHeaderComponent} from './device-name-header/device-name-header.component';
import {DeviceViewComponent} from "./device/view/view.component";
import {HistoryComponent} from "./history/history.component";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {PingsComponent} from './pings/pings.component';
import {PlantMaintenanceAddComponent} from "./plant-maintenance/add/add.component";
import {PlantMaintenanceEditComponent} from "./plant-maintenance/edit/edit.component";
import {PlantMaintenanceListComponent} from "./plant-maintenance/list/list.component";
import {PumpActionsComponent} from './pump-actions/pump-actions.component';
import {ReactiveFormsModule} from "@angular/forms";
import {SeasonAddComponent} from './season/add/add.component';
import {SeasonEditComponent} from './season/edit/edit.component';
import {SeasonListComponent} from './season/list/list.component';
import {SeasonViewComponent} from './season/view/view.component';
import {SensorReportsComponent} from './sensor-reports/sensor-reports.component';
import {SettingsAddComponent} from './settings/add/add.component';
import {SettingsEditComponent} from './settings/edit/edit.component';
import {SettingsListComponent} from "./settings/list/list.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {StatusComponent} from "./status/status.component";
import {TokenInterceptor} from "./core/interceptor";

@NgModule({
  declarations: [
    AppComponent,
    BootupsComponent,
    CropAddComponent,
    CropEditComponent,
    DeviceAddComponent,
    DeviceEditComponent,
    DeviceListComponent,
    DeviceNameHeaderComponent,
    DeviceViewComponent,
    HistoryComponent,
    LoginComponent,
    LogoutComponent,
    PageNotFoundComponent,
    PingsComponent,
    PlantMaintenanceAddComponent,
    PlantMaintenanceEditComponent,
    PlantMaintenanceListComponent,
    PumpActionsComponent,
    SeasonAddComponent,
    SeasonEditComponent,
    SeasonListComponent,
    SeasonViewComponent,
    SensorReportsComponent,
    SettingsAddComponent,
    SettingsEditComponent,
    SettingsListComponent,
    SidebarComponent,
    StatusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [DataService, {provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi : true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
