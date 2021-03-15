import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Device} from "../model/device";
import {TokenResponse} from "../model/token-response";
import {History} from "../model/history";
import {Configuration} from "../model/configuration";
import {ApiResult} from "../model/api-result";
import {Status} from "../model/status";
import {Page} from "../model/page";
import {PlantMaintenance} from "../model/plant-maintenance";
import {Ping} from "../model/ping";
import {Bootup} from "../model/bootup";
import {PumpAction} from "../model/pump-action";
import {SensorReport} from "../model/sensor-report";
import {environment} from "../../environments/environment";
import {Crop, Season, Statistics} from "../model/season";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public adminApiUrl: string = environment.apiUrl + "admin/";

  constructor(private http: HttpClient) { }

  getStatus(): Observable<Status> {
    return this.http.get<Status>(environment.apiUrl + 'status');
  }

  login(loginPayload): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.adminApiUrl + 'generate-token', loginPayload);
  }

  getHistory(): Observable<History[]> {
    return this.http.get<History[]>(this.adminApiUrl + 'history');
  }

  getHistorySince(sinceTimestamp): Observable<History[]> {
    return this.http.get<History[]>(this.adminApiUrl + 'history?sinceTimestamp=' + sinceTimestamp);
  }

  /* Device */

  getDevices(pageNumber: number, pageSize: number): Observable<Page<Device[]>> {
    return this.http.get<Page<Device[]>>(this.adminApiUrl + 'devices?size=' + pageSize + '&page=' + pageNumber);
  }

  getDevice(deviceId: number): Observable<ApiResult<Device>> {
    return this.http.get<ApiResult<Device>>(this.adminApiUrl + 'devices/' + deviceId);
  }

  getDeviceName(deviceId: number): Observable<ApiResult<Device>> {
    return this.http.get<ApiResult<Device>>(this.adminApiUrl + 'devices/' + deviceId + '/full-name');
  }

  createDevice(device: Device): Observable<ApiResult<Device>> {
    return this.http.post<ApiResult<Device>>(this.adminApiUrl + 'devices', device);
  }

  enableRunPumpOnce(deviceId: number): Observable<ApiResult<boolean>> {
    return this.http.put<ApiResult<boolean>>(this.adminApiUrl + 'devices/' + deviceId + '/run-pump-once', '');
  }

  deleteDevice(device: Device) {
    return this.http.delete(this.adminApiUrl + 'devices/' + device.id);
  }

  updateDevice(device: Device): Observable<ApiResult<Device>> {
    return this.http.put<ApiResult<Device>>(this.adminApiUrl + 'devices/' + device.id, device);
  }

  /* Configurations */

  getConfiguration(pageNumber: number, pageSize: number): Observable<Page<Configuration[]>> {
    return this.http.get<Page<Configuration[]>>(
      this.adminApiUrl + 'configs?size=' + pageSize + '&page=' + pageNumber);
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

  getPlantMaintenancesByDeviceId(deviceId: number, pageNumber: number, pageSize: number): Observable<Page<PlantMaintenance[]>> {
    return this.http.get<Page<PlantMaintenance[]>>(
      this.adminApiUrl + 'maintenance?deviceId=' + deviceId + '&size=' + pageSize + '&page=' + pageNumber);
  }

  getPlantMaintenance(deviceId: number, plantMaintenanceId: number): Observable<ApiResult<PlantMaintenance>> {
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

  getCropsBySeasonId(seasonId: number, pageNumber: number, pageSize: number): Observable<Page<Crop[]>> {
    return this.http.get<Page<Crop[]>>(
      this.adminApiUrl + 'crop?seasonId=' + seasonId + '&size=' + pageSize + '&page=' + pageNumber);
  }

  deleteCrop(cropId: number) {
    return this.http.delete(this.adminApiUrl + 'crop/' + cropId);
  }

  getCrop(cropId: number): Observable<ApiResult<Crop>> {
    return this.http.get<ApiResult<Crop>>(this.adminApiUrl + 'crop/' + cropId);
  }

  updateCrop(crop: Crop): Observable<ApiResult<Crop>> {
    return this.http.put<ApiResult<Crop>>(this.adminApiUrl + 'crop/' + crop.id, crop);
  }

  /* Season */

  getSeasonsByDeviceId(deviceId: number, pageNumber: number, pageSize: number): Observable<Page<Season[]>> {
    return this.http.get<Page<Season[]>>(
      this.adminApiUrl + 'season?deviceId=' + deviceId + '&size=' + pageSize + '&page=' + pageNumber);
  }

  createSeason(season: Season): Observable<ApiResult<Season>> {
    return this.http.post<ApiResult<Season>>(this.adminApiUrl + 'season', season);
  }

  getSeasonName(seasonId: number): Observable<ApiResult<Season>> {
    return this.http.get<ApiResult<Season>>(this.adminApiUrl + 'season/' + seasonId + '/name');
  }

  getSeasonStatistics(seasonId: number): Observable<ApiResult<Statistics>> {
    return this.http.get<ApiResult<Statistics>>(this.adminApiUrl + 'season/' + seasonId + '/stats');
  }

  getSeasonsStatistics(deviceId: number): Observable<ApiResult<Statistics>> {
    return this.http.get<ApiResult<Statistics>>(this.adminApiUrl + 'seasons/' + deviceId + '/stats');
  }

  getSeason(seasonId: number): Observable<ApiResult<Season>> {
    return this.http.get<ApiResult<Season>>(this.adminApiUrl + 'season/' + seasonId);
  }

  updateSeason(season: Season): Observable<ApiResult<Season>> {
    return this.http.put<ApiResult<Season>>(this.adminApiUrl + 'season/' + season.id, season);
  }

  deleteSeason(seasonId: number) {
    return this.http.delete(this.adminApiUrl + 'season/' + seasonId);
  }


  /* Pings */

  getPingsByDeviceId(deviceId: number, pageNumber: number, pageSize: number): Observable<Page<Ping[]>> {
    return this.http.get<Page<Ping[]>>(
      this.adminApiUrl + 'pings?deviceId=' + deviceId + '&size=' + pageSize + '&page=' + pageNumber);
  }

  /* Bootups */

  getBootupsByDeviceId(deviceId: number, pageNumber: number, pageSize: number): Observable<Page<Bootup[]>> {
    return this.http.get<Page<Bootup[]>>(
      this.adminApiUrl + 'bootups?deviceId=' + deviceId + '&size=' + pageSize + '&page=' + pageNumber);
  }

  deleteBootup(bootup) {
    return this.http.delete(this.adminApiUrl + 'bootups/' + bootup.id);
  }

  /* Pump Actions */

  getPumpActionsByDeviceId(deviceId: number, pageNumber: number, pageSize: number): Observable<Page<PumpAction[]>> {
    return this.http.get<Page<PumpAction[]>>(
      this.adminApiUrl + 'pump-actions?deviceId=' + deviceId + '&size=' + pageSize + '&page=' + pageNumber);
  }

  deletePumpAction(pumpAction) {
    return this.http.delete(this.adminApiUrl + 'pump-actions/' + pumpAction.id);
  }

  /* Sensor Reports */

  getSensorReportsByDeviceId(deviceId: number, pageNumber: number, pageSize: number): Observable<Page<SensorReport[]>> {
    return this.http.get<Page<SensorReport[]>>(
      this.adminApiUrl + 'sensor-reports?deviceId=' + deviceId + '&size=' + pageSize + '&page=' + pageNumber);
  }

  deleteSensorReport(sensorReport) {
    return this.http.delete(this.adminApiUrl + 'sensor-reports/' + sensorReport.id);
  }

  /* System */

  clearCache(): Observable<ApiResult<boolean>> {
    return this.http.post<ApiResult<boolean>>(this.adminApiUrl + 'clear-cache', '');
  }
}
