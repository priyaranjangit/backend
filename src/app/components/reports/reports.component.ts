import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { Global } from 'src/app/shared/services/global';
import * as chartData from '../../shared/charts/chartsData';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  //line chart start
  lineChartOptions: any;
  lineChartLegend: any;
  lineChartType: any;
  lineChartData = [];
  lineChartLabels: any;
  //line chart end

  invoice: [];
  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
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
        title: "Payment Date", filter: false
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

  chart: any;
  columnChart: any;
  lineChart: any;

  constructor(private _toastr: ToastrService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.getData();
    this.GetSalesDataPaymentTypeWise();
    this.CustomerGrowth();
    this.getChartOrderStatus_ColumnChart();
    this.getChartOrderStatus_LineChart();
  }

  getData() {
    this._commonService.get(Global.BASE_API_PATH + "PaymentMaster/GetReportInvoiceList").subscribe(res => {
      if (res.isSuccess) {
        this.invoice = res.data;
      } else {
        this._toastr.error(res.errors[0], "Report");
      }
    });
  }

  GetSalesDataPaymentTypeWise() {
    let objLineChartData = {};
    let arr = [];
    this._commonService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartSalesDataPaymentTypeWise").subscribe(res => {
      if (res.isSuccess) {
        //debugger;
        // counts: 1 date: "08-02-2022" paymentType: "Cash On Delivery"
        let allData = res.data;
        this.lineChartLabels = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
        let allPaymentType = allData.map(item => item.paymentType).filter((value, index, self) => self.indexOf(value) === index);

        for (let type of allPaymentType) {
          arr = [];
          for (let date of this.lineChartLabels) {
            for (let index in allData) {
              if (type === allData[index].paymentType && date === allData[index].date) {
                arr[arr.length] = allData[index].counts;
              }
            }
          }

          objLineChartData = { data: arr, label: type };
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

  CustomerGrowth() {
    let CustomerGrowthData = [];
    this._commonService.get(Global.BASE_API_PATH + "PaymentMaster/GetChartUserGrowth").subscribe(res => {
      if (res.isSuccess) {
        CustomerGrowthData = res.data.map(item => item.counts);

        this.chart = {
          type: 'Line',
          data: {
            labels: [],
            series: [
              // [3, 4, 3, 5, 4, 3, 5]
              CustomerGrowthData
            ]
          },
          options: {
            showScale: false,
            fullWidth: !0,
            showArea: !0,
            label: false,
            width: '100%',
            height: '358',
            low: 0,
            offset: 0,
            axisX: {
              showLabel: false,
              showGrid: false
            },
            axisY: {
              showLabel: false,
              showGrid: false,
              low: 0,
              offset: -10,
            },
          }
        };

      } else {
        this._toastr.error(res.errors[0], "Report");
      }
    });
  }
  getChartOrderStatus_ColumnChart() {
    //google-chart - ColumnChart
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: [
        ["Year", "Sales", "Expenses"],
        ["100", 2.5, 3.8],
        ["200", 3, 1.8],
        ["300", 3, 4.3],
        ["400", 0.9, 2.3],
        ["500", 1.3, 3.6],
        ["600", 1.8, 2.8],
        ["700", 3.8, 2.8],
        ["800", 1.5, 2.8]
      ],
      options: {
        legend: { position: 'none' },
        bars: "vertical",
        vAxis: {
          format: "decimal"
        },
        height: 340,
        width: '100%',
        colors: ["#ff7f83", "#a5a5a5"],
        backgroundColor: 'transparent'
      },
    };
  }

  getChartOrderStatus_LineChart() {
    //google-chart - LineChart
    this.lineChart = {
      chartType: 'LineChart',
      dataTable: [
        ["Year", "Sales", "Expenses"],
        ["100", 2.5, 3.8],
        ["200", 3, 1.8],
        ["300", 3, 4.3],
        ["400", 0.9, 2.3],
        ["500", 1.3, 3.6],
        ["600", 1.8, 2.8],
        ["700", 3.8, 2.8],
        ["800", 1.5, 2.8]
      ],
      options: {
        legend: { position: 'none' },
        bars: "vertical",
        vAxis: {
          format: "decimal"
        },
        height: 340,
        width: '100%',
        colors: ["#ff7f83", "#a5a5a5"],
        backgroundColor: 'transparent'
      },
    };
  }


}
