import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VoucherExpenseService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async showAllVoucherExpenses(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const employeeId = localStorage.getItem('loggedInUserId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/expense/voucherEmployee?employeeId=${employeeId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

  getDocument(encodedFileLocation: string) {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      }),
      observe: 'response' as 'body', 
      responseType: 'blob' as 'json'  
    };
  
    console.log(`Encoded location being sent to API: ${encodedFileLocation}`);

    return this.http.get<HttpResponse<Blob>>(`${baseApi}/API/document/${encodedFileLocation}`, httpOptions);
  }

  async getVoucherdetails(voucherId: string): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/expense/voucherdetails/${voucherId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching voucher details', error);
      throw error; // Re-throw the error for further handling
    }
  }
}
