import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function fullNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value || '').trim();

    if (!value) return null;

    const onlyLettersRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;

    if (!onlyLettersRegex.test(value)) {
      return { invalidName: true };
    }

    const words = value.split(/\s+/);

    if (words.length < 2) {
      return { incompleteName: true };
    }

    return null;
  };
}
