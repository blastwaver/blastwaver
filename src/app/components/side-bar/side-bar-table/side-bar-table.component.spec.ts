import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarTableComponent } from './side-bar-table.component';

describe('SideBarTableComponent', () => {
  let component: SideBarTableComponent;
  let fixture: ComponentFixture<SideBarTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
