import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginObj: any = {
    "email_Id": "",
    "password": ""
  };

  constructor(private http: HttpClient, private router: Router, private apiService: APIService) {}

  onLogin() {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true, // Include credentials in the request
    };

    this.http.post(`${baseApi}/API/login`, this.loginObj, httpOptions)
      .subscribe((res: any) => {
        // console.log('API Response:', res);
        if (res.success === 1) {
          // debugger;
          this.router.navigate(['/dashboard']);
          localStorage.setItem("loginToken", res.token);
        } else {
          // alert(res.message);
          console.log('Login failed:', res.message);
        }
      });
  }
}
