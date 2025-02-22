import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class AddChalanDialogService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async addChalanDetails(formdata: any): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.post(`${baseApi}/API/documentation/addChalan/`, formdata, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
   }

  async updateChalanDetails(formdata: any) { 
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.patch(`${baseApi}/API/documentation/updateChalan/`, formdata, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

  async loadCustomerList(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/getCustomerDetails/?businessId=${businessId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

  async loadLocationList(customerId: any): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/getCustomerDetailsbyId/?customerId=${customerId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }
}
