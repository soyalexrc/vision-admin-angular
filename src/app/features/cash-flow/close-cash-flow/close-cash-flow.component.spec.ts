import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseCashFlowComponent } from './close-cash-flow.component';

describe('CloseCashFlowComponent', () => {
  let component: CloseCashFlowComponent;
  let fixture: ComponentFixture<CloseCashFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseCashFlowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseCashFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
