import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { APIService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  getBusinessList(): Observable<any>{
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.get(`${baseApi}/API/business`,httpOptions)
  }

  getBusinessDetails(businessId: string): Observable<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.get(`${baseApi}/API/business/${businessId}`, httpOptions);
  }

  updateBusinessStatus(businessId: string, live_sleep: number): Observable<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
  
    // Prepare the request body with the businessId and live_sleep value
    const requestBody = { businessId, live_sleep };
  
    return this.http.patch(`${baseApi}/API/business/update-status/${businessId}`, requestBody, httpOptions);
  }
}
