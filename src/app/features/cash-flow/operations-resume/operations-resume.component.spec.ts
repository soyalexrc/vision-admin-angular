import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsResumeComponent } from './operations-resume.component';

describe('OperationsResumeComponent', () => {
  let component: OperationsResumeComponent;
  let fixture: ComponentFixture<OperationsResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsResumeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationsResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
