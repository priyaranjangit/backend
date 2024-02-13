import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { DBOperation } from 'src/app/shared/services/db-operation';
import { Global } from 'src/app/shared/services/global';
import { CharFieldValidator, NoWhiteSpaceValidator, NumericFieldValidator } from 'src/app/validations/validations.validator';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit , OnDestroy {
  addForm: FormGroup;
  btnText: string;
  objRows: any[];
  objRow: any;
  dbops: DBOperation;
  addedImagePath: string = "assets/images/noimage.png";
  fileToUpload: any;
  @ViewChild('nav') elnav: any;
  @ViewChild('file') elfile: ElementRef;;

  formErrors = {
    name: '',
    title:'',
    isSave:'',
    link:''
  };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 1 char long',
      maxlength: 'Name cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only Whitespace is not allowed',
      validCharField: 'Name must be contains char and space only'
    },
    title: {
      required: 'Title is required',
      minlength: 'Title cannot be less than 1 char long',
      maxlength: 'Title cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only Whitespace is not allowed',
      validCharField: 'Title must be contains char and space only'
    },
    isSave: {
      required: 'Save Value is required',
      minlength: 'Save Value cannot be less than 1 char long',
      maxlength: 'Save Value cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only Whitespace is not allowed',
      validNumericField: 'Save Value must be numbers only'
    },
    link: {
      required: 'Link is required',
      minlength: 'Link cannot be less than 10 char long',
      maxlength: 'Link cannot be more than 100 char long',
      noWhiteSpaceValidator: 'Only Whitespace is not allowed'
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
      title: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        CharFieldValidator.validCharField
      ])],
      isSave: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10),
        NoWhiteSpaceValidator.noWhiteSpaceValidator,
        NumericFieldValidator.validNumericField
      ])],
      link: ['', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
        NoWhiteSpaceValidator.noWhiteSpaceValidator
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
    this._commonService.get(Global.BASE_API_PATH + "Category/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objRows = res.data;
      } else {
        this._toastr.error(res.errors[0], "Category Master");
      }
    });
  }

  upload(files: any) {
    if (files.length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this.elfile.nativeElement.value = "";
      this._toastr.error("Please upload valid image !!", "Category Master");
    }

    this.fileToUpload = files[0];

    //read Image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.addedImagePath = reader.result.toString();
    };

  }

  Submit() {
    if (this.dbops === DBOperation.create && !this.fileToUpload) {
      this._toastr.error("Please upload image !!", "Category Master");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.addForm.controls['id'].value);
    formData.append("Name", this.addForm.controls['name'].value);
    formData.append("Title", this.addForm.controls['title'].value);
    formData.append("IsSave", this.addForm.controls['isSave'].value);
    formData.append("Link", this.addForm.controls['link'].value);
    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }


    switch (this.dbops) {
      case DBOperation.create:
        this._commonService.postImage(Global.BASE_API_PATH + "Category/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record has been saved successfully !!", "Category Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "Category Master");
          }
        });
        break;
      case DBOperation.update:
        this._commonService.postImage(Global.BASE_API_PATH + "Category/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastr.success("Record has been updated successfully !!", "Category Master");
            this.resetForm();
          } else {
            this._toastr.error(res.errors[0], "Category Master");
          }
        });
        break;
    }
  }
  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      title:'',
      isSave:'',
      link:''
    });
    this.btnText = "Submit";
    this.dbops = DBOperation.create;
    this.addedImagePath = "assets/images/noimage.png";
    this.fileToUpload = "";
    this.elnav.select("viewtab");
  }
  resetForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      title:'',
      isSave:'',
      link:''
    });
    this.btnText = "Submit";
    this.dbops = DBOperation.create;
    this.addedImagePath = "assets/images/noimage.png";
    this.fileToUpload = "";
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
    this.addForm.controls['title'].setValue(this.objRow.title);
    this.addForm.controls['isSave'].setValue(this.objRow.isSave);
    this.addForm.controls['link'].setValue(this.objRow.link);
    this.addedImagePath = this.objRow.imagePath;
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
        this._commonService.post(Global.BASE_API_PATH + "Category/Delete/", obj).subscribe(res => {
          if (res.isSuccess) {
            Swal.fire(
              'Deleted!',
              'Your record has been deleted.',
              'success'
            )
            this.getData();
          } else {
            this._toastr.error(res.errors[0], "Category Master");
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
        title:'',
        isSave:'',
        link:''
      });
      this.btnText = "Submit";
      this.dbops = DBOperation.create;
      this.addedImagePath = "assets/images/noimage.png";
      this.fileToUpload = "";
    }
  }

  ngOnDestroy() {
    this.objRows = [];
    this.objRow = null;
    this.fileToUpload = "";
  }
}
