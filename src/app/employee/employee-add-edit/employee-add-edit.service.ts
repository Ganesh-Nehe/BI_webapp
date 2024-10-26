import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeAddEditService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async editEmployee(employeeId: string, formData: FormData): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.patch(`${baseApi}/API/user/${employeeId}`, formData, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;  // Rethrow the error for handling in the calling component/service
    }
  }
}
