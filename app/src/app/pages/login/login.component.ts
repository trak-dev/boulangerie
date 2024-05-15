import { Component } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    CheckboxModule,
    FormsModule
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  displayLogin: boolean = true;
  name: string = '';
  email: string = '';
  password: string = '';
  magicLogin: boolean = false;

  async login() {
    if (!this.email || !this.name) return 
    if (this.magicLogin) {
      // Handle magic login
      console.log('Magic login with email:', this.email);
    } else {
      // Handle regular login
      console.log('Regular login with email:', this.email, 'and password:', this.password);
    }
  }
}
