import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentReference,
  QuerySnapshot,
} from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import IClip from '../models/clips.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  map,
  of,
  switchMap,
  BehaviorSubject,
  combineLatest,
  Observable,
} from 'rxjs';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ClipService implements Resolve<IClip | null> {
  public clipsCollection: AngularFirestoreCollection<IClip>;
  pagesClips: IClip[] = [];
  pendingRequest: boolean = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router: Router
  ) {
    this.clipsCollection = db.collection('clips');
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([this.auth.user, sort$]).pipe(
      switchMap(([user, sort]) => {
        if (!user) {
          return of([]);
        }
        const query = this.clipsCollection.ref
          .where('uid', '==', user.uid)
          .orderBy('timestamp', sort === '1' ? 'desc' : 'asc');
        return query.get();
      }),
      map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  updateClip(id: string, title: string): Promise<void> {
    return this.clipsCollection.doc(id).update({ title });
  }

  async deleteClip(clip: IClip): Promise<void> {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    const screenshotRef = this.storage.ref(
      `screenshots/${clip.screenshotFileName}`
    );
    await screenshotRef.delete();
    await clipRef.delete();
    await this.clipsCollection.doc(clip.docID).delete();
  }

  async getClips() {
    if (this.pendingRequest) return;
    this.pendingRequest = true;
    let query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6);

    const { length } = this.pagesClips;

    if (length) {
      const lastDocId = this.pagesClips[length - 1].docID;
      const lastDoc = await this.clipsCollection
        .doc(lastDocId)
        .get()
        .toPromise();

      query = query.startAt(lastDoc);
    }
    const snapshot = await query.get();
    snapshot.forEach((doc) => {
      this.pagesClips.push({
        docID: doc.id,
        ...doc.data(),
      });
    });
    this.pendingRequest = false;
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): IClip | Observable<IClip | null> | Promise<IClip | null> | null {
    console.log('-------------------------------');
    console.log(route.params['id']);
    console.log('-------------------------------');
    return this.clipsCollection
      .doc(route.params['id'])
      .get()
      .pipe(
        map((snapshot) => {
          const data = snapshot.data();
          if (!data) {
            this.router.navigate(['/']);
            return null;
          }
          return data;
        })
      );
  }
}
