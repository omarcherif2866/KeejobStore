import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationKeejobDetailsComponent } from './formation-keejob-details.component';

describe('FormationKeejobDetailsComponent', () => {
  let component: FormationKeejobDetailsComponent;
  let fixture: ComponentFixture<FormationKeejobDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationKeejobDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationKeejobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
