import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { playResultObject } from '../../models/game.model';
import { environment } from '../../../environments/environments';
import { UsersLeaderBoard } from '../../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private _http: HttpClient) { }

  rollDices() {
    return new Promise<playResultObject>((resolve, reject) => {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      this._http.get<playResultObject>(`${environment.api}/game/play`, { headers })
        .subscribe({
          next: (result) => resolve(result),
          error: (err) => reject(err)
        });
    });
  }

  getLeaderboard() {
    return new Promise<UsersLeaderBoard[]>((resolve, reject) => {
      const headers = {
        'Content-Type': 'application/json'
      };

      this._http.get<UsersLeaderBoard[]>(`${environment.api}/game/scoreboard`, { headers })
        .subscribe({
          next: (result) => resolve(result),
          error: (err) => reject(err)
        });
      });
    }

}
