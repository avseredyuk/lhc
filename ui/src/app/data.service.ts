import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Device} from "./model/device";
import {TokenResponse} from "./model/token-response";
import {History} from "./model/history";
import {Configuration} from "./model/configuration";
import {ApiResult} from "./model/api-result";
import {Status} from "./model/status";
import {Page} from "./model/page";
import {PlantMaintenance} from "./model/plant-maintenance";
import {Ping} from "./model/ping";
import {PumpAction} from "./model/pump-action";
import {SensorReport} from "./model/sensor-report";
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

  getDevice(deviceId): Observable<ApiResult<Device>> {
    return this.http.get<ApiResult<Device>>(environment.apiUrl + 'admin/devices/' + deviceId);
  }

  createDevice(device: Device): Observable<ApiResult<Device>> {
    return this.http.post<ApiResult<Device>>(environment.apiUrl + 'admin/devices', device);
  }

  enableRunPumpOnce(device: Device): Observable<ApiResult<Boolean>> {
    return this.http.put<ApiResult<Boolean>>(environment.apiUrl + 'admin/devices/' + device.id + '/runPumpOnce', '');
  }

  getHistory(): Observable<History[]> {
    return this.http.get<History[]>(environment.apiUrl + 'admin/history');
  }

  getHistorySince(sinceTimestamp): Observable<History[]> {
    return this.http.get<History[]>(environment.apiUrl + 'admin/history?sinceTimestamp=' + sinceTimestamp);
  }

  /* Plant Maintenance */

  getPlantMaintenancesByDeviceId(deviceId, page): Observable<Page<PlantMaintenance[]>> {
    return this.http.get<Page<PlantMaintenance[]>>(environment.apiUrl + 'admin/devices/' + deviceId + '/maintenance?size=10&page=' + page);
  }

  getPlantMaintenance(deviceId, plantMaintenanceId): Observable<ApiResult<PlantMaintenance>> {
    return this.http.get<ApiResult<PlantMaintenance>>(environment.apiUrl + 'admin/devices/' + deviceId + '/maintenance/' + plantMaintenanceId);
  }

  createPlantMaintenance(plantMaintenance: PlantMaintenance): Observable<ApiResult<PlantMaintenance>> {
    return this.http.post<ApiResult<PlantMaintenance>>(environment.apiUrl + 'admin/devices/' + plantMaintenance.deviceId + '/maintenance', plantMaintenance);
  }

  deletePlantMaintenance(plantMaintenance: PlantMaintenance) {
    return this.http.delete(environment.apiUrl + 'admin/devices/' + plantMaintenance.deviceId + '/maintenance/' + plantMaintenance.id);
  }

  /* Pings */

  getPingsByDeviceId(deviceId, page): Observable<Page<Ping[]>> {
    return this.http.get<Page<Ping[]>>(environment.apiUrl + 'admin/devices/' + deviceId + '/pings?size=10&page=' + page);
  }

  /* Pump Actions */

  getPumpActionsByDeviceId(deviceId, page): Observable<Page<PumpAction[]>> {
    return this.http.get<Page<PumpAction[]>>(environment.apiUrl + 'admin/devices/' + deviceId + '/pumpactions?size=10&page=' + page);
  }

  /* Sensor Reports */

  getSensorReportsByDeviceId(deviceId, page): Observable<Page<SensorReport[]>> {
    return this.http.get<Page<SensorReport[]>>(environment.apiUrl + 'admin/devices/' + deviceId + '/sensorreports?size=10&page=' + page);
  }

  /* System */

  clearCache(): Observable<ApiResult<Boolean>> {
    return this.http.post<ApiResult<Boolean>>(environment.apiUrl + 'admin/clearcache', '');
  }
}
