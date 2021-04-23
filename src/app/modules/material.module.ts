import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    MatToolbarModule,
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatListModule
  ],
  exports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatListModule
  ],
})
export class MaterialModule {}
