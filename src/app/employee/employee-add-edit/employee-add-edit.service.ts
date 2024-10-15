import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAddEditService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  editEmployee(employeeId: string, formData: FormData): Observable<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
  
    return this.http.patch(`${baseApi}/API/user/${employeeId}`, formData, httpOptions);
  }
}
