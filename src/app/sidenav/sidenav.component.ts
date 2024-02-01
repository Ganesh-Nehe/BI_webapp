import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit{

  constructor(private router: Router) {}

  @Input() sideNavStatus: boolean = false;
  list = [
  {
    number: '1',
    name: 'Dashboard',
    icon: 'fa-solid fa-house',
    path: '/dashboard',
  },
  {
    number: '2',
    name: 'Business',
    icon: 'fa-solid fa-briefcase',
    path: '/business',
  },
  {
    number: '3',
    name: 'User',
    icon: 'fa-solid fa-user',
    path: '/users',
  },
  {
    number: '4',
    name: 'Manual Attendence',
    icon: 'fa-solid fa-clipboard-user',
    path: '/attendence',
  },
  {
    number: '5',
    name: 'Attendence Master',
    icon: 'fa-solid fa-users-rectangle',
    path: '/attendence-master',
  }
];

navigateTo(path: string): void {
  // console.log(`Navigating to: ${path}`);
  this.router.navigate([path]);
}

ngOnInit(): void {
    
}
}
