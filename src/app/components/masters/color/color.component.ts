import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { DBOperation } from 'src/app/shared/services/db-operation';
import { Global } from 'src/app/shared/services/global';
import { CharFieldValidator, NoWhiteSpaceValidator, TextFieldValidator } from 'src/app/validations/validations.validator';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit , OnDestroy {
  addForm: FormGroup;
  btnText: string;
  objRows: any[];
  objRow: any;
  dbops: DBOperation;
  @ViewChild('nav') elnav: any;

  formErrors = {
    name: '',
    code:''
  };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 1 char long',
      maxlength: 'Name cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only Whitespace is not allowed',
      validCharField: 'Name must be contains char and space only'
    },
    code: {
      required: 'Code is required',
      minlength: 'Code cannot be less than 1 char long',
      maxlength: 'Code cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only Whitespace is not allowed',
      validTextField: 'Code must be contains char and number only'
    }
  };

  constructor(private _fb: FormBuilder, private _toastr: ToastrService, private _commonService: CommonService) { }

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }


  setFormState() {
    this.btnText = "Submit";
    this.dbops = DBOperation.create;

    this.addForm = this._fb.group({
      id: [0],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        CharFieldValidator.validCharField
      ])],
      code: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        TextFieldValidator.validTextField
      ])]
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanged();
    });
  }

  onValueChanged() {
    if (!this.addForm) {
      return;
    }

    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = "";
      const control = this.addForm.get(field);

      if (control && control.dirty && control.invalid) {
        const message = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] += message[key] + ' ';
          }
        }
      }
    }
  }

  get f() {
    return this.addForm.controls;
  }

  getData() {
    this._commonService.get(Global.BASE_API_PATH + "ColorMaster/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Color Master");
      }
    });
  }

  Submit() {
    switch (this.dbops) {
      case DBOperation.create:
        this._commonService.post(Global.BASE_API_PATH + "ColorMaster/Save/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record has been saved successfully !!", "Color Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "Color Master");
          }
        });
        break;
      case DBOperation.update:
        this._commonService.post(Global.BASE_API_PATH + "ColorMaster/Update/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record has been updated successfully !!", "Color Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "Color Master");
          }
        });
        break;
    }
  }
  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      code:''
    });
    this.btnText = "Submit";
    this.dbops = DBOperation.create;
    this.elnav.select("viewtab");
  }
  resetForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      code:''
    });
    this.btnText = "Submit";
    this.dbops = DBOperation.create;
    this.elnav.select("viewtab");
    this.getData();
  }

  Edit(_id: number) {
    this.btnText = "Update";
    this.dbops = DBOperation.update;
    this.elnav.select("addtab");
    this.objRow = this.objRows.find(x => x.id == _id);
    this.addForm.controls['id'].setValue(this.objRow.id);
    this.addForm.controls['name'].setValue(this.objRow.name);
    this.addForm.controls['code'].setValue(this.objRow.code);
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
        this._commonService.post(Global.BASE_API_PATH + "ColorMaster/Delete/", obj).subscribe(res => {
          if (res.isSuccess) {
            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
            this.getData();
          } else {
            this._toastr.error(res.errors[0], "Color Master");
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
  tabChange(event: any) {
    if (event.nextId == 'addtab') {
      this.addForm.reset({
        id: 0,
        name: '',
        code:''
      });
      this.btnText = "Submit";
      this.dbops = DBOperation.create;
    }
  }

  ngOnDestroy() {
    this.objRows = [];
    this.objRow = null;
  }
}
