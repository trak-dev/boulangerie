import { Component, OnInit } from '@angular/core';
import { PastryWon } from '../../models/game.model';
import { GlobalService } from '../../services/global/global.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-prizes',
  templateUrl: './prizes.component.html',
  styleUrls: ['./prizes.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule]
})
export class PrizesComponent implements OnInit {

  prizes: PastryWon[] = [];

  constructor(private _global: GlobalService) { }

  ngOnInit(): void {
    this._global.user$.subscribe(user => {
      if (user) {
        this.prizes = user.pastriesWon;
      }
    });
  }

  getImagePath(prizeUrl: string): string {
    return `../assets/images/${prizeUrl}`;
  }
}
