import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

@Component({
  selector: 'app-dice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dice.component.html',
  styleUrls: ['./dice.component.scss'],
  animations: [
    trigger('diceAnimation', [
      transition('* => *', [
        animate('{{duration}} {{delay}}', keyframes([
          style({ transform: 'rotateX({{startX}}deg) rotateY({{startY}}deg)', offset: 0 }),
          style({ transform: 'rotateX({{endX}}deg) rotateY({{endY}}deg)', offset: 1.0 })
        ]))
      ], { params: { duration: '1s', delay: '0s', startX: 0, startY: 0, endX: 0, endY: 0 } })
    ])
  ]
})

export class DiceComponent implements OnChanges {
  @Input() value: number = 1;

  animationState = {
    value: Math.random().toString(),
    params: {
      duration: '2s',
      delay: '0s',
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }
  };

  diceFaces: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      this.generateDiceFaces();
      this.triggerAnimation();
    }
  }

  generateDiceFaces() {
    // Generate randomized faces including the provided value
    const faces = [this.value, ...gsap.utils.shuffle([1, 2, 3, 4, 5, 6].filter(v => v !== this.value))];
    // Update diceFaces with the randomized faces
    this.diceFaces = faces;
  }

  triggerAnimation() {
    // Generate randomized animation parameters
    this.animationState = {
      value: Math.random().toString(),
      params: {
        duration: `${Math.random() * (3 - 2) + 2}s`,
        delay: '0s',
        startX: Math.random() * 360,
        startY: Math.random() * 360,
        endX: Math.random() * 720 + 360,
        endY: Math.random() * 720 + 360
      }
    };
  }
}
