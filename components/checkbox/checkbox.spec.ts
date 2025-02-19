import { BidiModule, Dir, Direction } from '@angular/cdk/bidi';
import { ApplicationRef, Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { NzSafeAny } from 'ng-zorro-antd/core/types';

import { NzCheckBoxOptionInterface, NzCheckboxGroupComponent } from './checkbox-group.component';
import { NzCheckboxWrapperComponent } from './checkbox-wrapper.component';
import { NzCheckboxComponent } from './checkbox.component';
import { NzCheckboxModule } from './checkbox.module';

describe('checkbox', () => {
  describe('checkbox basic', () => {
    let fixture: ComponentFixture<NzTestCheckboxSingleComponent>;
    let testComponent: NzTestCheckboxSingleComponent;
    let checkbox: DebugElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(NzTestCheckboxSingleComponent);
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      checkbox = fixture.debugElement.query(By.directive(NzCheckboxComponent));
    });

    it('should className correct', () => {
      fixture.detectChanges();
      expect(checkbox.nativeElement.classList.contains('ant-checkbox-wrapper')).toBe(true);
      expect(checkbox.nativeElement.firstElementChild!.classList.contains('ant-checkbox')).toBe(true);
      expect(checkbox.nativeElement.firstElementChild.firstElementChild!.classList.contains('ant-checkbox-input')).toBe(
        true
      );
      expect(checkbox.nativeElement.firstElementChild.lastElementChild.classList.contains('ant-checkbox-inner')).toBe(
        true
      );
      expect(checkbox.nativeElement.lastElementChild.innerText).toBe(' Checkbox');
    });
    it('should click change', () => {
      fixture.detectChanges();
      expect(testComponent.checked).toBe(false);
      expect(checkbox.nativeElement.firstElementChild!.classList.contains('ant-checkbox-checked')).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      checkbox.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.checked).toBe(true);
      expect(checkbox.nativeElement.firstElementChild!.classList.contains('ant-checkbox-checked')).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    });
    it('should click input a11y correct', () => {
      fixture.detectChanges();
      const inputElement = checkbox.nativeElement.querySelector('input');
      expect(testComponent.checked).toBe(false);
      expect(inputElement.checked).toBe(false);
      expect(checkbox.nativeElement.firstElementChild.classList.contains('ant-checkbox-checked')).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      inputElement.click();
      fixture.detectChanges();
      expect(testComponent.checked).toBe(true);
      expect(checkbox.nativeElement.firstElementChild.classList.contains('ant-checkbox-checked')).toBe(true);
      expect(inputElement.checked).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
    });
    it('should ngModel change', fakeAsync(() => {
      testComponent.checked = true;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(testComponent.checked).toBe(true);
      expect(checkbox.nativeElement.firstElementChild!.classList.contains('ant-checkbox-checked')).toBe(true);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    }));
    it('should disabled work', () => {
      fixture.detectChanges();
      testComponent.disabled = true;
      fixture.detectChanges();
      expect(testComponent.checked).toBe(false);
      expect(checkbox.nativeElement.firstElementChild!.classList.contains('ant-checkbox-checked')).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      checkbox.nativeElement.click();
      fixture.detectChanges();
      expect(testComponent.checked).toBe(false);
      expect(checkbox.nativeElement.firstElementChild!.classList.contains('ant-checkbox-checked')).toBe(false);
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    });
    it('should indeterminate work', () => {
      fixture.detectChanges();
      testComponent.indeterminate = true;
      fixture.detectChanges();
      expect(checkbox.nativeElement.firstElementChild!.classList.contains('ant-checkbox-indeterminate')).toBe(true);
      testComponent.checked = true;
      fixture.detectChanges();
      expect(checkbox.nativeElement.firstElementChild!.classList.contains('ant-checkbox-indeterminate')).toBe(true);
    });
    it('should autofocus work', () => {
      fixture.detectChanges();
      testComponent.autoFocus = true;
      fixture.detectChanges();
      expect(checkbox.nativeElement.querySelector('input').attributes.getNamedItem('autofocus').name).toBe('autofocus');
      testComponent.autoFocus = false;
      fixture.detectChanges();
      expect(checkbox.nativeElement.querySelector('input').attributes.getNamedItem('autofocus')).toBe(null);
    });
    it('should focus and blur function work', () => {
      fixture.detectChanges();
      expect(checkbox.nativeElement.querySelector('input') === document.activeElement).toBe(false);
      testComponent.nzCheckboxComponent.focus();
      fixture.detectChanges();
      expect(checkbox.nativeElement.querySelector('input') === document.activeElement).toBe(true);
      testComponent.nzCheckboxComponent.blur();
      fixture.detectChanges();
      expect(checkbox.nativeElement.querySelector('input') === document.activeElement).toBe(false);
    });
    describe('change detection behavior', () => {
      it('should not run change detection when the `input` is clicked', () => {
        const appRef = TestBed.inject(ApplicationRef);
        const event = new MouseEvent('click');

        spyOn(appRef, 'tick');
        spyOn(event, 'stopPropagation').and.callThrough();

        const nzCheckbox = fixture.debugElement.query(By.directive(NzCheckboxComponent));
        nzCheckbox.nativeElement.querySelector('.ant-checkbox-input').dispatchEvent(event);

        expect(appRef.tick).not.toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      });
      it('should not run change detection when the `nz-checkbox` is clicked and it is disabled', () => {
        testComponent.disabled = true;
        fixture.detectChanges();

        const appRef = TestBed.inject(ApplicationRef);
        const event = new MouseEvent('click');

        spyOn(appRef, 'tick');
        spyOn(event, 'preventDefault').and.callThrough();

        const nzCheckbox = fixture.debugElement.query(By.directive(NzCheckboxComponent));
        nzCheckbox.nativeElement.dispatchEvent(event);

        expect(appRef.tick).not.toHaveBeenCalled();
        expect(event.preventDefault).toHaveBeenCalled();
      });
    });
  });
  describe('checkbox group basic', () => {
    let fixture: ComponentFixture<NzTestCheckboxGroupComponent>;
    let testComponent: NzTestCheckboxGroupComponent;
    let checkboxGroup: DebugElement;
    let checkboxes: HTMLElement[];

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NzTestCheckboxGroupComponent);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      checkboxGroup = fixture.debugElement.query(By.directive(NzCheckboxGroupComponent));
      checkboxes = checkboxGroup.nativeElement.children;
    }));
    it('should className correct', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(checkboxGroup.nativeElement.classList).toContain('ant-checkbox-group');
      expect(checkboxes[0].firstElementChild!.classList).toContain('ant-checkbox-checked');
      expect(checkboxes[1].firstElementChild!.classList).toContain('ant-checkbox-disabled');
      expect(checkboxes[1].firstElementChild!.classList).not.toContain('ant-checkbox-checked');
      expect(checkboxes[2].firstElementChild!.classList).not.toContain('ant-checkbox-checked');
    }));
    it('should click correct', () => {
      fixture.detectChanges();
      fixture.detectChanges();
      checkboxes[0].click();
      fixture.detectChanges();
      expect(testComponent.modelChange).toHaveBeenCalledTimes(1);
      expect(checkboxes[0].firstElementChild!.classList).not.toContain('ant-checkbox-checked');
    });
    it('should sub disabled work', () => {
      fixture.detectChanges();
      fixture.detectChanges();
      checkboxes[1].click();
      fixture.detectChanges();
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      expect(checkboxes[1].firstElementChild!.classList).not.toContain('ant-checkbox-checked');
    });
    it('should all disabled work', () => {
      testComponent.disabled = true;
      fixture.detectChanges();
      fixture.detectChanges();
      checkboxes[2].click();
      fixture.detectChanges();
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
      expect(checkboxes[2].firstElementChild!.classList).not.toContain('ant-checkbox-checked');
    });
    it('should ngModel work', fakeAsync(() => {
      fixture.detectChanges();
      testComponent.options[0].checked = false;
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      expect(checkboxes[0].firstElementChild!.classList).not.toContain('ant-checkbox-checked');
      expect(testComponent.modelChange).toHaveBeenCalledTimes(0);
    }));
  });
  describe('checkbox form', () => {
    let fixture: ComponentFixture<NzTestCheckboxFormComponent>;
    let testComponent: NzTestCheckboxFormComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(NzTestCheckboxFormComponent);
      testComponent = fixture.componentInstance;
    });
    it('should be in pristine, untouched, and valid states and enable initially', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      const checkbox = fixture.debugElement.query(By.directive(NzCheckboxComponent));
      const inputElement = checkbox.nativeElement.querySelector('input') as HTMLInputElement;
      expect(checkbox.nativeElement.firstElementChild!.classList).not.toContain('ant-checkbox-disabled');
      expect(inputElement.disabled).toBeFalsy();
      expect(testComponent.formControl.valid).toBe(true);
      expect(testComponent.formControl.pristine).toBe(true);
      expect(testComponent.formControl.touched).toBe(false);
    }));
    it('should be disable if form is disable and nzDisable set to false', fakeAsync(() => {
      testComponent.disable();
      fixture.detectChanges();
      flush();
      const checkbox = fixture.debugElement.query(By.directive(NzCheckboxComponent));
      const inputElement = checkbox.nativeElement.querySelector('input') as HTMLInputElement;
      expect(checkbox.nativeElement.firstElementChild!.classList).toContain('ant-checkbox-disabled');
      expect(inputElement.disabled).toBeTruthy();
    }));
    it('should set disabled work', fakeAsync(() => {
      testComponent.disabled = true;
      fixture.detectChanges();
      flush();
      const checkbox = fixture.debugElement.query(By.directive(NzCheckboxComponent));
      const inputElement = checkbox.nativeElement.querySelector('input') as HTMLInputElement;

      expect(checkbox.nativeElement.firstElementChild!.classList).toContain('ant-checkbox-disabled');
      expect(inputElement.disabled).toBeTruthy();
      inputElement.click();
      flush();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(false);

      testComponent.enable();
      fixture.detectChanges();
      flush();
      expect(checkbox.nativeElement.firstElementChild!.classList).not.toContain('ant-checkbox-disabled');
      expect(inputElement.disabled).toBeFalsy();
      inputElement.click();
      flush();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(true);

      testComponent.disable();
      fixture.detectChanges();
      flush();
      expect(checkbox.nativeElement.firstElementChild!.classList).toContain('ant-checkbox-disabled');
      expect(inputElement.disabled).toBeTruthy();
      inputElement.click();
      flush();
      fixture.detectChanges();
      expect(testComponent.formControl.value).toBe(true);
    }));
  });
  describe('checkbox group form', () => {
    let fixture: ComponentFixture<NzTestCheckboxGroupFormComponent>;
    let testComponent: NzTestCheckboxGroupFormComponent;
    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NzTestCheckboxGroupFormComponent);
      testComponent = fixture.componentInstance;
    }));
    it('should be in pristine, untouched, and valid states initially', fakeAsync(() => {
      fixture.detectChanges();
      flush();
      const checkboxGroupComponent: NzCheckboxGroupComponent = fixture.debugElement.query(
        By.directive(NzCheckboxGroupComponent)
      ).componentInstance;
      expect(testComponent.formControl.valid).toBe(true);
      expect(testComponent.formControl.pristine).toBe(true);
      expect(testComponent.formControl.touched).toBe(false);
      expect(checkboxGroupComponent.nzDisabled).toBeFalsy();
    }));
    it('should be disable if form is disable and nzDisable set to false initially', fakeAsync(() => {
      testComponent.formControl.disable();
      fixture.detectChanges();
      flush();
      const checkboxGroup = fixture.debugElement.query(By.directive(NzCheckboxGroupComponent));
      expect(checkboxGroup.componentInstance.nzDisabled).toBeTruthy();
    }));
    it('should set disabled work', fakeAsync(() => {
      testComponent.nzDisabled = true;
      fixture.detectChanges();
      flush();
      const checkboxGroup = fixture.debugElement.query(By.directive(NzCheckboxGroupComponent));
      const inputElement = checkboxGroup.nativeElement.querySelector('input') as HTMLInputElement;
      expect(checkboxGroup.componentInstance.nzDisabled).toBeTruthy();

      inputElement.click();
      fixture.detectChanges();
      expect(JSON.stringify(testComponent.formControl.value)).toBe(
        JSON.stringify([
          { label: 'Apple', value: 'Apple', checked: true },
          { label: 'Pear', value: 'Pear', disabled: true },
          { label: 'Orange', value: 'Orange' }
        ])
      );

      testComponent.enable();
      fixture.detectChanges();
      flush();
      expect(checkboxGroup.componentInstance.nzDisabled).toBeFalsy();

      inputElement.click();
      fixture.detectChanges();
      expect(JSON.stringify(testComponent.formControl.value)).toBe(
        JSON.stringify([
          { label: 'Apple', value: 'Apple', checked: false },
          { label: 'Pear', value: 'Pear', disabled: true },
          { label: 'Orange', value: 'Orange' }
        ])
      );

      testComponent.disable();
      fixture.detectChanges();
      flush();
      expect(checkboxGroup.componentInstance.nzDisabled).toBeTruthy();

      inputElement.click();
      fixture.detectChanges();
      expect(JSON.stringify(testComponent.formControl.value)).toBe(
        JSON.stringify([
          { label: 'Apple', value: 'Apple', checked: false },
          { label: 'Pear', value: 'Pear', disabled: true },
          { label: 'Orange', value: 'Orange' }
        ])
      );
    }));
  });
  describe('checkbox wrapper', () => {
    let fixture: ComponentFixture<NzTestCheckboxWrapperComponent>;
    let testComponent: NzTestCheckboxWrapperComponent;
    let checkboxWrapper: DebugElement;
    let inputElement: HTMLInputElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(NzTestCheckboxWrapperComponent);
      fixture.detectChanges();
      flush();
      fixture.detectChanges();
      testComponent = fixture.debugElement.componentInstance;
      checkboxWrapper = fixture.debugElement.query(By.directive(NzCheckboxWrapperComponent));
      inputElement = checkboxWrapper.nativeElement.querySelector('input') as HTMLInputElement;
    }));
    it('should className correct', fakeAsync(() => {
      expect(checkboxWrapper.nativeElement.classList).toContain('ant-checkbox-group');
    }));
    it('should onChange correct', fakeAsync(() => {
      inputElement.click();
      flush();
      fixture.detectChanges();
      expect(testComponent.onChange).toHaveBeenCalledWith([]);
      expect(testComponent.onChange).toHaveBeenCalledTimes(1);
    }));
  });
  describe('RTL', () => {
    it('should single checkbox className correct on dir change', () => {
      const fixture = TestBed.createComponent(NzTestCheckboxSingleRtlComponent);
      const checkbox = fixture.debugElement.query(By.directive(NzCheckboxComponent));
      fixture.detectChanges();
      expect(checkbox.nativeElement.classList).toContain('ant-checkbox-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(checkbox.nativeElement.classList).not.toContain('ant-checkbox-rtl');
    });

    it('should group checkbox className correct on dir change', () => {
      const fixture = TestBed.createComponent(NzTestCheckboxGroupRtlComponent);
      const checkbox = fixture.debugElement.query(By.directive(NzCheckboxGroupComponent));
      fixture.detectChanges();
      expect(checkbox.nativeElement.classList).toContain('ant-checkbox-group-rtl');

      fixture.componentInstance.direction = 'ltr';
      fixture.detectChanges();
      expect(checkbox.nativeElement.classList).not.toContain('ant-checkbox-group-rtl');
    });
  });
});

@Component({
  imports: [FormsModule, NzCheckboxModule],
  selector: 'nz-test-single-checkbox',
  template: `
    <label
      nz-checkbox
      [nzDisabled]="disabled"
      [(ngModel)]="checked"
      [nzAutoFocus]="autoFocus"
      [nzIndeterminate]="indeterminate"
      (ngModelChange)="modelChange($event)"
    >
      Checkbox
    </label>
  `
})
export class NzTestCheckboxSingleComponent {
  @ViewChild(NzCheckboxComponent, { static: false }) nzCheckboxComponent!: NzCheckboxComponent;
  disabled = false;
  autoFocus = false;
  checked = false;
  indeterminate = false;
  modelChange = jasmine.createSpy('change callback');
}

@Component({
  imports: [FormsModule, NzCheckboxModule],
  selector: 'nz-test-group-checkbox',
  template: `
    <nz-checkbox-group
      [nzDisabled]="disabled"
      [ngModel]="options"
      (ngModelChange)="modelChange($event)"
    ></nz-checkbox-group>
  `
})
export class NzTestCheckboxGroupComponent {
  options = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', disabled: true },
    { label: 'Orange', value: 'Orange' }
  ];
  disabled = false;
  modelChange = jasmine.createSpy('change callback');
}

@Component({
  imports: [FormsModule, NzCheckboxModule],
  template: `
    <nz-checkbox-wrapper (nzOnChange)="onChange($event)">
      <div><label nz-checkbox nzValue="A" [ngModel]="true">A</label></div>
      <div><label nz-checkbox nzValue="B">B</label></div>
      <div><label nz-checkbox nzValue="C">C</label></div>
      <div><label nz-checkbox nzValue="D">D</label></div>
      <div><label nz-checkbox nzValue="E">E</label></div>
    </nz-checkbox-wrapper>
  `
})
export class NzTestCheckboxWrapperComponent {
  onChange = jasmine.createSpy('change callback');
}

@Component({
  imports: [ReactiveFormsModule, NzCheckboxModule],
  template: `
    <form>
      <label nz-checkbox [formControl]="formControl" [nzDisabled]="disabled"></label>
    </form>
  `
})
export class NzTestCheckboxFormComponent {
  formControl = new FormControl(false);
  disabled = false;

  disable(): void {
    this.formControl.disable();
  }

  enable(): void {
    this.formControl.enable();
  }
}

@Component({
  imports: [ReactiveFormsModule, NzCheckboxModule],
  template: `
    <form>
      <nz-checkbox-group [formControl]="formControl" [nzDisabled]="nzDisabled"></nz-checkbox-group>
    </form>
  `
})
export class NzTestCheckboxGroupFormComponent {
  formControl = new FormControl<NzCheckBoxOptionInterface[] | null>([
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', disabled: true },
    { label: 'Orange', value: 'Orange' }
  ]);
  nzDisabled = false;

  disable(): void {
    this.formControl.disable();
  }

  enable(): void {
    this.formControl.enable();
  }
}

@Component({
  imports: [BidiModule, NzTestCheckboxSingleComponent],
  template: `
    <div [dir]="direction">
      <nz-test-single-checkbox></nz-test-single-checkbox>
    </div>
  `
})
export class NzTestCheckboxSingleRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

@Component({
  imports: [BidiModule, NzTestCheckboxGroupComponent],
  template: `
    <div [dir]="direction">
      <nz-test-group-checkbox></nz-test-group-checkbox>
    </div>
  `
})
export class NzTestCheckboxGroupRtlComponent {
  @ViewChild(Dir) dir!: Dir;
  direction: Direction = 'rtl';
}

describe('checkbox component', () => {
  let fixture: ComponentFixture<NzCheckboxComponent>;
  let component: NzCheckboxComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(NzCheckboxComponent);
    component = fixture.componentInstance;
  });

  it('focus should be called in afterViewInit if nzAutoFocus is set', () => {
    spyOn(component, 'focus');
    component.nzAutoFocus = false;
    component.ngAfterViewInit();
    expect(component.focus).not.toHaveBeenCalled();

    spyOn(component, 'focus');
    component.nzAutoFocus = true;
    component.ngAfterViewInit();
    expect(component.focus).toHaveBeenCalled();
  });

  describe('checkbox wrapper component', () => {
    let fixture: ComponentFixture<NzCheckboxWrapperComponent>;
    let component: NzCheckboxWrapperComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(NzCheckboxWrapperComponent);
      component = fixture.componentInstance;
    });

    it('should emit correct value', () => {
      (component as NzSafeAny)['checkboxList'] = [
        {
          nzChecked: true,
          nzValue: 'value 1'
        },
        {
          nzChecked: true,
          nzValue: 'value 2'
        },
        {
          nzChecked: false,
          nzValue: 'value 3'
        }
      ];
      spyOn(component.nzOnChange, 'emit');
      component.onChange();
      expect(component.nzOnChange.emit).toHaveBeenCalledWith(['value 1', 'value 2']);
    });
  });

  describe('checkbox group component', () => {
    let fixture: ComponentFixture<NzCheckboxGroupComponent>;
    let component: NzCheckboxGroupComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(NzCheckboxGroupComponent);
      component = fixture.componentInstance;
    });

    it('should have correct initial value', () => {
      expect(component.onChange).toBeDefined();
      expect(component.onChange).toEqual(jasmine.any(Function));
      expect(component.onChange({})).toBeUndefined();

      expect(component.onTouched).toBeDefined();
      expect(component.onTouched).toEqual(jasmine.any(Function));
      expect(component.onTouched()).toBeUndefined();
    });
  });
});
