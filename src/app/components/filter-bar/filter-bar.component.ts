import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FilterField } from '../../models/filter-config';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  @Input() fields: FilterField<any>[] = [];
  @Input() initialValue: Partial<any> | null = null;
  @Output() filterChanged = new EventEmitter<Partial<any>>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    const group: any = {};
    this.fields.forEach((f) => {
      group[f.key] = [f.type === 'checkbox' ? false : null]; // default values
    });
    this.form = this.fb.group(group);
   
  }
  onApplyFilterClicked() {
    let data = this.form.value;
    this.filterChanged.emit(data);
  }
}
