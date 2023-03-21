import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AboutComponent } from './about.component';
describe('About Component', () => {
  let fixture: ComponentFixture<AboutComponent>;
  let component: AboutComponent;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [AboutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`Should create ${AboutComponent.name}`, () => {
    expect(component).toBeTruthy();
  });
});
