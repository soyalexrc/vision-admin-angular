import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPropertyModalComponent } from './register-property-modal.component';

describe('RegisterPropertyModalComponent', () => {
  let component: RegisterPropertyModalComponent;
  let fixture: ComponentFixture<RegisterPropertyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterPropertyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPropertyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
