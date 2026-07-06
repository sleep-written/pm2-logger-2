import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pm2ProcessList } from './pm2-process-list';

describe('Pm2ProcessList', () => {
  let component: Pm2ProcessList;
  let fixture: ComponentFixture<Pm2ProcessList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Pm2ProcessList],
    }).compileComponents();

    fixture = TestBed.createComponent(Pm2ProcessList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
