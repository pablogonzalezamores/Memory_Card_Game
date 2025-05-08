import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  private toastr = inject(ToastrService);
  private router = inject(Router);

  cards: Card[] = [];
  selectedCards: Card[] = [];
  vidas = 5;

  ngOnInit() {
    this.inicializarJuego();
  }

  inicializarJuego() {
    const imagenes = [
      'assets/brainrots/Bombardiro_Crocodilo.webp',
      'assets/brainrots/Boneca_ambalabu.webp',
      'assets/brainrots/Brr_Brr_Patapim.webp',
      'assets/brainrots/ChimpanziniBananini.webp',
      'assets/brainrots/Frulli_Frulla_HD.webp',
      'assets/brainrots/Tralalero_tralala.webp',
    ];

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
    } else {
      c1.revealed = c2.revealed = false;
      this.vidas--;
    }

    this.selectedCards = [];

    if (this.vidas <= 0) {
      this.toastr.error(
        `<span class="toast-text-lg">😢 ¡Has perdido!</span>`,
        '',
        { enableHtml: true }
      );
      this.inicializarJuego();
    }

    if (this.cards.every(c => c.matched)) {
      this.toastr.success(
        `<span class="toast-text-lg">🎉 ¡Has ganado!</span>`,
        '',
        { enableHtml: true }
      );

      setTimeout(() => {
        this.router.navigateByUrl('/end');
      }, 1000);
    }
  }

  reiniciarJuego() {
    this.inicializarJuego();
    this.toastr.info(
      `<span class="toast-text-lg">🔁 Juego reiniciado</span>`,
      '',
      { enableHtml: true }
    );
  }
}