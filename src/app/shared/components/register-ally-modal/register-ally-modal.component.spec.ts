import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAllyModalComponent } from './register-ally-modal.component';

describe('RegisterAllyModalComponent', () => {
  let component: RegisterAllyModalComponent;
  let fixture: ComponentFixture<RegisterAllyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAllyModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAllyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
