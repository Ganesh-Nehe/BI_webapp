import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessAddEditService {

  constructor(private http:HttpClient, private apiService:APIService) { }

  editBusiness(businessId: string, data: any): Observable<any> {
    const baseApi = this.apiService.getBaseApi();
    const userId = localStorage.getItem('loggedInUserId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    console.log('Request Payload:', { businessId, userId }); // Log the payload for debugging
    const formData = { ...data, businessId, userId };
    return this.http.patch(`${baseApi}/API/business/${businessId}`, formData, httpOptions);
  }
}
