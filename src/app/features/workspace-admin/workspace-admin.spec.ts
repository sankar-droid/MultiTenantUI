import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceAdmin } from './workspace-admin';

describe('WorkspaceAdmin', () => {
  let component: WorkspaceAdmin;
  let fixture: ComponentFixture<WorkspaceAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});