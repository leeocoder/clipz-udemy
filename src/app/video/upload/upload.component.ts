import { Component, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, forkJoin, last, switchMap } from 'rxjs';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clips.model';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

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
  screenshotTask?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot: string = '';

  alertColor: string = 'blue';
  alertMessage: string = 'Please wait! your clip is being uploaded';

  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  uploadFrom = new FormGroup({
    title: this.title,
  });

  constructor(
    private storage: AngularFireStorage,
    private clipService: ClipService,
    public ffmpegService: FfmpegService,
    private auth: AngularFireAuth,
    private router: Router
  ) {
    this.auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile(event: Event): Promise<void> {
    if (this.ffmpegService.isRunning) return;

    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer
      ? (event as DragEvent).dataTransfer?.files.item(0) ?? null
      : (event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') return;

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  async uploadFile(): Promise<void> {
    this.uploadFrom.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.inSubmission = true;
    this.showPercentage = true;

    this.alertMessage = 'Please wait! your clip is being uploaded';
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;
    const screenshotPath = `screenshots/${clipFileName}.png`;
    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );
    this.screenshotTask = this.storage.upload(screenshotPath, screenshotBlob);
    this.task = this.storage.upload(clipPath, this.file);

    const screenShotReference = this.storage.ref(screenshotPath);
    const clipReference = this.storage.ref(clipPath);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;
      if (!clipProgress || !screenshotProgress) return;
      const total = clipProgress + screenshotProgress;
      this.percentage = (total as number) / 200;
    });
    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotTask.snapshotChanges(),
    ])
      .pipe(
        switchMap(() =>
          forkJoin([
            clipReference.getDownloadURL(),
            screenShotReference.getDownloadURL(),
          ])
        )
      )
      .subscribe({
        next: (urls) => this.onUploadFileSuccess(urls, clipFileName),
        error: (error) => this.onUploadFileError(error),
      });
  }

  async onUploadFileSuccess(
    urls: string[],
    clipFileName: string
  ): Promise<void> {
    const [clipUrl, screenshotURl] = urls;
    const clip: IClip = {
      uid: this.user?.uid as string,
      displayName: this.user?.displayName as string,
      title: this.title.value as string,
      fileName: `${clipFileName}.mp4`,
      url: clipUrl,
      screenshotURl,
      screenshotFileName: `${clipFileName}.mp4`,
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

  selectScreenshot(screenshot: string): void {
    this.selectedScreenshot = screenshot;
  }
}
