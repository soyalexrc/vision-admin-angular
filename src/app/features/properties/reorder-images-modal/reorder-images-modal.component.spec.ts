import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderImagesModalComponent } from './reorder-images-modal.component';

describe('ReorderImagesModalComponent', () => {
  let component: ReorderImagesModalComponent;
  let fixture: ComponentFixture<ReorderImagesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReorderImagesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReorderImagesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
