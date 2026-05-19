import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormRegistration } from "../../shared/components/form-registration/form-registration";

@Component({
  selector: 'app-home',
  imports: [FormRegistration],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home { }
