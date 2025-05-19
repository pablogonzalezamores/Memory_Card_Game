import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GameStateService } from '../../services/game-state.service';

interface Card {
  id: number;
  image: string;
  revealed: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  cards: Card[] = [];
  selectedCards: Card[] = [];
  lives: number = 5;
  volume: number = 0.05;

  private previousVolume: number = 0.2;
  private audio: HTMLAudioElement | null = null;
  private errorAudio: HTMLAudioElement | null = null;
  private readonly isBrowser: boolean;

  private readonly sounds: Record<string, string> = {
    'Bombardiro_Crocodilo.webp': 'assets/audio/Bombardiro_Crocodilo.mp3',
    'Boneca_ambalabu.webp': 'assets/audio/Boneca_ambalabu.mp3',
    'Brr_Brr_Patapim.webp': 'assets/audio/Brr_Brr_Patapim.mp3',
    'ChimpanziniBananini.webp': 'assets/audio/ChimpanziniBananini.mp3',
    'Frulli_Frulla_HD.webp': 'assets/audio/Frulli_Frulla_HD.mp3',
    'Tralalero_tralala.webp': 'assets/audio/Tralalero_tralala.mp3'
  };

  constructor(
    private readonly toastr: ToastrService,
    private readonly router: Router,
    private readonly gameState: GameStateService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.errorAudio = new Audio('assets/audio/la-polizia-noooooo.mp3');
      this.errorAudio.volume = this.volume;
    }
  }

  ngOnInit(): void {
    this.initializeGame();
  }

  initializeGame(): void {
    const images: string[] = Object.keys(this.sounds).map(file => `assets/brainrots/${file}`);
    this.cards = [...images, ...images]
      .map((image: string, index: number) => ({
        id: index,
        image,
        revealed: false,
        matched: false
      }))
      .sort(() => 0.5 - Math.random());

    this.selectedCards = [];
    this.lives = 5;
    this.gameState.resetState();
    this.stopAudio();
  }

  selectCard(card: Card): void {
    if (card.revealed || card.matched || this.selectedCards.length >= 2) return;

    card.revealed = true;
    this.selectedCards.push(card);

    if (this.selectedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 800);
    }
  }

  checkMatch(): void {
    const [first, second] = this.selectedCards;

    if (first.image === second.image) {
      first.matched = second.matched = true;
      this.playSound(first.image);
    } else {
      first.revealed = second.revealed = false;
      this.lives--;

      if (this.isBrowser && this.errorAudio) {
        this.errorAudio.pause();
        this.errorAudio.currentTime = 0;
        this.errorAudio.volume = this.volume;
        this.errorAudio.play().catch(() => {});
        setTimeout(() => this.errorAudio?.pause(), 5000);
      }
    }

    this.selectedCards = [];

    if (this.lives <= 0) {
      this.toastr.error('😢 You lost!', '', { enableHtml: true });
      this.initializeGame();
    }

    if (this.cards.every(card => card.matched)) {
      this.gameState.markVictory();
      this.toastr.success('🎉 You won!', '', { enableHtml: true });
      setTimeout(() => this.router.navigateByUrl('/end'), 1000);
    }
  }

  playSound(imageUrl: string): void {
    if (!this.isBrowser) return;

    this.stopAudio();

    const fileName: string | undefined = imageUrl.split('/').pop();
    const path: string | undefined = fileName ? this.sounds[fileName] : undefined;

    if (!path) return;

    this.audio = new Audio(path);
    this.audio.volume = this.volume;
    this.audio.play().catch(() => {});
    setTimeout(() => this.stopAudio(), 5000);
  }

  stopAudio(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
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

    if (this.audio) this.audio.volume = newVolume;
    if (this.errorAudio) this.errorAudio.volume = newVolume;
  }

  toggleMute(): void {
    if (!this.isBrowser) return;

    this.volume = this.volume === 0 ? this.previousVolume || 0.5 : 0;

    if (this.audio) this.audio.volume = this.volume;
    if (this.errorAudio) this.errorAudio.volume = this.volume;
  }

  restartGame(): void {
    this.initializeGame();
    this.toastr.info('🔁 Game restarted', '', { enableHtml: true });
  }
}