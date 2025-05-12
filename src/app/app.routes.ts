import { Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { GameComponent } from './components/game/game.component'
import { EndScreenComponent } from './components/end-screen/end-screen.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { endGuard } from './guards/end.guard';

export const routes: Routes = [
  { path: '', component: StartComponent, title: 'Main - Memory Brainrot' }, 
  { path: 'game', component: GameComponent, title: 'Game - Memory Brainrot' },
  { path: 'end', component: EndScreenComponent, canActivate: [endGuard], title: 'End - Memory Brainrot' },
  { path: '**', component: NotFoundComponent, title: '404 Not Found - Memory Brainrot' }
];