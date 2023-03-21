import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TabComponent } from './tab.component';
describe('About Component', () => {
  let fixture: ComponentFixture<TabComponent>;
  let component: TabComponent;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [TabComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`Should create ${TabComponent.name}`, () => {
    expect(component).toBeTruthy();
  });

  it('should have .hidden class', () => {
    const element = fixture.debugElement.query(By.css('.hidden'));
    // const element2 = fixture.nativeElement.query('.hidden');
    // const element3 = document.querySelector('.hidden');
    expect(element).toBeTruthy();
  });

  it('should not have .hidden class', () => {
    component.active = true;
    fixture.detectChanges();
    const element = fixture.debugElement.query(By.css('.hidden'));
    expect(element).not.toBeTruthy();
  });
});
