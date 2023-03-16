import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clips.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  @Output() update: EventEmitter<IClip> = new EventEmitter();
  showAlert = false;
  inSubmission = false;
  alertColor = 'blue';
  alertMessage = 'Please wait! updating uploaded';

  clipID = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);

  editFrom = new FormGroup({
    title: this.title,
  });

  constructor(private modal: ModalService, private clipService: ClipService) {}

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip || !this.activeClip.docID) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID);
    this.title.setValue(this.activeClip.title);
  }

  async submit(): Promise<void> {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMessage = 'Please wait! updating uploaded';
    if (!this.clipID.value || !this.title.value || !this.activeClip) return;
    try {
      await this.clipService.updateClip(this.clipID.value, this.title.value);
    } catch (error) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMessage = 'Something went wrong. Try again later';
    }
    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMessage = 'Success!';
  }
}
