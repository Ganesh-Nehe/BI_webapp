import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TravelExpenseStatementService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async addTravelExpense(formData: any){
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.post(`${baseApi}/API/expense/addTravelExpense`, formData, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async updateTravelExpense(formData: any) {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.post(`${baseApi}/API/expense/updateTravelExpense`, formData, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

}
