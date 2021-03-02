import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TokenCheckService {

  isExpiredToken(): boolean {
  	const tokenObject = JSON.parse(localStorage.getItem("token"));
  	if (!tokenObject) {
  	  return true;
  	}
    const tokenDate = new Date(tokenObject.timestamp);
    const nowDate = new Date();
    tokenDate.setSeconds(tokenDate.getSeconds() + 30*24*60*60);
    return nowDate.getTime() > tokenDate.getTime();
  }

  getRawToken(): string {
    return window.localStorage.getItem('token');
  }

  getToken(): string {
	  const tokenObject = JSON.parse(localStorage.getItem("token"));
    return tokenObject.token;
  }

  saveToken(tokenData: any): void {
  	const tokenObject = {token: tokenData.token, timestamp: new Date().getTime()}
    window.localStorage.setItem('token', JSON.stringify(tokenObject));
  }

  removeToken(): void {
    window.localStorage.removeItem('token');
  }

}
