import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JpnicService {

  constructor(
    private http: HttpClient
  ) {
  }

  updateJPNICAdmin(id, body): Promise<any> {
    return this.http.put(environment.api.url + environment.api.path + '/jpnic_admin/' + id, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
    }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      return error;
    });
  }

  updateJPNICTech(id, body): Promise<any> {
    return this.http.put(environment.api.url + environment.api.path + '/jpnic_tech/' + id, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
    }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      return error;
    });
  }
}
