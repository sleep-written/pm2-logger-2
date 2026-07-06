import { TestBed } from '@angular/core/testing';

import { PM2Service } from './pm2-service';

describe('PM2Service', () => {
  let service: PM2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PM2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
