import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { DBOperation } from 'src/app/shared/services/db-operation';
import { Global } from 'src/app/shared/services/global';
import { MustMatchValidator } from 'src/app/validations/validations.validator';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userId: number = 0;
  addForm: FormGroup;
  submitted: boolean = false;
  objUserTypes: any;
  buttonText: string;
  dbops: DBOperation;

  constructor(private route: ActivatedRoute, private _fb: FormBuilder, private _toastr: ToastrService,
    private _commonService: CommonService) {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    })
  }


  ngOnInit(): void {
    this.setFormState();
    this.getUserTypes();

    if (this.userId && this.userId != null && this.userId > 0) {
      this.buttonText = "Update";
      this.dbops = DBOperation.update;
      this.getUserById();
    }
  }

  setFormState() {
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;

    this.addForm = this._fb.group({
      id:[''],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      userTypeId: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}")])],
      confirmPassword: ['', Validators.required]
    },
      {
        validators: MustMatchValidator('password', 'confirmPassword')
      });
  }

  get f() {
    return this.addForm.controls;
  }

  getUserById() {
    this._commonService.get(Global.BASE_API_PATH + "UserMaster/GetbyId/" + this.userId).subscribe(res => {
      if (res.isSuccess) {
        this.addForm.patchValue(res.data);
      } else {
        this._toastr.error(res.errors[0], "User Master");
      }
    });
  }

  getUserTypes() {
    this._commonService.get(Global.BASE_API_PATH + "UserType/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objUserTypes = res.data;
      } else {
        this._toastr.error(res.errors[0], "User Master");
      }
    });
  }

  register(formData: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    switch (this.dbops) {
      case DBOperation.create:
        this._commonService.post(Global.BASE_API_PATH + "UserMaster/Save/", formData.value).subscribe(res => {
          if (res.isSuccess) {
            if (res.data == -1) {
              this._toastr.error("Email Id is already exists", "User Master");
            } else {
              this._toastr.success("Record has been saved successfully !!", "User Master");
              this.addForm.reset();
              this.submitted = false;
            }
          } else {
            this._toastr.error(res.errors[0], "User Master");
          }
        });
        break;
      case DBOperation.update:
        this._commonService.post(Global.BASE_API_PATH + "UserMaster/Update/", formData.value).subscribe(res => {
          if (res.isSuccess) {
            if (res.data == -1) {
              this._toastr.error("Email Id is already exists", "User Master");
            } else {
              this._toastr.success("Record has been updated successfully !!", "User Master");
              this.addForm.reset();
              this.submitted = false;
            }
          } else {
            this._toastr.error(res.errors[0], "User Master");
          }
        });
        break;
    }
  }

}
