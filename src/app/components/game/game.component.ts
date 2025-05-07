import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
      alert('¡Has perdido!');
      this.inicializarJuego();
    }

    if (this.cards.every(c => c.matched)) {
      alert('¡Felicidades, ganaste!');
    }
  }

  reiniciarJuego() {
    this.inicializarJuego();
  }
}