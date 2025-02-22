import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendenceMasterService {

  constructor(private apiService: APIService, private http: HttpClient) { }

  async getEmployeeAttendanceLeave(firstDay: any, lastDay: any, yearfirstDay: any, yearlastDay:any): Promise<any>{
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const businessId = localStorage.getItem('businessId')
    const dateRange = { firstDay: firstDay, lastDay: lastDay, yearfirstDay: yearfirstDay, yearlastDay: yearlastDay, businessId: businessId };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    try {
      const response = await this.http.post(`${baseApi}/API/getEmployeeAttendanceLeave/`, dateRange, httpOptions).toPromise();
      return response;
    } catch (error) { 
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

}
