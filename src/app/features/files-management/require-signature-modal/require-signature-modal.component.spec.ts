import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequireSignatureModalComponent } from './require-signature-modal.component';

describe('RequireSignatureModalComponent', () => {
  let component: RequireSignatureModalComponent;
  let fixture: ComponentFixture<RequireSignatureModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequireSignatureModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequireSignatureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
