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
import {Bootup} from "./model/bootup";
import {PumpAction} from "./model/pump-action";
import {SensorReport} from "./model/sensor-report";
import {environment} from "../environments/environment";
import {Crop, Season, SeasonStatistics} from "./model/season";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public adminApiUrl: string = environment.apiUrl + "admin/";

  constructor(private http: HttpClient) { }

  getStatus(): Observable<Status> {
    return this.http.get<Status>(environment.apiUrl + 'status');
  }

  login(loginPayload) : Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.adminApiUrl + 'generate-token', loginPayload);
  }

  getHistory(): Observable<History[]> {
    return this.http.get<History[]>(this.adminApiUrl + 'history');
  }

  getHistorySince(sinceTimestamp): Observable<History[]> {
    return this.http.get<History[]>(this.adminApiUrl + 'history?sinceTimestamp=' + sinceTimestamp);
  }

  /* Device */

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.adminApiUrl + 'devices');
  }

  getDevice(deviceId: number): Observable<ApiResult<Device>> {
    return this.http.get<ApiResult<Device>>(this.adminApiUrl + 'devices/' + deviceId);
  }

  getDeviceName(deviceId: number): Observable<ApiResult<Device>> {
    return this.http.get<ApiResult<Device>>(this.adminApiUrl + 'devices/' + deviceId + '/name');
  }

  createDevice(device: Device): Observable<ApiResult<Device>> {
    return this.http.post<ApiResult<Device>>(this.adminApiUrl + 'devices', device);
  }

  enableRunPumpOnce(deviceId: number): Observable<ApiResult<Boolean>> {
    return this.http.put<ApiResult<Boolean>>(this.adminApiUrl + 'devices/' + deviceId + '/runPumpOnce', '');
  }

  deleteDevice(device: Device) {
    return this.http.delete(this.adminApiUrl + 'devices/' + device.id);
  }

  updateDevice(device: Device): Observable<ApiResult<Device>> {
    return this.http.put<ApiResult<Device>>(this.adminApiUrl + 'devices/' + device.id, device);
  }

  /* Configurations */

  getConfiguration(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(this.adminApiUrl + 'configs');
  }

  getConfigurationByKey(settingsKey: string): Observable<ApiResult<Configuration>> {
    return this.http.get<ApiResult<Configuration>>(this.adminApiUrl + 'configs/' + settingsKey);
  }

  updateConfiguration(configuration: Configuration): Observable<ApiResult<Configuration>> {
    return this.http.put<ApiResult<Configuration>>(this.adminApiUrl + 'configs', configuration);
  }

  createConfiguration(configuration: Configuration): Observable<ApiResult<Configuration>> {
    return this.http.post<ApiResult<Configuration>>(this.adminApiUrl + 'configs', configuration);
  }

  deleteConfiguration(configuration: Configuration) {
    return this.http.delete(this.adminApiUrl + 'configs/' + configuration.key);
  }

  /* Plant Maintenance */

  getPlantMaintenancesByDeviceId(deviceId, page): Observable<Page<PlantMaintenance[]>> {
    return this.http.get<Page<PlantMaintenance[]>>(this.adminApiUrl + 'maintenance?deviceId=' + deviceId + '&size=10&page=' + page);
  }

  getPlantMaintenance(deviceId, plantMaintenanceId): Observable<ApiResult<PlantMaintenance>> {
    return this.http.get<ApiResult<PlantMaintenance>>(this.adminApiUrl + 'maintenance/' + plantMaintenanceId);
  }

  createPlantMaintenance(plantMaintenance: PlantMaintenance): Observable<ApiResult<PlantMaintenance>> {
    return this.http.post<ApiResult<PlantMaintenance>>(this.adminApiUrl + 'maintenance', plantMaintenance);
  }

  updatePlantMaintenance(plantMaintenance: PlantMaintenance): Observable<ApiResult<PlantMaintenance>> {
    return this.http.put<ApiResult<PlantMaintenance>>(this.adminApiUrl + 'maintenance', plantMaintenance);
  }

  deletePlantMaintenance(plantMaintenance: PlantMaintenance) {
    return this.http.delete(this.adminApiUrl + 'maintenance/' + plantMaintenance.id);
  }

  /* Crop */

  createCrop(crop: Crop): Observable<ApiResult<Crop>> {
    return this.http.post<ApiResult<Crop>>(this.adminApiUrl + 'crop', crop);
  }

  getCropsBySeasonId(seasonId, page): Observable<Page<Crop[]>> {
    return this.http.get<Page<Crop[]>>(this.adminApiUrl + 'crop?seasonId=' + seasonId + '&size=10&page=' + page);
  }

  deleteCrop(cropId: number) {
    return this.http.delete(this.adminApiUrl + 'crop/' + cropId);
  }

  getCrop(cropId): Observable<ApiResult<Crop>> {
    return this.http.get<ApiResult<Crop>>(this.adminApiUrl + 'crop/' + cropId);
  }

  updateCrop(crop: Crop): Observable<ApiResult<Crop>> {
    return this.http.put<ApiResult<Crop>>(this.adminApiUrl + 'crop/' + crop.id, crop);
  }

  /* Season */

  getSeasonsByDeviceId(deviceId, page): Observable<Page<Season[]>> {
    return this.http.get<Page<Season[]>>(this.adminApiUrl + 'season?deviceId=' + deviceId + '&size=10&page=' + page);
  }

  createSeason(season: Season): Observable<ApiResult<Season>> {
    return this.http.post<ApiResult<Season>>(this.adminApiUrl + 'season', season);
  }

  getSeasonName(seasonId): Observable<ApiResult<Season>> {
    return this.http.get<ApiResult<Season>>(this.adminApiUrl + 'season/' + seasonId + '/name');
  }

  getSeasonStatistics(seasonId): Observable<ApiResult<SeasonStatistics>> {
    return this.http.get<ApiResult<SeasonStatistics>>(this.adminApiUrl + 'season/' + seasonId + '/stats');
  }

  getSeason(seasonId): Observable<ApiResult<Season>> {
    return this.http.get<ApiResult<Season>>(this.adminApiUrl + 'season/' + seasonId);
  }

  updateSeason(season: Season): Observable<ApiResult<Season>> {
    return this.http.put<ApiResult<Season>>(this.adminApiUrl + 'season/' + season.id, season);
  }

  deleteSeason(seasonId: number) {
    return this.http.delete(this.adminApiUrl + 'season/' + seasonId);
  }


  /* Pings */

  getPingsByDeviceId(deviceId, page): Observable<Page<Ping[]>> {
    return this.http.get<Page<Ping[]>>(this.adminApiUrl + 'pings?deviceId=' + deviceId + '&size=10&page=' + page);
  }

  /* Bootups */

  getBootupsByDeviceId(deviceId, page): Observable<Page<Bootup[]>> {
    return this.http.get<Page<Bootup[]>>(this.adminApiUrl + 'bootups?deviceId=' + deviceId + '&size=10&page=' + page);
  }

  /* Pump Actions */

  getPumpActionsByDeviceId(deviceId, page): Observable<Page<PumpAction[]>> {
    return this.http.get<Page<PumpAction[]>>(this.adminApiUrl + 'pumpactions?deviceId=' + deviceId + '&size=10&page=' + page);
  }

  /* Sensor Reports */

  getSensorReportsByDeviceId(deviceId, page): Observable<Page<SensorReport[]>> {
    return this.http.get<Page<SensorReport[]>>(this.adminApiUrl + 'sensorreports?deviceId=' + deviceId + '&size=10&page=' + page);
  }

  /* System */

  clearCache(): Observable<ApiResult<Boolean>> {
    return this.http.post<ApiResult<Boolean>>(this.adminApiUrl + 'clearcache', '');
  }
}
