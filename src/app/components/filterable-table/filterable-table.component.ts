import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  MatColumnDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FilterField } from '../../models/filter-config';
import { FilterBarComponent } from '../filter-bar/filter-bar.component';

@Component({
  selector: 'filterable-table',
  standalone: true,
  imports: [MatProgressSpinner, MatTable, FilterBarComponent],
  templateUrl: './filterable-table.component.html',
  styleUrl: './filterable-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterableTableComponent<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs?: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs?: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs?: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow?: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table?: MatTable<T>;

  @Input() columns: string[] = [];

  @Input() dataSource:
    | readonly T[]
    | DataSource<T>
    | Observable<readonly T[]>
    | null = null;
  @Input() isLoading: boolean | null = true;
  @Output() filterEventChanged = new EventEmitter<Partial<any>>();
  filter: any = { skip: 0, limit: 10 };

  fields: FilterField<any>[] = [
    { key: 'name', label: 'Name', type: 'text' },
    {
      key: 'types',
      label: 'Types',
      type: 'multiselect',
      options: [
        { label: 'Equity', value: 'Equity' },
        { label: 'BankAccount', value: 'BankAccount' },
      ],
    },
    {
      key: 'currencies',
      label: 'Currencies',
      type: 'multiselect',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
      ],
    },
    { key: 'isPrivate', label: 'Private', type: 'checkbox' },
  ];

  public ngAfterContentInit(): void {
    this.columnDefs?.forEach((columnDef) =>
      this.table?.addColumnDef(columnDef)
    );
    this.rowDefs?.forEach((rowDef) => this.table?.addRowDef(rowDef));
    this.headerRowDefs?.forEach((headerRowDef) =>
      this.table?.addHeaderRowDef(headerRowDef)
    );
    this.table?.setNoDataRow(this.noDataRow ?? null);
  }
  onFilterChanged(event: any) {
   // console.log(event);
    this.filterEventChanged.emit(event);
  }
}
