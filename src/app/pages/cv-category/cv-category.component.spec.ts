import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvCategoryComponent } from './cv-category.component';

describe('CvCategoryComponent', () => {
  let component: CvCategoryComponent;
  let fixture: ComponentFixture<CvCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
