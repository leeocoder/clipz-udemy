import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private visible: boolean = false;

  isModalOpen(): boolean {
    return this.visible;
  }

  toggleModal(): void {
    this.visible = !this.visible;
  }
}
