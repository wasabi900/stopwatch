import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, map, takeUntil } from 'rxjs';

export interface DisplayTime {
  minutes: number,
  seconds: number,
  miliseconds: number
}

@Injectable()
export class TimerService {

  private isRunningSubject = new BehaviorSubject<boolean>(false);
  private laps = new BehaviorSubject<{diff: number, time: number}[]>([]);

  private readonly intervalValue = 10;
  readonly timeZoneOffSet = new Date().getTimezoneOffset() * 60000;
  private time: number = this.timeZoneOffSet;

  timer() {
    return interval(this.intervalValue).pipe(
      map(() => {
        this.time += this.intervalValue;
        return this.time;
      })
    );
  }

  resetTimer() {
    this.time = this.timeZoneOffSet;
    this.setRunning(false);
    this.laps.next([]);
  }

  getCurrentTime(): number {
    return this.time;
  }

  isRunning() {
    return this.isRunningSubject.asObservable();
  }

  setRunning(isRunning: boolean) {
    this.isRunningSubject.next(isRunning);
  }

  addLap() {
    const lap = {
      diff: this.getDiff(),
      time: this.getCurrentTime()
    }

    this.laps.next([...this.laps.value, lap]);
    this.scrollToTop('laps');
  }

  scrollToTop(idOfElement: string) {
    const containerElement = document.getElementById(idOfElement);

    if (containerElement) {
      containerElement.scrollTo({top: 0, behavior: 'instant'})
    }
  }

  getLaps() {
    return this.laps.asObservable();
  }

  getDiff() {
    const length = this.laps.value.length;
    return length > 0 ?  this.getCurrentTime() - this.laps.value[length -1].time : this.getCurrentTime();
  }

}
