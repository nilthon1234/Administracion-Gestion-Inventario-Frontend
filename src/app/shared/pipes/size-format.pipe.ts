import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizeFormat',
  standalone: true,
})
export class SizeFormatPipe implements PipeTransform {
  transform(value: string | string[], type?: string): string[] {
    if (!value) return [];

    // Convert the value to an array if it is a string
    const sizes = Array.isArray(value) ? value : value.split(',').map(s => s.trim()).filter(s => s !== '');

    // Types that use letter-based sizes
    const letterSizeTypes = ['PANTALON', 'POLO', 'POLERA', 'CAMISETA']; // Add other types as needed

    // Convert sizes to uppercase if the type is in letterSizeTypes or if sizes are like xs, s, m, l, xl
    if (type && letterSizeTypes.includes(type.toUpperCase())) {
      return sizes.map(size => size.toUpperCase());
    }

    // Check if sizes are standard letter sizes (xs, s, m, l, xl)
    const standardLetterSizes = ['xs', 's', 'm', 'l', 'xl'];
    const needsUpperCase = sizes.every(size => standardLetterSizes.includes(size.toLowerCase()));

    if (needsUpperCase) {
      return sizes.map(size => size.toUpperCase());
    }

    // For other types (ZAPATILLA, SANDALIA), convert to numbers and return as strings
    return sizes.map(size => {
      const numStr = size.replace(/^eu|^usa/i, '').replace('_', '.');
      const num = parseFloat(numStr);
      return isNaN(num) ? size : num.toString();
    });
  }
}
