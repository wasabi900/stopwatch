import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faStop, faPause, faFlag } from '@fortawesome/free-solid-svg-icons';
import { TimerService } from './core/timer.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FontAwesomeModule],
  providers: [TimerService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  timerService = inject(TimerService);

  faPlay = faPlay;
  faStop = faStop;
  faPause = faPause;
  faFlag = faFlag;


  time = this.timerService.getCurrentTime();
  running$ = this.timerService.isRunning();
  timer$ = this.timerService.timer();

  laps$ = this.timerService.getLaps();

  start(isRunning: boolean) {
    this.timerService.setRunning(isRunning);

    if (!isRunning) {
      this.time = this.timerService.getCurrentTime();
    }

  }

  reset() {
    this.timerService.resetTimer();
    this.time = this.timerService.getCurrentTime();
  }

  lap() {
    this.timerService.addLap();
  }

}
