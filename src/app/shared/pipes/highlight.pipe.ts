import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, filter: string, maxLength?: number): SafeHtml {
  if (!filter || !text) return text;

  const escaped = filter.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const highlighted = text.replace(regex, '<span class="highlight">$1</span>');

  let result = highlighted;
  if (maxLength && highlighted.length > maxLength) {
    result = highlighted.substring(0, maxLength) + '...';
  }

  return this.sanitizer.bypassSecurityTrustHtml(result);
}


}
