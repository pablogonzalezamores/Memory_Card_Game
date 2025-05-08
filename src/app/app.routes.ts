import { Routes } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { GameComponent } from './components/game/game.component'
import { EndScreenComponent } from './components/end-screen/end-screen.component';

export const routes: Routes = [
  { path: '', component: StartComponent }, 
  { path: 'game', component: GameComponent },
  { path: 'end', component: EndScreenComponent },
  { path: '**', redirectTo: '' }
];