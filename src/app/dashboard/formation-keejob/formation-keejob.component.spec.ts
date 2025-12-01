import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationKeejobComponent } from './formation-keejob.component';

describe('FormationKeejobComponent', () => {
  let component: FormationKeejobComponent;
  let fixture: ComponentFixture<FormationKeejobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormationKeejobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormationKeejobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
