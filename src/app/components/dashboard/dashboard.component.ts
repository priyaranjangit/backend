import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { Global } from 'src/app/shared/services/global';
import * as chartData from '../../shared/charts/chartsData';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  count = {
    from: 0,
    duration: 1,
    Orders: 0,
    ShippingAmount: 0,
    CashOnDelivery: 0,
    Cancelled: 0
  };

  orders: [];
  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      orderId: {
        title: "Order Id"
      },
      invoiceNo: {
        title: "Invoice No"
      },
      paymentStatus: {
        title: "Payment Status", type: 'html'
      },
      paymentMethod: {
        title: "Payment Method"
      },
      paymentDate: {
        title: "Payment Date"
      },
      orderStatus: {
        title: "Order Status", type: 'html'
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

  //line chart start
  lineChartOptions: any;
  lineChartLegend: any;
  lineChartType: any;
  lineChartData = [];
  lineChartLabels: any;
  //line chart end


  constructor(private _toastr: ToastrService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.getData();
    this.GetReportNetFigure();
    this.GetChartData();
  }

  getData() {
    this._commonService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportManageOrder").subscribe(res => {
      if (res.isSuccess) {
        this.orders = res.data;
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

  GetReportNetFigure() {
    this._commonService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportNetFigure").subscribe(res => {
      if (res.isSuccess) {
        this.count.Orders = res.data[0].orders;
        this.count.ShippingAmount = res.data[0].shippingAmount;
        this.count.CashOnDelivery = res.data[0].cashOnDelivery;
        this.count.Cancelled = res.data[0].cancelled;
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }


  GetChartData() {
    // this.lineChartOptions = chartData.lineChartOptions;
    // this.lineChartLegend = chartData.lineChartLegend;
    // this.lineChartType = chartData.lineChartType;
    // this.lineChartData = [
    //   { data: [1, 1, 2, 1, 2, 2], label: 'Series A' },
    //   { data: [0, 1, 1, 2, 1, 1], label: 'Series B' },
    //   { data: [0, 1, 0, 1, 2, 1], label: 'Series C' },
    //   { data: [1, 2, 3, 2, 1, 3], label: 'Series D' }
    // ];

    //this.lineChartLabels = ["1 min.", "10 min.", "20 min.", "30 min.", "40 min.", "50 min."];


    //
    let objLineChartData = {};
    let arr = [];
    this._commonService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartOrderStatus").subscribe(res => {
      if (res.isSuccess) {

        // counts: 1 date: "08-02-2022" orderStatus: "Processing"
        let allData = res.data;
        this.lineChartLabels = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

        for (let status of allOrderStatus) {
          arr = [];
          for (let date of this.lineChartLabels) {
            for (let index in allData) {
              if (status === allData[index].orderStatus && date === allData[index].date) {
                arr[arr.length] = allData[index].counts;
              }
            }
          }
       
          objLineChartData = { data: arr, label: status };
          this.lineChartData[this.lineChartData.length] = objLineChartData;

          this.lineChartOptions = chartData.lineChartOptions;
          this.lineChartLegend = chartData.lineChartLegend;
          this.lineChartType = chartData.lineChartType;
        }

      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

}
