import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftnotesComponent } from './shiftnotes.component';

describe('ShiftnotesComponent', () => {
  let component: ShiftnotesComponent;
  let fixture: ComponentFixture<ShiftnotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftnotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftnotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
