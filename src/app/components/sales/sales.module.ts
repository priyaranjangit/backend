import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  declarations: [
    OrdersComponent,
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    Ng2SmartTableModule
  ]
})
export class SalesModule { }
