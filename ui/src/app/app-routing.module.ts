import {BootupsComponent} from "./bootups/bootups.component";
import {CropAddComponent} from "./crop/add/add.component";
import {CropEditComponent} from "./crop/edit/edit.component";
import {DeviceAddComponent} from "./device/add/add.component";
import {DeviceEditComponent} from "./device/edit/edit.component";
import {DeviceListComponent} from "./device/list/list.component";
import {DeviceViewComponent} from "./device/view/view.component";
import {HistoryComponent} from "./history/history.component";
import {LoginComponent} from "./login/login.component";
import {LogoutComponent} from "./logout/logout.component";
import {NgModule} from "@angular/core";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {PingsComponent} from "./pings/pings.component";
import {PlantMaintenanceAddComponent} from "./plant-maintenance/add/add.component";
import {PlantMaintenanceEditComponent} from "./plant-maintenance/edit/edit.component";
import {PlantMaintenanceListComponent} from "./plant-maintenance/list/list.component";
import {PumpActionsComponent} from "./pump-actions/pump-actions.component";
import {Routes, RouterModule} from "@angular/router";
import {SeasonAddComponent} from "./season/add/add.component";
import {SeasonEditComponent} from "./season/edit/edit.component";
import {SeasonListComponent} from "./season/list/list.component";
import {SeasonViewComponent} from "./season/view/view.component";
import {SensorReportsComponent} from "./sensor-reports/sensor-reports.component";
import {SettingsAddComponent} from "./settings/add/add.component";
import {SettingsEditComponent} from "./settings/edit/edit.component";
import {SettingsListComponent} from "./settings/list/list.component";
import {StatusComponent} from "./status/status.component";

const routes: Routes = [
	
	// Order here is important
	
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
		component: DeviceListComponent
	},
	{
		path: 'devices/add',
		component: DeviceAddComponent
	},
	{
		path: 'devices/:id',
		component: DeviceViewComponent
	},
	{
		path: 'devices/:id/edit',
		component: DeviceEditComponent
	},
	{
		path: 'settings',
		component: SettingsListComponent
	},
	{
		path: 'settings/add',
		component: SettingsAddComponent
	},
	{
		path: 'settings/:key/edit',
		component: SettingsEditComponent
	},
	{
		path: 'history',
		component: HistoryComponent
	},
	{
		path: 'devices/:id/maintenance',
		component: PlantMaintenanceListComponent
	},
	{
		path: 'devices/:id/maintenance/add',
		component: PlantMaintenanceAddComponent
	},
	{
		path: 'devices/:id/maintenance/:maintenanceid/edit',
		component: PlantMaintenanceEditComponent
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
		component: SeasonListComponent
	},
	{
		path: 'devices/:id/seasons/add',
		component: SeasonAddComponent
	},
	{
		path: 'devices/:id/seasons/:seasonid',
		component: SeasonViewComponent
	},
	{
		path: 'devices/:id/seasons/:seasonid/crop/add',
		component: CropAddComponent
	},
	{
		path: 'devices/:id/seasons/:seasonid/crop/:cropid/edit',
		component: CropEditComponent
	},
	{
		path: 'devices/:id/seasons/:seasonid/edit',
		component: SeasonEditComponent
	},
	{
		path: 'status',
		component: StatusComponent
	},
	{
		path: '',
		redirectTo: '/status', pathMatch: 'full'
	},
	{   
		path: '**', 
	    component: PageNotFoundComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
