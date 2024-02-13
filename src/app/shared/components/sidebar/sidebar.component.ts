import { Component, OnInit } from '@angular/core';
import { Menu } from '../../interface/menu.interface';
import { Global } from '../../services/global';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  logoImage = "assets/images/dashboard/SahosoftMallBachend-logo.png";
  userImage = "assets/images/user.png";
  menuItems: Menu[];
  fullName: string = "";
  emailId: string = "";

  constructor(public _menuService: MenuService) {
    this.menuItems = this._menuService.MENUITEMS;
  }

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));

    this.userImage = (userDetails.imagePath == "" || userDetails.imagePath == null) ? "/assets/images/user.png"
      : Global.BASE_USERS_IMAGES_PATH + userDetails.imagePath;

    this.emailId = userDetails.email;
    this.fullName = `${userDetails.firstName} ${userDetails.lastName}`;
  }

  toggleNavActive(item: Menu) {
    item.active = !item.active;
  }

}
