import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {DevicesComponent} from "./devices/devices.component";
import {DeviceComponent} from "./device/device.component";
import {AddDeviceComponent} from "./add-device/add-device.component";
import {HistoryComponent} from "./history/history.component";
import {PlantMaintenancesComponent} from "./plant-maintenances/plant-maintenances.component";
import {AddPlantMaintenanceComponent} from "./add-plant-maintenance/add-plant-maintenance.component";
import {EditPlantMaintenanceComponent} from "./edit-plant-maintenance/edit-plant-maintenance.component";
import {SettingsComponent} from "./settings/settings.component";
import {StatusComponent} from "./status/status.component";

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
		path: 'add-device',
		component: AddDeviceComponent
	},
	{
		path: 'settings',
		component: SettingsComponent
	},
	{
		path: 'history',
		component: HistoryComponent
	},
	{
		path: 'maintenance',
		component: PlantMaintenancesComponent
	},
	{
		path: 'add-plant-maintenance/:id',
		component: AddPlantMaintenanceComponent
	},
	{
		path: 'edit-plant-maintenance/:id',
		component: EditPlantMaintenanceComponent
	},
	{
		path: '',
		component: StatusComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
