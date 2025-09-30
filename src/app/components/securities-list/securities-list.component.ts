import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
} from '@angular/material/table';
import { Observable, BehaviorSubject } from 'rxjs';
import { indicate } from '../../utils';
import { Security } from '../../models/security';
import { SecurityService } from '../../services/security.service';
import { FilterableTableComponent } from '../filterable-table/filterable-table.component';
import { AsyncPipe } from '@angular/common';
import { SECURITIES } from '../../mocks/securities-mocks';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'securities-list',
  standalone: true,
  imports: [
    FilterableTableComponent,
    AsyncPipe,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatNoDataRow,
    MatRowDef,
    MatRow,
    PaginationComponent
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  protected displayedColumns: string[] = ['name', 'type', 'currency'];
  filter: any = { skip: 0, limit: 10 }; 
   totalCount = SECURITIES.length;

  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  protected securities$: Observable<Security[]> = this._securityService
    .getSecurities(this.filter)
    .pipe(indicate(this.loadingSecurities$));

  onFilterChanged(event: any) {
    this.filter = { ...this.filter, ...event, skip: 0 }; // reset to first page on filter change
    this.load();
  }
onPageChange(event: { skip: number; limit: number }) {
  this.filter = { ...this.filter, ...event };
  this.load();
}
  load() {
    console.log('req body',this.filter)
    this.securities$ = this._securityService
      .getSecurities(this.filter)
      .pipe(indicate(this.loadingSecurities$));
  }
}
