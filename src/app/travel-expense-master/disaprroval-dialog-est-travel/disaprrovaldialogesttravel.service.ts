import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DisaprrovaldialogesttravelService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async save(EstTravelHeadId: string, approvalStatus: string, description: string): Promise<any> {
    const formdata = {
      EstTravelHeadId,
      approvalStatus,
      description
    };
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.patch(`${baseApi}/API//expense/esttravel/updateApprovalStatus`, formdata, httpOptions).toPromise();
      return response; // return the response from the server
    } catch (error) {
      console.error('Error saving disapproval:', error);
      throw error; // re-throw the error for handling upstream
    }
  }
}
