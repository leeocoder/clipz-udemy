import { Component, Input, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() modalId: string = '';

  constructor(public modal: ModalService, private elementRef: ElementRef) {}
  ngOnDestroy(): void {
    document.body.removeChild(this.elementRef.nativeElement);
  }

  ngOnInit(): void {
    document.body.appendChild(this.elementRef.nativeElement);
  }
  closeModal(): void {
    this.modal.toggleModal(this.modalId);
  }
}
