import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSessionComponent } from './remove-session.component';

describe('RemoveSessionComponent', () => {
  let component: RemoveSessionComponent;
  let fixture: ComponentFixture<RemoveSessionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveSessionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
