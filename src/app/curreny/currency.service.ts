import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  constructor(private http: HttpClient, private apiService: APIService) { }

  async getCurrencyList(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    
    try {
      const response = await this.http.get(`${baseApi}/API/currency`, httpOptions).toPromise();
      return response; // Return the response from the API
    } catch (error) {
      console.error('Error fetching currency list:', error);
      throw error; // Rethrow the error to handle it in the calling component
    }
  }
}
