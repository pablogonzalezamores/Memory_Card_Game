import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface Character {
  name: string;
  image: string;
  audio: string;
}

@Component({
  selector: 'app-end-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss']
})
export class EndScreenComponent implements OnInit {
  characters: Character[] = [
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

  volume: number = 0.05;
  private previousVolume: number = 0.05;
  private readonly isBrowser: boolean;
  private currentAudios: Record<string, HTMLAudioElement> = {};
  private introAudio: HTMLAudioElement | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private readonly router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.introAudio = new Audio('assets/audio/ignasio.mp3');
      this.introAudio.volume = this.volume;
      this.introAudio.play().catch(() => {});
    }
  }

  playAudio(url: string): void {
    if (!this.isBrowser) return;

    const existingAudio = this.currentAudios[url];
    if (existingAudio && !existingAudio.paused) {
      existingAudio.pause();
      existingAudio.currentTime = 0;
      delete this.currentAudios[url];
    } else {
      const newAudio = new Audio(url);
      newAudio.volume = this.volume;
      newAudio.play().catch(() => {});
      this.currentAudios[url] = newAudio;
    }
  }

  stopAllAudio(): void {
    if (!this.isBrowser) return;

    Object.values(this.currentAudios).forEach((audio: HTMLAudioElement) => {
      audio.pause();
      audio.currentTime = 0;
    });

    this.currentAudios = {};

    if (this.introAudio) {
      this.introAudio.pause();
      this.introAudio.currentTime = 0;
    }
  }

  onVolumeChange(event: Event): void {
    if (!this.isBrowser) return;

    const input = event.target as HTMLInputElement;
    const newVolume: number = parseFloat(input.value);

    this.volume = newVolume;
    if (newVolume > 0) {
      this.previousVolume = newVolume;
    }

    Object.values(this.currentAudios).forEach((audio: HTMLAudioElement) => {
      audio.volume = newVolume;
    });

    if (this.introAudio) {
      this.introAudio.volume = newVolume;
    }
  }

  toggleMute(): void {
    if (!this.isBrowser) return;

    this.volume = this.volume === 0 ? this.previousVolume || 0.5 : 0;

    Object.values(this.currentAudios).forEach((audio: HTMLAudioElement) => {
      audio.volume = this.volume;
    });

    if (this.introAudio) {
      this.introAudio.volume = this.volume;
    }
  }

  resetGame(): void {
    this.stopAllAudio();
    this.router.navigateByUrl('/');
  }
}