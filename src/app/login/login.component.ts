import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../api.service';
import { Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginObj: any = {
    "emailId": "",
    "password": ""
  };

  constructor(private http: HttpClient, private router: Router, private apiService: APIService, private authService: AuthService) {}

  onLogin() {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    };

    this.http.post(`${baseApi}/API/login`, this.loginObj, httpOptions)
      .subscribe((res: any) => {
        if (res.success === 1) {
          this.authService.setLoggedIn(true);
          this.router.navigate(['/dashboard']);
          localStorage.setItem("loginToken", res.token);
          localStorage.setItem('loggedInUserId', res.employeeId);
          localStorage.setItem('businessId', res.businessId); 
          localStorage.setItem('permissions', JSON.stringify(res.permission_name));
          localStorage.setItem('employeeFirstName', res.employeeFirstName);

        } else {
          alert(res.data);
          console.log('Login failed:', res.message);
        }
      });
  }
}
