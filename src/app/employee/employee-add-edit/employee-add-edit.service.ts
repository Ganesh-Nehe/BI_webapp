import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAddEditService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  editEmployee(employeeId: string, data: any): Observable<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    console.log('Request Payload:', { ...data, employeeId });
    return this.http.patch(`${baseApi}/API/user/${employeeId}`, { ...data, employeeId }, httpOptions);
  }
}
