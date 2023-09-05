import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPersonModalComponent } from './register-person-modal.component';

describe('RegisterPersonModalComponent', () => {
  let component: RegisterPersonModalComponent;
  let fixture: ComponentFixture<RegisterPersonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterPersonModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
