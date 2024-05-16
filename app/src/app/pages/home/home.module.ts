import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiceComponent } from '../../components/dice/dice.component';

@NgModule({
  declarations: [DiceComponent],
  imports: [CommonModule],
  exports: [DiceComponent]
})
export class HomeModule {}
