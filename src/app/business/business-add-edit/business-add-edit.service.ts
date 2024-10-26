import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessAddEditService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async editBusiness(businessId: string, data: FormData): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const userId = localStorage.getItem('loggedInUserId') || '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    data.append('businessId', businessId);
    data.append('userId', userId);

    try {
      return await this.http.patch(`${baseApi}/API/business/${businessId}`, data, httpOptions).toPromise();
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }

  async addBusiness(data: FormData): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      return await this.http.post(`${baseApi}/API/business`, data, httpOptions).toPromise();
    } catch (error) {
      console.error('Error adding business:', error);
      throw error;
    }
  }
}
