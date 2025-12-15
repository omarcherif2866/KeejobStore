import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoachingCategoryComponent } from './coaching-category.component';

describe('CoachingCategoryComponent', () => {
  let component: CoachingCategoryComponent;
  let fixture: ComponentFixture<CoachingCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoachingCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoachingCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
