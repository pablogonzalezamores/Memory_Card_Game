import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { GameStateService } from '../services/game-state.service';
import { Router } from '@angular/router';

export const endGuard: CanActivateFn = () => {
  const gameState = inject(GameStateService);
  const router = inject(Router);

  if (gameState.hasWon) {
    return true;
  }

  router.navigateByUrl('**');
  return false;
};