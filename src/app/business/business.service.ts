import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  constructor(private http: HttpClient, private apiService: APIService) { }

  async getBusinessList(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    
    return this.http.get(`${baseApi}/API/business`, httpOptions).toPromise();
  }

  async getBusinessDetails(businessId: string): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    return this.http.get(`${baseApi}/API/business/${businessId}`, httpOptions).toPromise();
  }

  async updateBusinessStatus(businessId: string, live_sleep: number): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    
    const requestBody = { businessId, live_sleep };
    
    return this.http.patch(`${baseApi}/API/business/update-status/${businessId}`, requestBody, httpOptions).toPromise();
  }
}
