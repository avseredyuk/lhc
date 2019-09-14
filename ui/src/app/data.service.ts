import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Device} from "./model/device";
import {TokenResponse} from "./model/token-response";
import {History} from "./model/history";
import {Configuration} from "./model/configuration";
import {ApiResult} from "./model/api-result";
import {Status} from "./model/status";
import {PlantMaintenance} from "./model/plant-maintenance";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getStatus(): Observable<Status> {
    return this.http.get<Status>(environment.apiUrl + 'status');
  }

  login(loginPayload) : Observable<TokenResponse> {
    return this.http.post<TokenResponse>(environment.apiUrl + 'admin/generate-token', loginPayload);
  }

  getConfiguration(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(environment.apiUrl + 'admin/configs');
  }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(environment.apiUrl + 'admin/devices');
  }

  getActiveDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(environment.apiUrl + 'admin/devices/active');
  }

  getDevice(deviceId): Observable<ApiResult<Device>> {
    return this.http.get<ApiResult<Device>>(environment.apiUrl + 'admin/devices/' + deviceId);
  }

  createDevice(device: Device): Observable<ApiResult<Device>> {
    return this.http.post<ApiResult<Device>>(environment.apiUrl + 'admin/devices', device);
  }

  enableRunPumpOnce(device: Device): Observable<ApiResult<Device>> {
    return this.http.put<ApiResult<Device>>(environment.apiUrl + 'admin/devices/' + device.id + '/runPumpOnce', '');
  }

  getHistory(): Observable<History[]> {
    return this.http.get<History[]>(environment.apiUrl + 'admin/history');
  }

  /* Plant Maintenance */

  getPlantMaintenances(): Observable<any> { //todo: why here any?
    return this.http.get<any>(environment.apiUrl + 'admin/maintenance');
  }

  getPlantMaintenance(plantMaintenanceId): Observable<ApiResult<PlantMaintenance>> {
    return this.http.get<ApiResult<PlantMaintenance>>(environment.apiUrl + 'admin/maintenance/' + plantMaintenanceId);
  }

  createPlantMaintenance(plantMaintenance: PlantMaintenance): Observable<ApiResult<PlantMaintenance>> {
    return this.http.post<ApiResult<PlantMaintenance>>(environment.apiUrl + 'admin/maintenance', plantMaintenance);
  }

  deletePlantMaintenance(plantMaintenance: PlantMaintenance) {
    return this.http.delete(environment.apiUrl + 'admin/maintenance/' + plantMaintenance.id);
  }
}
