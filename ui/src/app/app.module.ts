import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {SidebarComponent} from "./sidebar/sidebar.component";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {TokenInterceptor} from "./core/interceptor";
import {ReactiveFormsModule} from "@angular/forms";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {DataService} from "./data.service";
import {DevicesComponent} from "./devices/devices.component";
import {DeviceComponent} from "./device/device.component";
import {AddDeviceComponent} from "./add-device/add-device.component";
import {HistoryComponent} from "./history/history.component";
import {SettingsComponent} from "./settings/settings.component";
import {StatusComponent} from "./status/status.component";
import {PlantMaintenanceComponent} from "./plant-maintenance/plant-maintenance.component";
import {AddPlantMaintenanceComponent} from "./add-plant-maintenance/add-plant-maintenance.component";
import {EditPlantMaintenanceComponent} from "./edit-plant-maintenance/edit-plant-maintenance.component";

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    LoginComponent,
    LogoutComponent,
    DevicesComponent,
    DeviceComponent,
    AddDeviceComponent,
    HistoryComponent,
    SettingsComponent,
    StatusComponent,
    PlantMaintenanceComponent,
    AddPlantMaintenanceComponent,
    EditPlantMaintenanceComponent,
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
