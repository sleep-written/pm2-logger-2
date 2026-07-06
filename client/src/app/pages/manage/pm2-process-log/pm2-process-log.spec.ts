import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pm2ProcessLog } from './pm2-process-log';

describe('Pm2ProcessLog', () => {
  let component: Pm2ProcessLog;
  let fixture: ComponentFixture<Pm2ProcessLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Pm2ProcessLog],
    }).compileComponents();

    fixture = TestBed.createComponent(Pm2ProcessLog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
