import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmLeaveDialogService {

  constructor(private apiService: APIService, private http: HttpClient) {}

  async addLeave(dateISO: any, leaveType: Text): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId');
    const leaveDate = { leaveDate: dateISO, leaveType: leaveType, employeeId: employeeId, businessId: businessId };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    try {
      const response = await this.http.post(`${baseApi}/API/addLeave/`, leaveDate, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }
}
