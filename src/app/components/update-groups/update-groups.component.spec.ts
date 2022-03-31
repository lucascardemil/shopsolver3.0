import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateGroupsComponent } from './update-groups.component';

describe('UpdateGroupsComponent', () => {
  let component: UpdateGroupsComponent;
  let fixture: ComponentFixture<UpdateGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateGroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
