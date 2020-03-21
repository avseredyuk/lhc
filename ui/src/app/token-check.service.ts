import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TokenCheckService {

  isExpiredToken(): Boolean {//todo: being called thousands times
  	let tokenObject = JSON.parse(localStorage.getItem("token"));
  	if (!tokenObject) {
  	  return true;
  	}
    let tokenDate = new Date(tokenObject.timestamp);
    let nowDate = new Date();
    tokenDate.setSeconds(tokenDate.getSeconds() + 30*24*60*60);
    return nowDate.getTime() > tokenDate.getTime();
  }

  getToken(): string {
	  let tokenObject = JSON.parse(localStorage.getItem("token"));
	  return tokenObject.token;
  }

  saveToken(tokenData: any) {
  	var tokenObject = {token: tokenData.token, timestamp: new Date().getTime()}
    window.localStorage.setItem('token', JSON.stringify(tokenObject));
  }

  removeToken() {
    window.localStorage.removeItem('token');
  }

}
