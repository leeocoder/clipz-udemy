import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
})
export class ClipComponent implements OnInit {
  id: string = '';
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: videojs.Video;
  constructor(public route: ActivatedRoute) {}
  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
    });
  }
}
