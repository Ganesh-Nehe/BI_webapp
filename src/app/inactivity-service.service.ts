// inactivity.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private inactivityTimer$: Observable<number>;
  private unsubscribe$ = new Subject<void>();

  constructor(private router: Router) {
    // Set the inactivity timeout duration (30 minutes in milliseconds)
    const inactivityDuration = /*30 * 60 * 1000;*/ 5 * 1000;

    // Start a timer that emits after the inactivity duration
    this.inactivityTimer$ = timer(inactivityDuration);

    // Subscribe to the timer and perform the logout action
    this.inactivityTimer$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.showInactivityAlert();
      });
  }

  // Method to reset the inactivity timer
  resetInactivityTimeout() {
    this.unsubscribe$.next(); // Unsubscribe from the previous timer
    this.unsubscribe$.complete(); // Complete the previous timer

    // Start a new timer
    this.inactivityTimer$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.showInactivityAlert();
      });
  }

  private showInactivityAlert() {
    alert('Inactive for too long. Login again.');
    // Navigate to the login page
    this.router.navigateByUrl('/login');
  }


  // Unsubscribe from the timer when the service is destroyed
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
