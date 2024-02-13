import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { Global } from 'src/app/shared/services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  objRows: any[];
  constructor(private _toastr: ToastrService, private _commonService: CommonService, private navRoute: Router) { }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this._commonService.get(Global.BASE_API_PATH + "ProductMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Product Master");
      }
    });
  }

  Delete(_id: number) {
    let obj = {
      id: _id
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record !'
      ,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this._commonService.post(Global.BASE_API_PATH + "ProductMaster/Delete/", obj).subscribe(res => {
          if (res.isSuccess) {
            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
            this.getData();
          } else {
            this._toastr.error(res.errors[0], "Product Master");
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your record is safe :)',
          'error'
        )
      }
    }
    )
  }

  Edit(_id: number) {
    this.navRoute.navigate(['/products/physical/add-product'], { queryParams: { productId: _id } });
  }

}
