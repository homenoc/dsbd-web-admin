import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {CommonService} from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private commonService: CommonService,
  ) {

  }

  getAllUser(): Promise<any> {
    const data = this.afs.collection('user');
    return data.ref.get()
      .then((d) => {
        // console.log(d.data)
        return d;
      });
  }

  getUser(id: string): Promise<any> {
    const data = this.afs.collection('user').doc(id);
    return data.ref.get()
      .then((d) => {
        return d;
      });
  }

  getPersonalData(id: string): Promise<any> {
    const data = this.afs.collection('user').doc(id).collection('personal');
    return data.ref.get()
      .then((d) => {
        // console.log(d.data)
        return d;
      });
  }

  registStatus(id: string, status: number) {
    const doc = {};
    doc['status'] = status;

    const data = this.afs.collection('user').doc(id);
    return data.ref.set(doc, {merge: true})
      .then(() => {
        this.afs.collection('user').doc(id)
          .collection('personal').doc('common').set({lock: false}, {merge: true}).then(() => {
          this.commonService.openBar("OK", 3000);
        })
      });
  }
}
