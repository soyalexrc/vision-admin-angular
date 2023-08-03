import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionConfigModalComponent } from './commission-config-modal.component';

describe('CommissionConfigModalComponent', () => {
  let component: CommissionConfigModalComponent;
  let fixture: ComponentFixture<CommissionConfigModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommissionConfigModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommissionConfigModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
