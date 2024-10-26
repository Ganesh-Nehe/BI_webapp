import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs'; // Import lastValueFrom
import { APIService } from 'src/app/api.service';

@Injectable({
  providedIn: 'root'
})
export class AddVoucherheadService {

  constructor(private http: HttpClient, private apiService: APIService) { }

  async getVoucherHeadList(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      // Use lastValueFrom to convert the observable to a promise
      const response = await lastValueFrom(this.http.get(`${baseApi}/API/expense/voucherhead`, httpOptions));
      return response; // Return the response
    } catch (error) {
      console.error('Error fetching voucher head list:', error);
      throw error; // Rethrow the error for handling in the calling function
    }
  }
}
