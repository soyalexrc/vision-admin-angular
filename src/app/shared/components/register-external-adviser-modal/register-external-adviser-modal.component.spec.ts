import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterExternalAdviserModalComponent } from './register-external-adviser-modal.component';

describe('RegisterExternalAdviserModalComponent', () => {
  let component: RegisterExternalAdviserModalComponent;
  let fixture: ComponentFixture<RegisterExternalAdviserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterExternalAdviserModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterExternalAdviserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
