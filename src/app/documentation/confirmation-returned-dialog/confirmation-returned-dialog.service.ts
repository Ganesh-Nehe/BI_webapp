import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';


@Injectable({
  providedIn: 'root'
})
export class ConfirmationReturnedDialogService {

  constructor(private apiService: APIService, private http: HttpClient) { }

  async isReturned(returnValue: any, chalanId: number): Promise<any>{
    const returnedChallan = { returnValue: returnValue, chalanId: chalanId};
    const baseApi = this.apiService.getBaseApi();
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.patch(`${baseApi}/API/documentation/returnedChallan/`, returnedChallan, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; 
    }
  }
}
