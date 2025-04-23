import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PunchTimeDialogService {

  constructor(private apiService: APIService, private http: HttpClient) { }

  async punchInTimeform(time: any, locationDesc: any): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const businessId = localStorage.getItem('businessId')
    const employeeId = localStorage.getItem('loggedInUserId');
    const punchData = {time: time, employeeId: employeeId, businessId: businessId, locationDesc: locationDesc};
    console.log(punchData);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.post(`${baseApi}/API/punchInAttendence/`, punchData, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

  async punchOutTimeform(time: any, attendenceId: number): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const businessId = localStorage.getItem('businessId')
    const employeeId = localStorage.getItem('loggedInUserId');
    const punchData = {time: time, attendenceId: attendenceId};
    //console.log(punchData);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.patch(`${baseApi}/API/punchOutAttendence/`, punchData, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

}
