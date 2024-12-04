import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss']
})
export class GoogleLoginComponent implements OnInit {
  authVerifying: Boolean = false;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['token']) {
        this.authVerifying = true;
        this.authService.loginWithGoogleId(params.token).subscribe((data: any) => {
          if (data.success) {
            this.authService.storeUserData(data);
            this.router.navigate(['dashboard']);
          }
        })
      }
    })
  }
}
