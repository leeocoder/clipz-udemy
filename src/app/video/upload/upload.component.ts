import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clips.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  showPercentage: boolean = false;
  inSubmission: boolean = false;
  isDragOver: boolean = false;
  showAlert: boolean = false;
  nextStep: boolean = false;

  file: File | null = null;
  percentage: number = 0;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  alertColor: string = 'blue';
  alertMessage: string = 'Please wait! your clip is being uploaded';

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  uploadFrom = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private clipService: ClipService,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  storeFile(event: Event): void {
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') return;
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  uploadFile(): void {
    this.uploadFrom.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;

    this.alertMessage = 'Please wait! your clip is being uploaded';
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    this.task = this.storage.upload(clipPath, this.file);
    const clipReference = this.storage.ref(clipPath);
    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });
    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipReference.getDownloadURL())
      )
      .subscribe({
        next: (url) => this.onUploadFileSuccess(url, clipFileName),
        error: (error) => this.onUploadFileError(error),
      });
  }

  async onUploadFileSuccess(url: unknown, clipFileName: string): Promise<void> {
    const clip: IClip = {
      uid: this.user?.uid as string,
      displayName: this.user?.displayName as string,
      title: this.title.value as string,
      fileName: `${clipFileName}.mp4`,
      url: url as string,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const clipDocumentReference = await this.clipService.createClip(clip);
    setTimeout(() => {
      this.router.navigate(['clip', clipDocumentReference.id]);
    });
    this.alertColor = 'green';
    this.alertMessage =
      'Success! Your clip is now ready to share with the World';
    this.inSubmission = false;
    this.showPercentage = false;
  }

  onUploadFileError(error: unknown): void {
    this.uploadFrom.enable();
    this.alertColor = 'red';
    this.alertMessage = 'Upload failed! Please try again later.';
    this.inSubmission = false;
    this.showPercentage = false;
    console.log(error);
  }
}
