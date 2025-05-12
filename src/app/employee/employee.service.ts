import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  constructor(private http: HttpClient, private apiService: APIService) {}

  async getEmployeeList(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/user/?businessId=${businessId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error; // Propagate the error for handling in the calling component
    }
  }

  async getEmployeeDetails(employeeId: string): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/user/${employeeId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('API Error:', error);
      throw error; // Propagate the error for handling in the calling component
    }
  }

  async updateEmployeeStatus(employeeId: string, live_sleep: number): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    
    const requestBody = { employeeId, live_sleep };
    
    return this.http.patch(`${baseApi}/API/user/update-status/${employeeId}`, requestBody, httpOptions).toPromise();
  }
}
