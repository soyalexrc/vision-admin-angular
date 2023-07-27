import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterClientModalComponent } from './register-client-modal.component';

describe('RegisterClientModalComponent', () => {
  let component: RegisterClientModalComponent;
  let fixture: ComponentFixture<RegisterClientModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterClientModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterClientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
