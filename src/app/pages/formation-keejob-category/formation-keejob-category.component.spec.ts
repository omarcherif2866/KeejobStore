import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationKeejobCategoryComponent } from './formation-keejob-category.component';

describe('FormationKeejobCategoryComponent', () => {
  let component: FormationKeejobCategoryComponent;
  let fixture: ComponentFixture<FormationKeejobCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationKeejobCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationKeejobCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
