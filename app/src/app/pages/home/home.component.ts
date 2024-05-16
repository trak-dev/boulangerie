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

  constructor(private _game: GameService, public _global: GlobalService, private _message: MessageService) {}

  ngOnInit() {
    // Subscribe to user$ to log user data
    this.user$.subscribe(user => {
      console.log('User data:', user);
    });
  }

  logout() {
    console.log('Logging out...');
    this._global.clearUser();
    window.location.href = '/login';
  }

  async launch() {
    try {
      const playResult = await this._game.rollDices();
      this.dices = playResult.dices;
      
      // Trigger rotation animation for each dice
      this.dices.forEach((diceValue, index) => {
        this.triggerDiceRotation(index, diceValue);
      });
  
      if (playResult.attributedPastries.length > 0) {
        // Throw confetti!
        const wrapper = document.getElementById('wrapper') as HTMLElement;
        party.confetti(wrapper, {
          count: 100,
          size: 2,
        });
        this._global.addPastries(playResult.attributedPastries);
        this._message.add({severity:'success', summary:'Congratulations!', detail:'You won some pastries! Go to the prizes page to see them!', life: 3000});
      } else if (playResult.triesLeft === 0) {
        this._message.add({severity:'error', summary:'Game Over', detail:'You have no more tries left!', life: 3000});
      }
    } catch (error: any) {
      console.error(error);
      if (error.error && typeof error.error === 'string' && error.error.length < 100) {
        this._message.add({severity:'error', summary:'Error', detail:error.error, life: 3000});
      } else {
        this._message.add({severity:'error', summary:'Error', detail:'An error occurred. Please try again later.', life: 3000});
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