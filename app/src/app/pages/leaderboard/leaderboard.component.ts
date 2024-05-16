import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersLeaderBoard } from '../../models/game.model';
import { CardModule } from 'primeng/card'; // PrimeNG Card module
import { ButtonModule } from 'primeng/button'; // PrimeNG Button module
import { RouterModule } from '@angular/router'; // For routerLink
import { MessageService } from 'primeng/api'; // PrimeNG Message service
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, RouterModule],
  providers: [MessageService],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: UsersLeaderBoard[] = [];

  constructor( private _message: MessageService, private _game: GameService) {}

  isGameOver = false;
  totalLeft = 0;

  ngOnInit(): void {
    this.getLeaderboard();
    this.getTotalLeft();
    this.checkIfGameIsOver();
  }

  async checkIfGameIsOver() {
    return this.isGameOver = await this._game.isGameOver();
  }

  async getTotalLeft() {
    return this.totalLeft = await this._game.getTotalLeft();
  }

  async getLeaderboard() {
    try {
      this.leaderboard = await this._game.getLeaderboard();
      console.log(this.leaderboard);
    } catch (error: any) {
      console.error(error);
      if (error.error && typeof error.error === 'string' && error.error.length < 100) {
        this._message.add({severity:'error', summary:'Erreur', detail:error.error, life: 3000});
      } else {
        this._message.add({severity:'error', summary:'Erreur', detail:'Une erreur est survenue. Veuillez réessayer plus tard.', life: 3000});
      }
    }
  }

  getImagePath(prizeUrl: any): string {
    console.log("pastryUrl: ", prizeUrl);
    return `../assets/images/${prizeUrl}`;
  }
}
