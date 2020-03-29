import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ComponentCommunicationService {
	private map: Map<String, any> = new Map();

	getValue(key: string) {
		let value = this.map.get(key);
		this.map.delete(key);
		return value;
	}

	setValue(key: string, value: any) {
		this.map.set(key, value);
	}

	getNotification(): any {
		return this.getValue("notification");
	}

	setNotification(notification: any) {
		this.setValue("notification", notification);
	}

	getClonedMaintenance(): any {
		return this.getValue("clonedMaintenance");
	}

	setClonedMaintenance(cloned: any) {
		this.setValue("clonedMaintenance", cloned);
	}
}
