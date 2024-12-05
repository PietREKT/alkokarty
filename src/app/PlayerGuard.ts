import {Injectable} from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import {RxStompService} from "./rx-stomp.service";
import {catchError, map, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class PlayerGuard implements CanActivate {
  constructor(private router: Router, private http: HttpClient) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    let token = sessionStorage.getItem("cardsToken");
    if (token == null) {
      console.error("Token is null. Returning false")
      return of(false);
    }
    return this.http.get<boolean>('http://localhost:8080/player/validate', {
      params: {token}
    })
      .pipe(
        map(valid => {
          if (!valid) {
            this.router.navigate([''])
          }
          return valid;
        }),
        catchError(err => {
          console.error(err);
          this.router.navigate(['']);
          return of(false);
        })
      );
  }
}
