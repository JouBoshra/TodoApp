import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  name: string;
  username: string;
  email: string;
  password: string;
  errors: any = {};
  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit(): void {
  }
  
  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password
    };
    if (!this.validateService.validateRegister(user)) {
      this.flashMessage.show("Please fill all required fields", { cssClass: "alert alert-danger popup-alert" });
      return;
    }
    if (!this.validateService.validateEmail(this.email)) {
      this.flashMessage.show("Please enter a valid email", { cssClass: "alert alert-danger popup-alert" });
      return;
    }
    this.authService.registerUser(user).subscribe((data: any) => {
      this.flashMessage.show(data.message, { cssClass: `alert popup-alert ${data.status === 'success' ? 'alert-success' : 'alert-danger'}`});
      if (data.status === "success") {
        // this.flashMessage.show(data.message);
        this.router.navigate(['/login']);
      } else {
        this.errors.submit = data.message;
        this.router.navigate(['/register']);
      }
    })
  }

}
