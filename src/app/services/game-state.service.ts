import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  hasWon = false;

  marcarVictoria() {
    this.hasWon = true;
  }

  resetearEstado() {
    this.hasWon = false;
  }
}