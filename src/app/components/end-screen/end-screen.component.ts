import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-end-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss']
})
export class EndScreenComponent {
  characters = [
    {
      name: 'TRALALERO TRALALA',
      image: 'assets/brainrots/Tralalero_tralala.webp',
      audio: 'assets/audio/Tralalero_tralala.mp3'
    },
    {
      name: 'BONECA AMBALABU',
      image: 'assets/brainrots/Boneca_ambalabu.webp',
      audio: 'assets/audio/Boneca_ambalabu.mp3'
    },
    {
      name: 'SCIMPANZINI BANANINI',
      image: 'assets/brainrots/ChimpanziniBananini.webp',
      audio: 'assets/audio/ChimpanziniBananini.mp3'
    },
    {
      name: 'BOMBARDINO CROCODILO',
      image: 'assets/brainrots/Bombardiro_Crocodilo.webp',
      audio: 'assets/audio/Bombardiro_Crocodilo.mp3'
    },
    {
      name: 'FRULI FRULÁ',
      image: 'assets/brainrots/Frulli_Frulla_HD.webp',
      audio: 'assets/audio/Frulli_Frulla_HD.mp3'
    },
    {
      name: 'BRR BRR PATAPÍN',
      image: 'assets/brainrots/Brr_Brr_Patapim.webp',
      audio: 'assets/audio/Brr_Brr_Patapim.mp3'
    }
  ];

  private audiosMap: Record<string, HTMLAudioElement> = {};

  constructor(private router: Router) {}

  playAudio(url: string) {
    const current = this.audiosMap[url];

    if (current && !current.paused) {
      current.pause();
      current.currentTime = 0;
      delete this.audiosMap[url];
    } else {
      const newAudio = new Audio(url);
      newAudio.play();
      this.audiosMap[url] = newAudio;
    }
  }

  stopAllAudio() {
    for (const audio of Object.values(this.audiosMap)) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.audiosMap = {};
  }

  reset() {
    this.stopAllAudio();
    this.router.navigate(['/']);
  }
}