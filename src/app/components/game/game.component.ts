import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
  vidas = 5;
  volumen = 0.2;
  private audio: HTMLAudioElement | null = null;
  private audioError: HTMLAudioElement | null = null;
  private isBrowser: boolean;

  private sonidos: Record<string, string> = {
    'Bombardiro_Crocodilo.webp': 'assets/audio/Bombardiro_Crocodilo.mp3',
    'Boneca_ambalabu.webp': 'assets/audio/Boneca_ambalabu.mp3',
    'Brr_Brr_Patapim.webp': 'assets/audio/Brr_Brr_Patapim.mp3',
    'ChimpanziniBananini.webp': 'assets/audio/ChimpanziniBananini.mp3',
    'Frulli_Frulla_HD.webp': 'assets/audio/Frulli_Frulla_HD.mp3',
    'Tralalero_tralala.webp': 'assets/audio/Tralalero_tralala.mp3'
  };

  constructor(
    private toastr: ToastrService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.audioError = new Audio('assets/audio/la-polizia-noooooo.mp3');
      this.audioError.volume = this.volumen;
    }
  }

  ngOnInit() {
    this.inicializarJuego();
  }

  inicializarJuego() {
    const imagenes = Object.keys(this.sonidos).map(n => 'assets/brainrots/' + n);
    this.cards = [...imagenes, ...imagenes]
      .map((img, index) => ({
        id: index,
        image: img,
        revealed: false,
        matched: false
      }))
      .sort(() => 0.5 - Math.random());

    this.selectedCards = [];
    this.vidas = 5;
    this.detenerAudio();
  }

  seleccionarCarta(carta: Card) {
    if (carta.revealed || carta.matched || this.selectedCards.length >= 2) return;

    carta.revealed = true;
    this.selectedCards.push(carta);

    if (this.selectedCards.length === 2) {
      setTimeout(() => this.verificarPareja(), 800);
    }
  }

  verificarPareja() {
    const [c1, c2] = this.selectedCards;

    if (c1.image === c2.image) {
      c1.matched = c2.matched = true;
      this.reproducirSonido(c1.image);
    } else {
      c1.revealed = c2.revealed = false;
      this.vidas--;

      if (this.isBrowser && this.audioError) {
        this.audioError.pause();
        this.audioError.currentTime = 0;
        this.audioError.volume = this.volumen;
        this.audioError.play().catch(() => {});
        setTimeout(() => {
          this.audioError?.pause();
        }, 5000);
      }
    }

    this.selectedCards = [];

    if (this.vidas <= 0) {
      this.toastr.error('😢 ¡Has perdido!', '', { enableHtml: true });
      this.inicializarJuego();
    }

    if (this.cards.every(c => c.matched)) {
      this.toastr.success('🎉 ¡Has ganado!', '', { enableHtml: true });
      setTimeout(() => this.router.navigateByUrl('/end'), 1000);
    }
  }

  reproducirSonido(imageUrl: string) {
    if (!this.isBrowser) return;

    this.detenerAudio();

    const nombre = imageUrl.split('/').pop()!;
    const ruta = this.sonidos[nombre];
    if (!ruta) return;

    this.audio = new Audio(ruta);
    this.audio.volume = this.volumen;
    this.audio.play().catch(() => {});

    setTimeout(() => {
      this.detenerAudio();
    }, 5000);
  }

  detenerAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }

  onVolumeInput(event: Event) {
    if (!this.isBrowser) return;
    const input = event.target as HTMLInputElement;
    const nuevoVolumen = parseFloat(input.value);
    this.volumen = nuevoVolumen;

    if (this.audio) this.audio.volume = nuevoVolumen;
    if (this.audioError) this.audioError.volume = nuevoVolumen;
  }

  reiniciarJuego() {
    this.inicializarJuego();
    this.toastr.info('🔁 Juego reiniciado', '', { enableHtml: true });
  }
}