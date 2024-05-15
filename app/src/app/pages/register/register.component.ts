import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { AccountsService } from '../../services/accounts/accounts.service';
import { GlobalService } from '../../services/global/global.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MessagesModule, CheckboxModule, RouterModule],
  providers: [MessageService, AccountsService],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private _accounts: AccountsService, private _messages: MessageService, private _global: GlobalService, private _router: Router) { }

  name: string = '';
  email: string = '';
  password: string = '';
  useMagicLogin: boolean = false;

  async register() {
    try {
      if (!this.name || !this.email) return this._messages.add({ life: 3000, severity: 'error', summary: 'Error', detail: 'Name and email are required' });
      this._global.setLoading(true);
      if (this.useMagicLogin) {
        await this._accounts.register(this.email, this.name);
        return this._messages.add({ life: 3000, severity: 'success', summary: 'Success', detail: 'Check your email for a magic link to login' });
      } else {
        if (!this.password) return this._messages.add({ life: 3000, severity: 'error', summary: 'Error', detail: 'Password is required' });
        await this._accounts.registerWithPassword(this.email, this.name, this.password);
        this._messages.add({ life: 3000, severity: 'success', summary: 'Success', detail: 'Registered successfully' });
        // redirect to home page
        this._router.navigate(['/home']);
      }
    } catch (err: any) {
      console.error(err);
      if (err.error && typeof err.error === 'string' && err.error.length < 100) {
        return this._messages.add({ life: 3000, severity: 'error', summary: 'Error', detail: err.error });
      } else {
        return this._messages.add({ life: 3000, severity: 'error', summary: 'Error', detail: 'errir while registering you' });
      }
    } finally {
      this._global.setLoading(false);
    }
  }



}
