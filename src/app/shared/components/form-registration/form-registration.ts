import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RegistrationService } from '../../../infra/services/registration.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { fullNameValidator } from '../../utilities/name-validator';

@Component({
  selector: 'app-form-registration',
  imports: [ReactiveFormsModule],
  templateUrl: './form-registration.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormRegistration {
  //injects
  private readonly registrationService = inject(RegistrationService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  public isLoading = signal(false);
  public successMessage = signal('');
  public errorMessage = signal('');

  public form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3), fullNameValidator()]],
    phone: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^[0-9]{10}$/),
      ],
    ],
    neighborhood: ['', [Validators.required]],
  });

  get fullName() {
    return this.form.controls.fullName;
  }

  get phone() {
    return this.form.controls.phone;
  }

  get neighborhood() {
    return this.form.controls.neighborhood;
  }

  public onlyNumbers(event: Event): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/\D/g, '').slice(0, 10);

    input.value = value;
    this.form.controls.phone.setValue(value, { emitEvent: false });
  }

  public onlyLetters(event: Event): void {
    const input = event.target as HTMLInputElement;

    const value = input.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, '');

    input.value = value;
    this.form.controls.fullName.setValue(value, { emitEvent: false });
  }

  public submit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.form.disable();

    this.registrationService
      .register(this.form.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.isLoading.set(false);
          this.form.enable();
        }),
      )
      .subscribe({
        next: (result) => {
          if (result === 'exists') {
            this.errorMessage.set('Este número ya está registrado.');
            return;
          }

          this.successMessage.set('Registro exitoso. Gracias por unirte como usuario fundador.');

          this.form.reset();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage.set('Ocurrió un error al registrar tus datos. Intenta nuevamente.');
        },
      });
  }
}
