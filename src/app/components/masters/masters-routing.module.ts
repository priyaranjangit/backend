import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { CategoryComponent } from './category/category.component';
import { ColorComponent } from './color/color.component';
import { SizeComponent } from './size/size.component';
import { TagComponent } from './tag/tag.component';
import { UsertypeComponent } from './usertype/usertype.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'brandlogo', component: BrandlogoComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'tag', component: TagComponent },
      { path: 'size', component: SizeComponent },
      { path: 'color', component: ColorComponent },
      { path: 'usertype', component: UsertypeComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule { }
