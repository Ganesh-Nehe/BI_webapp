import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async loadChalanList(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/chalan/?businessId=${businessId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; 
    }
  }

  getCutomerDetailsById() { }
}
