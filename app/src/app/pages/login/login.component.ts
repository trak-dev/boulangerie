import { Component, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../../services/accounts/accounts.service';
import { GlobalService } from '../../services/global/global.service';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DialogModule,
    CommonModule,
    CheckboxModule,
    FormsModule,
    MessagesModule,
    RouterModule
  ],
  providers: [MessageService, AccountsService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{

  constructor(private _accounts: AccountsService, private _messages: MessageService, private _global: GlobalService, private _router: Router) { }

  displayLogin: boolean = true;
  email: string = '';
  password: string = '';
  magicLogin: boolean = false;
  magicLoginToken: string = '';

  ngOnInit() {
    // search for "magicLogin" in the url query string
    const urlParams = new URLSearchParams(window.location.search);
    const magicLoginToken = urlParams.get('magicLink');
    if (magicLoginToken) {
      // decode the magic link
      this.magicLoginToken = decodeURIComponent(magicLoginToken);
      // remove the magic link from the url
      window.history.replaceState({}, document.title, window.location.pathname);
      this.loginWithMagicLink();
    }
  }
  
  async loginWithMagicLink() {
    try {
      this._global.setLoading(true);
      await this._accounts.loginWithMagicLink(this.magicLoginToken);
      this._messages.add({ life: 3000, severity: 'success', summary: 'Succès', detail: 'Connecté avec succès 👍' });
      this._router.navigate(['/home']);
    } catch (err: any) {
      console.error(err);
      if (err.error && typeof err.error === 'string' && err.error.length < 100) {
        return this._messages.add({ life: 3000, severity: 'error', summary: 'Erreur', detail: err.error });
      } else {
        return this._messages.add({ life: 3000, severity: 'error', summary: 'Erreur', detail: 'Lien magique invalide ❌' });
      }
    } finally {
      this._global.setLoading(false);
    }
  }
  
  async login() {
    try {
      if (this.magicLogin) {
        await this._accounts.sendMagicLink(this.email);
        return this._messages.add({ life: 3000, severity: 'success', summary: 'Succès', detail: 'Lien magique envoyé à votre email 📧' });
      }
      if (!this.email || !this.password) return this._messages.add({ life: 3000, severity: 'error', summary: 'Erreur', detail: 'Veuillez entrer votre email et mot de passe 🔐' });
      this._global.setLoading(true);
      if (this.magicLogin) {
        return await this._accounts.sendMagicLink(this.email);
      } else {
        const user = await this._accounts.login(this.email, this.password);
        this._router.navigate(['/home']);
      }
    } catch (err: any) {
      if (err.error && typeof err.error === 'string' && err.error.length < 100) {
        return this._messages.add({ life: 3000, severity: 'error', summary: 'Erreur', detail: err.error });
      } else {
        this._messages.add({ life: 3000, severity: 'error', summary: 'Erreur', detail: 'Erreur lors de la connexion ❌' });
      }
    } finally {
      this._global.setLoading(false);
    }
  }
  


}
