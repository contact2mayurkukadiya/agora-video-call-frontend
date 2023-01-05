import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  Post(url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(url, data).toPromise().then(result => {
        resolve(result)
      }, error => {
        reject(error)
      })
    })
  }

  Get(url: string, header: any = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(url, header).toPromise().then(result => {
        resolve(result)
      }, error => {
        reject(error)
      })
    })
  }

}
