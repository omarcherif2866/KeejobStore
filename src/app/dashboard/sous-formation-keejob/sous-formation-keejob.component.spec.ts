import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SousFormationKeejobComponent } from './sous-formation-keejob.component';

describe('SousFormationKeejobComponent', () => {
  let component: SousFormationKeejobComponent;
  let fixture: ComponentFixture<SousFormationKeejobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SousFormationKeejobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SousFormationKeejobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
