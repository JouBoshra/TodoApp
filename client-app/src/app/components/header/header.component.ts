import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  appName: string = "Track-My-Tasks";
  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogout(e) {
    e.preventDefault();
    this.auth.logout().subscribe(() => {
      this.router.navigate(['login']);
    });
  }
}
