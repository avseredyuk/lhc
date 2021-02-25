import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import {Observable} from "rxjs/internal/Observable";
import {Injectable} from "@angular/core";
import {tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {TokenCheckService} from "../service/token-check.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private router: Router, private tokenCheckService: TokenCheckService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.tokenCheckService.isExpiredToken()) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + this.tokenCheckService.getToken()
        }
      });
    }
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do nothing
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.router.navigate(['login']);
            return;
          }
        }
      }));
  }
}
