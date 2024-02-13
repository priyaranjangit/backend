import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/services/common.service';
import { Global } from 'src/app/shared/services/global';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  imagePath: string = "/assets/images/user.png";
  fullName: string = "";
  emailId = "";
  firstName = "";
  lastName = "";
  userDetails: any;

  fileToUpload: any;
  @ViewChild('file') elfile: ElementRef;
  addedImagePath: string = "/assets/images/noimage.png";

  constructor(private _toastr: ToastrService, private _commonService: CommonService, private router: Router) { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem("userDetails"));

    this.firstName = this.userDetails.firstName;
    this.lastName = this.userDetails.lastName;
    this.emailId = this.userDetails.email;
    this.fullName = `${this.firstName} ${this.lastName}`;

    this.imagePath = (this.userDetails.imagePath == "" || this.userDetails.imagePath == null) ? "/assets/images/user.png"
      : Global.BASE_USERS_IMAGES_PATH + this.userDetails.imagePath;

  }

  upload(files: any) {
    if (files.length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this.elfile.nativeElement.value = "";
      this._toastr.error("Please upload valid image !!", "Profile Master");
    }

    this.fileToUpload = files[0];

    //read Image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.addedImagePath = reader.result.toString();
    };

  }
  changeProfileImage() {
    if (!this.fileToUpload) {
      this._toastr.error("Please upload image !!", "Profile Master");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.userDetails.id);
    if (this.fileToUpload) {
      formData.append("Image", this.fileToUpload, this.fileToUpload.name);
    }


    this._commonService.postImage(Global.BASE_API_PATH + "UserMaster/UpdateProfile/", formData).subscribe(res => {
      if (res.isSuccess) {
        this._toastr.success("Record has been saved successfully !!", "Profile Master");
        this.elfile.nativeElement.value = "";
        this.addedImagePath = "assets/images/noimage.png";
        this.fileToUpload = null;
        //
        Swal.fire({
          title: 'Are you sure?',
          text: 'Are you want to see this chnages rightnow?'
          ,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, rightnow !',
          cancelButtonText: 'No, keep it'
        }).then((result) => {
          if (result.value) {
            this.router.navigate(['auth/login']);
          } else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        }
        )

        //
      } else {
        this._toastr.error(res.errors[0], "Profile Master");
      }
    });
  }

  tabChange(event: any) {
    if (event.nextId == 'addtab') {
      this.addedImagePath = "assets/images/noimage.png";
      this.fileToUpload = null;
    }
  }
}
