import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { Global } from 'src/app/shared/services/global';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  transactions: [];
  settings = {
    actions: false,
    columns: {
      transactionsId: {
        title: "Transactions Id"
      },
      orderId:{
        title:"Order Id"
      },
      paymentStatus: {
        title: "Payment Status",  type : 'html'
      },
      paymentMethod: {
        title: "Payment Method"
      },
      paymentDate: {
        title: "Payment Date",filter : false
      },
      orderStatus: {
        title: "Order Status",  type : 'html'
      }, shippingAmount: {
        title: "Shipping Amount"
      },
      subTotalAmount: {
        title: "SubTotal Amount"
      },
      totalAmount: {
        title: "Total Amount"
      }
    }
  }
  // orderId: "121212"
  // orderStatus: "<span class=\"badge badge-primary\">Shipped</span>"
  // paymentDate: "2019.12.26"
  // paymentMethod: "Credit Card"
  // paymentStatus: "<span class=\"badge badge-secondary\">Cash On Delivery</span>"
  // shippingAmount: 40
  // subTotalAmount: 800
  // totalAmount: 840
  // transactionsId: ""
  constructor(private _toastr: ToastrService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._commonService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportTransactionDetails").subscribe(res => {
      if (res.isSuccess) {
        debugger;
        this.transactions = res.data;
      } else {
        this._toastr.error(res.errors[0], "Transactions");
      }
    });
  }

}
