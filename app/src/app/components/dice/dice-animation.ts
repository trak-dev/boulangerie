import { trigger, transition, style, animate, keyframes } from '@angular/animations';

export const diceAnimation = trigger('diceAnimation', [
  transition('* => *', [
    animate('{{ duration }} {{ delay }}', keyframes([
      style({ transform: 'rotateX({{ xRotate }}deg) rotateY({{ yRotate }}deg)', offset: 0 }),
      style({ transform: 'rotateX({{ xRotateEnd }}deg) rotateY({{ yRotateEnd }}deg)', offset: 1.0 })
    ]))
  ], { params: { duration: '1s', delay: '0s', xRotate: 0, yRotate: 0, xRotateEnd: 180, yRotateEnd: 180 } })
]);
