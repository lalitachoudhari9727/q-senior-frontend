import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
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
    PaginationComponent,
  ],
  templateUrl: './securities-list.component.html',
  styleUrl: './securities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecuritiesListComponent {
  @ViewChild(PaginationComponent) paginator!: PaginationComponent;
  protected displayedColumns: string[] = ['name', 'type', 'currency'];
  filter: any = { skip: 0, limit: 5 };
  totalCount = SECURITIES.length;
  pageSize = 5;
  pageIndex = 0;
  private _securityService = inject(SecurityService);
  protected loadingSecurities$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  protected securities$: Observable<Security[]> = this._securityService
    .getSecurities(this.filter)
    .pipe(indicate(this.loadingSecurities$));

  ngOnInit() {
    console.log('seurity list rendered');
    //this.load();
  }
  onFilterChanged(event: any) {
    if (!event.isClearFilter) {
      this.filter = { skip: 0, limit: 5, ...event };
    } else {
      this.filter = {
        skip: 0, // reset to first page
        limit: this.pageSize, // keep current page size
        name: '',
        types: [],
        currencies: [],
        isPrivate: undefined,
      };

      // this.filter = cleared;
      console.log('cleared..', this.filter);
    }

    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.load();
  }

  onPageChange(event: { skip: number; limit: number }) {
    // console.log('onpagechange filter..', this.filter, event);
    this.filter.skip = event.skip;
    this.filter.limit = event.limit;
    this.load();
  }
  load() {
    const activeFilter = { ...this.filter };

    this.securities$ = this._securityService
      .getSecurities(activeFilter)
      .pipe(indicate(this.loadingSecurities$));

    this.calcTotalCount(activeFilter);
    //this.calcTotalCount();
  }
  get currentPageIndex(): number {
    return Math.floor(this.filter.skip / this.filter.limit);
  }
  calcTotalCount(activeFilter: any) {
    const countFilter = { ...activeFilter };
    delete countFilter.skip;
    delete countFilter.limit;

    this._securityService
      .getSecurities(countFilter)
      .pipe(indicate(this.loadingSecurities$))
      .subscribe((data) => {
        this.totalCount = data.length;
        // Reset paginator if total items less than current page
        if (this.paginator) {
          const maxPageIndex = Math.floor(
            (this.totalCount - 1) / this.filter.limit
          );
          if (this.paginator.pageIndex > maxPageIndex) {
            this.paginator.pageIndex = 0;
            this.filter.skip = 0;
            this.load(); // reload first page
          }
        }
      });
  }
}
