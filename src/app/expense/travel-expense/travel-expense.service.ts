import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TravelExpenseService {

  constructor(private apiService: APIService, private http: HttpClient) { }

  async showAllEstTravelExpenses(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/expense/estTravelExpenseHeadEmployee?employeeId=${employeeId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

  async getEstTravelExpenseDetails(row: any): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const estTravelExpenseHeadId = row.EstTravelHeadId;
    console.log(estTravelExpenseHeadId);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/expense/estTravelExpenseDetails?estTravelExpenseHeadId=${estTravelExpenseHeadId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

  async getEstTraveldetailsforId(EstTravelHeadId: number){
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/expense/esttraveldetailsForId/?EstTravelHeadId=${EstTravelHeadId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching voucher details', error);
      throw error; // Re-throw the error for further handling
    }
  }
}
