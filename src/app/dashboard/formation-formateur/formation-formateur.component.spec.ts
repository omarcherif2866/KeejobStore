import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationFormateurComponent } from './formation-formateur.component';

describe('FormationFormateurComponent', () => {
  let component: FormationFormateurComponent;
  let fixture: ComponentFixture<FormationFormateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationFormateurComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationFormateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
