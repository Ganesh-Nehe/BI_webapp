import { Injectable } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TravelExpenseMasterService {

  constructor(private apiService: APIService, private http: HttpClient) { }

  async showAllEstTravelExpenses(): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const businessId = localStorage.getItem('businessId');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/expense/estTravelExpenseHeadBusiness?businessId=${businessId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

  async getEstTravelExpenseDetails(row: any): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const estTravelExpenseHeadId = row.EstTravelHeadId;
    // console.log(estTravelExpenseHeadId);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/expense/estTravelExpenseDetails?estTravelExpenseHeadId=${estTravelExpenseHeadId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching all voucher expenses', error);
      throw error; // Re-throw the error for further handling
    }
  }

  async updateApprovalStatus(body: any): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.patch(`${baseApi}/API/expense/esttravel/updateApprovalStatus`, body, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw error; // Re-throw the error after logging it
    }
  }

  async getTravelExpenseDetails(row: any) {
    const travelId = row.travelId;
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.get(`${baseApi}/API/expense/traveldetailsForId/?travelId=${travelId}`, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error fetching voucher details', error);
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

    //console.log(`Encoded location being sent to API: ${encodedFileLocation}`);

    return this.http.get<HttpResponse<Blob>>(`${baseApi}/API/document/${encodedFileLocation}`, httpOptions);
  }

  async updateStatementApprovalStatus(body: any): Promise<any> {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('loginToken')
      })
    };

    try {
      const response = await this.http.patch(`${baseApi}/API/expense/travel/updateStatementApprovalStatus`, body, httpOptions).toPromise();
      return response;
    } catch (error) {
      console.error('Error updating approval status:', error);
      throw error; // Re-throw the error after logging it
    }
  }

}
