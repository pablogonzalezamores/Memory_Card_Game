import { Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { GameComponent } from './components/game/game.component'
import { EndScreenComponent } from './components/end-screen/end-screen.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

import { endGuard } from './guards/end.guard';

export const routes: Routes = [
  { path: '', component: StartComponent, title: 'Memory Brainrot - Main' }, 
  { path: 'game', component: GameComponent, title: 'Memory Brainrot - Game' },
  { path: 'end', component: EndScreenComponent, canActivate: [endGuard], title: 'Memory Brainrot - End' },
  { path: '**', component: NotFoundComponent, title: 'Memory Brainrot - 404 Not Found' }
];