import { Component, ElementRef, OnInit, Renderer2, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../../facture/service/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-code-notification',
  imports: [CommonModule],
  templateUrl: './code-notification.component.html',
  styleUrl: './code-notification.component.css'
})
export class CodeNotificationComponent implements OnInit{

  newCodeInfo = signal<{ code: string } | null>(null);
  targetElement: HTMLElement | null = null;
  isVisible = signal(false);
  private newCodeSubscription: Subscription | undefined;

constructor(private notificationService: NotificationService,
  private renderer: Renderer2,
  private el: ElementRef){}
 

  ngOnInit(): void {
    this.newCodeSubscription = this.notificationService.newCodeGenerated$.subscribe(data => {
      this.newCodeInfo.set({ code: data.code });
      this.isVisible.set(true);
      this.targetElement = document.getElementById(data.targetElementId);
      if (this.targetElement) {
        this.animateToTarget();
      } else {
        // Si el elemento no se encuentra, ocultar la notificación después de un tiempo
        setTimeout(() => this.isVisible.set(false), 3000);
      }
    });
  }

  animateToTarget() {
    if (this.newCodeInfo() && this.targetElement && this.isVisible()) {
      const notificationElement = this.el.nativeElement.querySelector('.notification-box');
      if (notificationElement) {
        const notificationRect = notificationElement.getBoundingClientRect();
        const targetRect = this.targetElement.getBoundingClientRect();

        const translateX = targetRect.left - notificationRect.left;
        const translateY = targetRect.top - notificationRect.top;

        this.renderer.setStyle(notificationElement, 'transition', 'transform 1s ease-in-out, opacity 1s ease-in-out');
        this.renderer.setStyle(notificationElement, 'transform', `translate(${translateX}px, ${translateY}px) scale(0.5)`);
        this.renderer.setStyle(notificationElement, 'opacity', '0');

        setTimeout(() => {
          this.isVisible.set(false);
          this.newCodeInfo.set(null);
          this.renderer.removeStyle(notificationElement, 'transition');
          this.renderer.removeStyle(notificationElement, 'transform');
          this.renderer.removeStyle(notificationElement, 'opacity');
        }, 1000);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.newCodeSubscription) {
      this.newCodeSubscription.unsubscribe();
    }
  }

}
