import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TimerService } from './timer.service';
import { Observable, take } from 'rxjs';

fdescribe('TimerService', () => {
  let service: TimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimerService]
    });
    service = TestBed.inject(TimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial time zone offset', () => {
    expect(service.timeZoneOffSet).toBeDefined();
  });

  it('should increase time correctly', fakeAsync(() => {
    const emitedValues: number[] = [];
    service.setRunning(true);

    service.timer().pipe(take(3)).subscribe(time => {
      emitedValues.push(time);
    });

    tick(10);
    expect(emitedValues[0]).toBe(10 + service.timeZoneOffSet);

    tick(10);
    expect(emitedValues[1]).toBe(20 + service.timeZoneOffSet);

    tick(10);
    expect(emitedValues[2]).toBe(30 + service.timeZoneOffSet);
    })
  );

  it('should reset timer correctly', () => {
    service.resetTimer();
    expect(service.getCurrentTime()).toEqual(service.timeZoneOffSet);

    service.isRunning().subscribe(isRunning => {
      expect(isRunning).toBeFalse();
    })

    service.getLaps().subscribe(laps => {
      expect(laps.length).toBe(0);
    })
  });

  it('should return current time', () => {
    expect(service.getCurrentTime()).toBeDefined();
  });

  it('should return isRunning observable', () => {
    expect(service.isRunning()).toBeInstanceOf(Observable);
    service.isRunning().subscribe(isRunning => {
      expect(isRunning).toBeInstanceOf(Boolean);
    })
  });

  it('should set running state currectly', () => {
    const isRunning = true;
    service.setRunning(isRunning);

    service.isRunning().subscribe(runningState => {
      expect(runningState).toEqual(isRunning);
    });
  });

  it('should get laps', () => {
    expect(service.getLaps()).toBeInstanceOf(Observable);

    service.getLaps().subscribe(laps => {
      expect(Array.isArray(laps)).toBeTrue();
    });
  });

  it('should add lap', () => {
    service.addLap();

    service.getLaps().subscribe(laps => {
      expect(laps.length).toBeGreaterThan(0);
      expect(laps[0].diff).toBeDefined();
      expect(laps[0].time).toBeDefined();
    });
  });

  it('should calculate the first time difference correctly', () => {
    service.setRunning(true);
    service.addLap();

    service.getLaps().subscribe(laps => {
      expect(laps.length).toEqual(1);
      expect(laps[0].diff - laps[0].time).toEqual(0);
    })
  })

  it('should calculate time difference correctly between laps', () => {
    service.setRunning(true);
    service.addLap();
    service.addLap();

    service.getLaps().subscribe(laps => {
      expect(laps.length).toEqual(2);
      expect(laps[1].time - laps[1].diff).toEqual(laps[0].time);
    })
  });



});
