import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
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

  volumen = 0.2;
  private isBrowser: boolean;
  private currentAudios: Record<string, HTMLAudioElement> = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  playAudio(url: string) {
    if (!this.isBrowser) return;

    const existing = this.currentAudios[url];

    if (existing && !existing.paused) {
      existing.pause();
      existing.currentTime = 0;
      delete this.currentAudios[url];
    } else {
      const audio = new Audio(url);
      audio.volume = this.volumen;
      audio.play().catch(() => {});
      this.currentAudios[url] = audio;
    }
  }

  onVolumeInput(event: Event) {
    if (!this.isBrowser) return;
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);
    this.volumen = value;
    Object.values(this.currentAudios).forEach(audio => {
      audio.volume = value;
    });
  }

  reset() {
    if (!this.isBrowser) return;
    Object.values(this.currentAudios).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.currentAudios = {};
    this.router.navigateByUrl('/');
  }
}