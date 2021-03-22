import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {CommonService} from './common.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    public router: Router,
    private commonService: CommonService,
    private http: HttpClient
  ) {
  }

  create(id, body): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/group/' + id + '/service',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      console.log(error);
      this.commonService.openBar('エラーが発生しました。F12でDebugできます。', 5000);
    });
  }

  createIP(id, body): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/service/' + id + '/ip',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      console.log(error);
      this.commonService.openBar('エラーが発生しました。F12でDebugできます。', 5000);
    });
  }

  createPlan(data): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/plan',
      data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  createJPNICAdmin(id, body): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/service/' + id + '/jpnic_admin',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      console.log(error);
      this.commonService.openBar('エラーが発生しました。F12でDebugできます。', 5000);
    });
  }

  createJPNICTech(id, body): Promise<any> {
    return this.http.post(environment.api.url + environment.api.path + '/service/' + id + '/jpnic_tech',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      console.log(error);
      this.commonService.openBar('エラーが発生しました。F12でDebugできます。', 5000);
    });
  }

  get(uid): Promise<any> {
    return this.http.get(environment.api.url + environment.api.path + '/service/' + uid, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
    }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  getAll(): Promise<any> {
    return this.http.get(environment.api.url + environment.api.path + '/service', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
      }),
    }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  update(id, data): Promise<any> {
    return this.http.put(environment.api.url + environment.api.path + '/service/' + id,
      data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  updateIP(id, ipID, data): Promise<any> {
    return this.http.put(environment.api.url + environment.api.path + '/service/' + id + '/ip/' + ipID,
      data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  updatePlan(id, data): Promise<any> {
    return this.http.put(environment.api.url + environment.api.path + '/plan/' + id,
      data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  updateJPNICAdmin(id, jpnicID, data): Promise<any> {
    return this.http.put(environment.api.url + environment.api.path + '/service/' + id + '/jpnic_admin/' + jpnicID,
      data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  updateJPNICTech(id, jpnicID, data): Promise<any> {
    return this.http.put(environment.api.url + environment.api.path + '/service/' + id + '/jpnic_tech/' + jpnicID,
      data, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  deleteJPNICIP(id, jpnicID): Promise<any> {
    return this.http.delete(environment.api.url + environment.api.path + '/service/' + id + '/ip/' + jpnicID,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  deleteJPNICAdmin(id, jpnicID): Promise<any> {
    return this.http.delete(environment.api.url + environment.api.path + '/service/' + id + '/jpnic_admin/' + jpnicID,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  deleteJPNICTech(id, jpnicID): Promise<any> {
    return this.http.delete(environment.api.url + environment.api.path + '/service/' + id + '/jpnic_tech/' + jpnicID,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  deleteIP(id, ipID): Promise<any> {
    return this.http.delete(environment.api.url + environment.api.path + '/service/' + id + '/ip/' + ipID,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }

  deletePlan(id): Promise<any> {
    return this.http.delete(environment.api.url + environment.api.path + '/plan/' + id,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      return response;
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });
  }
}

