import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _httpClient: HttpClient) { }

  get(url: string): Observable<any> {
    return this._httpClient.get(url);
  }

  post(url: string, model: any): Observable<any> {
    const body = JSON.stringify(model);
    return this._httpClient.post(url, body);
  }

  postImage(url: string, model: any): Observable<any> {
    let httpHeaders = new HttpHeaders()
      .set('isfile', '');

    return this._httpClient.post(url, model, {
      headers: httpHeaders
    });
  }


  put(url: string, id: number, model: any): Observable<any> {
    const body = JSON.stringify(model);
    return this._httpClient.put(url + id, body);
  }

  delete(url: string, id: number): Observable<any> {
    return this._httpClient.delete(url + id);
  }



  // get(url: string): Observable<any> {
  //   return this._httpClient.get(url);
  // }

  // post(url: string, model: any): Observable<any> {
  //   const body = JSON.stringify(model);
  //   let httpHeaders = new HttpHeaders()
  //     .set('Content-Type', 'application/json');

  //   return this._httpClient.post(url, body, {
  //     headers: httpHeaders
  //   });
  // }

  // put(url: string, id: number, model: any): Observable<any> {
  //   const body = JSON.stringify(model);
  //   let httpHeaders = new HttpHeaders()
  //     .set('Content-Type', 'application/json');

  //   return this._httpClient.put(url + id, body, {
  //     headers: httpHeaders
  //   });
  // }

  // delete(url: string, id: number): Observable<any> {
  //   return this._httpClient.delete(url + id);
  // }

}
