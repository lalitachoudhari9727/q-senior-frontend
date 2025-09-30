import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule,MatPaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
 @Input() length = 0;              // total items
  @Input() pageSize = 10;           // items per page
  @Input() pageSizeOptions = [5, 10, 20, 50]; // page size dropdown

  @Output() pageChange = new EventEmitter<{ skip: number; limit: number }>();

  onPageChanged(event: PageEvent) {
    const skip = event.pageIndex * event.pageSize;
    const limit = event.pageSize;
    this.pageChange.emit({ skip, limit });
  }
}
