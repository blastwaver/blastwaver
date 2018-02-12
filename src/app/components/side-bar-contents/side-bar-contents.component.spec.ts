import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideBarContentsComponent } from './side-bar-contents.component';

describe('SideBarContentsComponent', () => {
  let component: SideBarContentsComponent;
  let fixture: ComponentFixture<SideBarContentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideBarContentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarContentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
