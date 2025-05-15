import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  hasWon = false;

  markVictory() {
    this.hasWon = true;
  }

  resetState() {
    this.hasWon = false;
  }
}