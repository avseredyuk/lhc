import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {DevicesComponent} from "./devices/devices.component";
import {DeviceComponent} from "./device/device.component";
import {EditDeviceComponent} from "./edit-device/edit-device.component";
import {AddDeviceComponent} from "./add-device/add-device.component";
import {HistoryComponent} from "./history/history.component";
import {PlantMaintenanceComponent} from "./plant-maintenance/plant-maintenance.component";
import {AddPlantMaintenanceComponent} from "./add-plant-maintenance/add-plant-maintenance.component";
import {EditPlantMaintenanceComponent} from "./edit-plant-maintenance/edit-plant-maintenance.component";
import {SettingsComponent} from "./settings/settings.component";
import {AddSettingsComponent} from "./add-settings/add-settings.component";
import {EditSettingsComponent} from "./edit-settings/edit-settings.component";
import {StatusComponent} from "./status/status.component";
import {PingsComponent} from "./pings/pings.component";
import {BootupsComponent} from "./bootups/bootups.component";
import {PumpActionsComponent} from "./pump-actions/pump-actions.component";
import {SensorReportsComponent} from "./sensor-reports/sensor-reports.component";
import {SeasonsComponent} from "./seasons/seasons.component";
import {AddSeasonComponent} from "./add-season/add-season.component";
import {SeasonComponent} from "./season/season.component";
import {AddCropComponent} from "./add-crop/add-crop.component";
import {EditCropComponent} from "./edit-crop/edit-crop.component";
import {EditSeasonComponent} from "./edit-season/edit-season.component";

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'logout',
		component: LogoutComponent
	},
	{
		path: 'devices',
		component: DevicesComponent
	},
	{
		path: 'devices/:id',
		component: DeviceComponent
	},
	{
		path: 'devices/:id/edit',
		component: EditDeviceComponent
	},
	{
		path: 'add-device',
		component: AddDeviceComponent
	},
	{
		path: 'settings',
		component: SettingsComponent
	},
	{
		path: 'add-settings',
		component: AddSettingsComponent
	},
	{
		path: 'edit-settings/:key',
		component: EditSettingsComponent
	},
	{
		path: 'history',
		component: HistoryComponent
	},
	{
		path: 'devices/:id/maintenance',
		component: PlantMaintenanceComponent
	},
	{
		path: 'add-plant-maintenance/:id',
		component: AddPlantMaintenanceComponent
	},
	{
		path: 'edit-plant-maintenance/:id/:deviceId',
		component: EditPlantMaintenanceComponent
	},
	{
		path: 'devices/:id/pings',
		component: PingsComponent
	},
	{
		path: 'devices/:id/bootups',
		component: BootupsComponent
	},
	{
		path: 'devices/:id/pumpactions',
		component: PumpActionsComponent
	},
	{
		path: 'devices/:id/sensorreports',
		component: SensorReportsComponent
	},
	{
		path: 'devices/:id/seasons',
		component: SeasonsComponent
	},
	{
		path: 'add-season/:deviceid',
		component: AddSeasonComponent
	},
	{
		path: 'devices/:id/seasons/:seasonid',
		component: SeasonComponent
	},
	{
		path: 'add-crop/:deviceid/:seasonid',
		component: AddCropComponent
	},
	{
		path: 'edit-crop/:deviceid/:seasonid/:cropid',
		component: EditCropComponent
	},
	{
		path: 'edit-season/:deviceid/:seasonid',
		component: EditSeasonComponent
	},
	{
		path: '',
		component: StatusComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
