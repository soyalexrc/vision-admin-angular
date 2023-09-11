import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalAvailableComponent } from './total-available.component';

describe('TotalAvailableComponent', () => {
  let component: TotalAvailableComponent;
  let fixture: ComponentFixture<TotalAvailableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalAvailableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
