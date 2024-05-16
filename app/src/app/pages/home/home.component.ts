import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiceComponent } from '../../components/dice/dice.component';
import { GameService } from '../../services/game/game.service';
import { GlobalService } from '../../services/global/global.service';
import { MessageService } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import party from "party-js";
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, DiceComponent, MessagesModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  dices: number[] = [5, 5, 5, 5, 5];
  user$: Observable<User | undefined> = this._global.user$;
  gameOver = false;

  constructor(private _game: GameService, public _global: GlobalService, private _message: MessageService) {}

  async ngOnInit() {
    // Subscribe to user$ to log user data
    this.user$.subscribe(user => {
      console.log('Données de l\'utilisateur:', user);
    });
    const isGameOver = await this._game.isGameOver();
    console.log('isGameOver:', isGameOver);
  }

  logout() {
    console.log('Déconnexion... 🔒');
    this._global.clearUser();
    window.location.href = '/login';
  }

  async launch() {
    try {
      if (this.gameOver) return this._message.add({severity:'error', summary:'Jeu Terminé', detail:'Toutes les pâtisseries ont déja été gagnées 😢', life: 3000});
      const playResult = await this._game.rollDices();
      this.dices = playResult.dices;
      
      // Trigger rotation animation for each dice
      this.dices.forEach((diceValue, index) => {
        this.triggerDiceRotation(index, diceValue);
      });
  
      if (playResult.attributedPastries.length > 0) {
        // Throw confetti! 🎉
        const wrapper = document.getElementById('wrapper') as HTMLElement;
        party.confetti(wrapper, {
          count: 100,
          size: 2,
        });
        this._global.addPastries(playResult.attributedPastries);
        this._message.add({severity:'success', summary:'Félicitations! 🎉', detail:'Vous avez gagné des pâtisseries! Allez à la page des prix pour les voir! 🥳', life: 3000});
      } else if (playResult.triesLeft === 0) {
        this._message.add({severity:'error', summary:'Jeu Terminé', detail:'Vous n\'avez plus d\'essais! 😢', life: 3000});
      }
    } catch (error: any) {
      console.error(error);
      if (error.error && typeof error.error === 'string' && error.error.length < 100) {
        this._message.add({severity:'error', summary:'Erreur', detail:error.error, life: 3000});
      } else {
        this._message.add({severity:'error', summary:'Erreur', detail:'Une erreur est survenue. Veuillez réessayer plus tard. 😞', life: 3000});
      }
    }
  }

  triggerDiceRotation(index: number, value: number) {
    // Temporarily change the dice value to trigger animation
    this.dices[index] = -1; // or some temporary value not used in the game

    // Revert to the original value after a short delay
    setTimeout(() => {
      this.dices[index] = value;
    }, 50); // Adjust timing as needed for your animation
  }

  showScoreboard() {
    // Go to the leaderboard page
    window.location.href = '/leaderboard';
  }

  showPrizes() {
    // Go to the prizes page
    window.location.href = '/prizes';
  }
}
