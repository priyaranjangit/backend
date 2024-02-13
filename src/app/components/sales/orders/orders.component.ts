import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { Global } from 'src/app/shared/services/global';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: [];
  settings = {
    actions: false,
    columns: {
      orderId:{
        title : "Order Id"
      },
      invoiceNo: {
        title: "Invoice No"
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

  constructor(private _toastr: ToastrService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this._commonService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportManageOrder").subscribe(res => {
      if (res.isSuccess) {
        debugger;
        this.orders = res.data;
      } else {
        this._toastr.error(res.errors[0], "Order");
      }
    });
  }

}
