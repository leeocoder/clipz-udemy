import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clip-list',
  templateUrl: './clip-list.component.html',
  styleUrls: ['./clip-list.component.css'],
  providers: [DatePipe],
})
export class ClipListComponent implements OnInit, OnDestroy {
  @Input() scrollable = true;
  constructor(public clipService: ClipService) {
    this.clipService.getClips();
  }
  ngOnInit(): void {
    if (this.scrollable) window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy(): void {
    if (this.scrollable)
      window.removeEventListener('scroll', this.handleScroll);

    this.clipService.pagesClips = [];
  }
  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;
    const bottomOfWindows =
      Math.round(scrollTop) + innerHeight === offsetHeight;

    if (bottomOfWindows) {
      this, this.clipService.getClips();
    }
  };
}
