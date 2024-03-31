import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDateSelectorComponent } from './filter-date-selector.component';

describe('FilterDateSelectorComponent', () => {
  let component: FilterDateSelectorComponent;
  let fixture: ComponentFixture<FilterDateSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterDateSelectorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDateSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
