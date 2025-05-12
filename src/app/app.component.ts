import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BI-WebApp';
  constructor(private bnIdle: BnNgIdleService, private router: Router) {}

  ngOnInit(): void {
    // Start watching for idle time (30 minutes)
    this.bnIdle.startWatching(30 * 60).subscribe({
      next: (isIdle) => { 
        if (isIdle) {
          // Check if already on the login page
          if (this.router.url.includes('/login')) {
            // Do nothing if already on the login page
          } else {
            // If not on the login page, show alert and navigate to login
            console.log('Session expired. Redirecting to login.');
            alert('Your session has expired. Please log in again.');
            window.location.href = '/login';
          }
        }
      },
      error: (error) => {
        console.error('Error watching for idle time:', error);
      }
    });
    

    // Subscribe to route changes to handle cases where the user navigates to the login page manually
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        if (event.urlAfterRedirects && event.urlAfterRedirects.includes('/login')) {
          console.log('Navigated to the login page. Resetting idle timer.');
          // Reset the idle timer when navigating to the login page
          this.bnIdle.resetTimer();
        }
      });
  }
}
