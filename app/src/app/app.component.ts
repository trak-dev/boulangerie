import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalService } from './services/global/global.service';
import { LoadingComponent } from './components/loading/loading.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    LoadingComponent, 
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {

  constructor(public _global: GlobalService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this._global.setLoading(true);
    // do some async operation
    setTimeout(() => {
      this._global.setLoading(false);
      this.cdr.detectChanges(); // manually trigger change detection
    }, 100);
  }
  
  title = 'app';

}
