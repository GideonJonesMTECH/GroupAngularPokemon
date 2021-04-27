import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatListModule,
    MatProgressSpinnerModule
  ],
  exports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule
  ],
})
export class MaterialModule {}
