import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AToZListComponent } from './a-to-z-list.component';

describe('AToZListComponent', () => {
  let component: AToZListComponent;
  let fixture: ComponentFixture<AToZListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AToZListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AToZListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
