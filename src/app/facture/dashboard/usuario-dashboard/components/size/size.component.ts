import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Gender, Size, SizesByGender } from '../../../../../shared/models/sale';
import { SaleDataService } from '../../../../service/sale-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-size',
  imports: [CommonModule, FormsModule],
  templateUrl: './size.component.html',
  styleUrl: './size.component.css'
})
export class SizeComponent implements OnInit {

  @Input() currentSizes: string[] = [];
  @Input() gender: string = '';
  @Input() codToday: string = '';
  @Input() company: string = '';
  @Input() type: string = '';
  @Output() updateSizes = new EventEmitter<string[]>();
  @Output() cancel = new EventEmitter<void>();

  genders: Gender[] = [];
  sizes: { id: number; talla: string; selected: boolean; disabled: boolean }[] = [];
  selectedGender: string | undefined;
  sizeData: SizesByGender | undefined;

  hasSelection: boolean = false;

  constructor(private saleDataService: SaleDataService) { }

  // size.component.ts
  ngOnInit(): void {
    this.saleDataService.getGenero().subscribe(genders => {
      this.genders = genders;
      this.selectedGender = this.gender;
      
      this.saleDataService.getTalla().subscribe(sizeData => {
        this.sizeData = sizeData;
        this.onGenderSelect();
      });
    });
  }

  onGenderSelect(): void {
    if (this.selectedGender && this.sizeData) {
      const genderKey = this.selectedGender.toLowerCase() as keyof SizesByGender;
      this.sizes = this.sizeData[genderKey].map(size => ({ 
        ...size, 
        selected: false, // Todas las tallas comienzan sin seleccionar
        disabled:this.isSizeDisabled(size.talla)
      }));
      this.markCurrentSizes();
      this.checkSelection();
    }
  }
  isSizeDisabled(talla: string): boolean {
    // Verifica si la talla está en currentSizes
    return this.currentSizes?.some(s => s.toString() === talla.toString()) || false;
  }


  checkSelection(): void {
    // Verifica si hay al menos una talla seleccionada
    this.hasSelection = this.sizes.some(size => size.selected && !size.disabled);
  }

  // Asegúrate que markCurrentSizes funcione correctamente
  markCurrentSizes(): void {
    if (this.currentSizes && this.sizes) {
      this.sizes.forEach(size => {
        // Convertir a string para comparación segura
        size.selected = this.currentSizes.some(s => s.toString() === size.talla.toString());
      });
    }
  }

  onSizeSelect(): void {
    this.checkSelection();
  }


  onUpdate(): void {
    if (!this.hasSelection) return;
    
    const selectedSizes = this.sizes
      .filter(size => size.selected && !size.disabled)
      .map(size => size.talla);
    this.updateSizes.emit(selectedSizes);
  }

  onCancel(): void {
    this.cancel.emit();
  }

}
