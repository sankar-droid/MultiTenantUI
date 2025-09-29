import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileAdmin } from './file-admin';

describe('FileAdmin', () => {
  let component: FileAdmin;
  let fixture: ComponentFixture<FileAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});