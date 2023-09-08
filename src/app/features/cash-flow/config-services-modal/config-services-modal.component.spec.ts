import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigServicesModalComponent } from './config-services-modal.component';

describe('ConfigServicesModalComponent', () => {
  let component: ConfigServicesModalComponent;
  let fixture: ComponentFixture<ConfigServicesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigServicesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigServicesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
