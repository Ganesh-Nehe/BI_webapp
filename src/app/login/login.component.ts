import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ViewChild, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from '../api.service';
import { Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare const particlesJS: any; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  countdown: number = 50;
  interval: any;
  isFlip = false;
  isSent = false;
  isLoading = false;
  loginObj: any = {
    "emailId": "",
    "password": ""
  };

  reset: any = {
    "emailId": "",
    "otp": "",
    "newPass":""
  };

  responseMessage: string = '';

  constructor(private http: HttpClient, private router: Router, private apiService: APIService, private authService: AuthService,  private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    // console.log("Initializing particles.js");
    this.loadParticles();  
  }

  ngOnDestroy(): void {
    const canvas = document.getElementById('particles-js');
    if (canvas) {
      canvas.innerHTML = '';
    }
  }

  loadParticles() {
    particlesJS("particles-js", {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#000000",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: false,
        },
        size: {
          value: 3,
          random: true,
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#000000",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          out_mode: "out",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "grab",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 300, // Increase interaction range
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  }

  async onLogin() {
    const baseApi = this.apiService.getBaseApi();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
        mode: 'cors',
        credentials: 'include'
    };
  
    try {
      const res: any = await this.http.post(`${baseApi}/API/login`, this.loginObj, httpOptions).toPromise();
  
      if (res.success === 1) {
        localStorage.setItem("loginToken", res.token);
        localStorage.setItem('loggedInUserId', res.employeeId);
        localStorage.setItem('businessId', res.businessId);
        localStorage.setItem('permissions', JSON.stringify(res.permission_name));
        localStorage.setItem('employeeFirstName', res.employeeFirstName);
        localStorage.setItem('profilephoto', res.profilephoto);
        this.authService.setLoggedIn(true);
        this.router.navigate(['/dashboard']);
      } else {
        alert("Email & Password are Incorrect");
        console.log('Login failed:', res.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }

  passReset() {
    this.isFlip = true;
  }

  startCountdown() {
    this.countdown = 50; 
    if (this.interval) {
      clearInterval(this.interval); 
    }
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.interval);
        this.isSent = false; 
      }
    }, 1000);
  }

  async isSentOTP() {
    if (this.reset.emailId !== null && this.reset.emailId !== undefined && this.reset.emailId !== ""){
      this.isLoading = true;
      const baseApi = this.apiService.getBaseApi();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
          mode: 'cors',
          credentials: 'include'
      };
    
      try {
        const res: any = await this.http.post(`${baseApi}/API/searchEmail/`, this.reset, httpOptions).toPromise();
        
        if (res.success === 1) {
          this.isSent = true;
          this.snackBar.open('OTP Sent to '+this.reset.emailId, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
        } else {
          alert("No Profile Found");
          console.log('Login failed:', res.message);
        }
      } catch (error) {
        console.error('Error during login:', error);
      } finally {
        this.isLoading = false; 
        this.startCountdown();
      }
    }else{
      this.snackBar.open('Enter a valid Email ID', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
        panelClass: ['snackbar-error']
      });
    }
  }
  
  backToLogin() {
    this.isFlip = false; // Show login, hide forgot password
    this.isSent = false;
  }

  async onReset(){
    if (this.reset.emailId !== "" && this.reset.otp !== "" && this.reset.newPass !== ""){
      const baseApi = this.apiService.getBaseApi();
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
          mode: 'cors',
          credentials: 'include'
      };
    
      try {
        const res: any = await this.http.patch(`${baseApi}/API/updatePassword/`, this.reset, httpOptions).toPromise();
        
        if (res.success === 1) {
          this.snackBar.open('Password Reset Successfully', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: ['snackbar-success']
          });
          this.backToLogin();
        }
      } catch (error) {
        this.snackBar.open('Error Resetting Password', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: ['snackbar-error']
        });
      }
    }else{
      alert("Invalid form")
    }
  }
}
