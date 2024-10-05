import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessAddEditService {

  constructor(private http:HttpClient, private apiService:APIService) { }

  editBusiness(businessId: string, data: FormData): Observable<any> {
    const baseApi = this.apiService.getBaseApi();
    const userId = localStorage.getItem('loggedInUserId') || '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    data.append('businessId', businessId)
    data.append('userId', userId)
    return this.http.patch(`${baseApi}/API/business/${businessId}`, data, httpOptions);
  }
  addBusiness(data: FormData): Observable<any> {
    console.log(data);
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
   
    return this.http.post(`${baseApi}/API/business`, data, httpOptions);
  }
}
