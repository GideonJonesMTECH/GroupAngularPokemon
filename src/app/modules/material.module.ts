import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    MatToolbarModule,
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule
  ],
  exports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule
  ],
})
export class MaterialModule {}
