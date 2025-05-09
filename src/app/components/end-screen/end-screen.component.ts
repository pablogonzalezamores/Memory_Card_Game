import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-end-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './end-screen.component.html',
  styleUrls: ['./end-screen.component.scss']
})
export class EndScreenComponent implements OnInit {
  characters = [
    { name: 'TRALALERO TRALALA', image: 'assets/brainrots/Tralalero_tralala.webp', audio: 'assets/audio/Tralalero_tralala.mp3' },
    { name: 'BONECA AMBALABU', image: 'assets/brainrots/Boneca_ambalabu.webp', audio: 'assets/audio/Boneca_ambalabu.mp3' },
    { name: 'SCIMPANZINI BANANINI', image: 'assets/brainrots/ChimpanziniBananini.webp', audio: 'assets/audio/ChimpanziniBananini.mp3' },
    { name: 'BOMBARDINO CROCODILO', image: 'assets/brainrots/Bombardiro_Crocodilo.webp', audio: 'assets/audio/Bombardiro_Crocodilo.mp3' },
    { name: 'FRULI FRULÁ', image: 'assets/brainrots/Frulli_Frulla_HD.webp', audio: 'assets/audio/Frulli_Frulla_HD.mp3' },
    { name: 'BRR BRR PATAPÍN', image: 'assets/brainrots/Brr_Brr_Patapim.webp', audio: 'assets/audio/Brr_Brr_Patapim.mp3' }
  ];

  volumen = 0.05;
  private volumenAnterior = 0.05;
  private isBrowser: boolean;
  private currentAudios: Record<string, HTMLAudioElement> = {};
  private ignasioAudio: HTMLAudioElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.ignasioAudio = new Audio('assets/audio/ignasio.mp3');
      this.ignasioAudio.volume = this.volumen;
      this.ignasioAudio.play().catch(() => {});
    }
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

  stopAll() {
    if (!this.isBrowser) return;
    Object.values(this.currentAudios).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.currentAudios = {};

    if (this.ignasioAudio) {
      this.ignasioAudio.pause();
      this.ignasioAudio.currentTime = 0;
    }
  }

  onVolumeInput(event: Event) {
    if (!this.isBrowser) return;
    const input = event.target as HTMLInputElement;
    const nuevoVolumen = parseFloat(input.value);

    this.volumen = nuevoVolumen;
    if (nuevoVolumen > 0) this.volumenAnterior = nuevoVolumen;

    Object.values(this.currentAudios).forEach(audio => audio.volume = nuevoVolumen);
    if (this.ignasioAudio) this.ignasioAudio.volume = nuevoVolumen;
  }

  toggleMute() {
    if (!this.isBrowser) return;

    if (this.volumen === 0) {
      this.volumen = this.volumenAnterior || 0.5;
    } else {
      this.volumenAnterior = this.volumen;
      this.volumen = 0;
    }

    Object.values(this.currentAudios).forEach(audio => audio.volume = this.volumen);
    if (this.ignasioAudio) this.ignasioAudio.volume = this.volumen;
  }

  reset() {
    this.stopAll();
    this.router.navigateByUrl('/');
  }
}