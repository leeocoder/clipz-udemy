import { Component, Input, ElementRef, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Input() modalId: string = '';

  constructor(public modal: ModalService, private elementRef: ElementRef) {}

  ngOnInit(): void {
    document.body.appendChild(this.elementRef.nativeElement);
  }
  closeModal(): void {
    this.modal.toggleModal(this.modalId);
  }
}
