import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExpenseMasterService {
  constructor(private http: HttpClient, private apiService: APIService) { }

  showAllVoucherExpenses(): Observable<any>{
    const baseApi = this.apiService.getBaseApi();
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.get(`${baseApi}/API/expense/voucher?businessId=${businessId}`,httpOptions)
  }

  getVoucherdetails(voucherId: string): Observable<any>{
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.get(`${baseApi}/API/expense/voucherdetails/${voucherId}`,httpOptions)
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

  updateApprovalStatus(body: any): Observable<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };
    return this.http.post(`${baseApi}/API/expense/voucher/updateApprovalStatus`, body, httpOptions);
  }

}
