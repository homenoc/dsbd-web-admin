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
        // console.log(d.data())
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

  getServiceData(id: string, serviceCode: string): Promise<any> {
    const data = this.afs.collection('user').doc(id).collection('data').doc(serviceCode);
    return data.ref.get()
      .then((d) => {
        return d;
      });
  }

  getMailData(): Promise<any> {
    const data = this.afs.collection('admin').doc('mail');
    return data.ref.get()
      .then((d) => {
        return d;
      });
  }

  registrationMailData(doc: any): Promise<any> {
    const data = this.afs.collection('admin').doc('mail');
    return data.ref.set(doc, {merge: true})
      .then((d) => {
        this.commonService.openBar("OK", 3000);
      });
  }

  registrationStatus(id: string, status: number, mailCount: any) {
    const doc = {};
    doc['status'] = status;
    if (mailCount !== false && typeof mailCount === 'number') {
      doc['mailCount'] = mailCount;
    }

    const data = this.afs.collection('user').doc(id);
    return data.ref.set(doc, {merge: true})
      .then(() => {
        // this.afs.collection('user').doc(id)
        //   .collection('personal').doc('common').set({lock: false}, {merge: true}).then(() => {
        this.commonService.openBar("OK", 3000);
        // })
      });
  }

  unlockSelect(id: string, name: string) {
    const data1 = this.afs.collection('user').doc(id).collection('personal').doc(name);
    return data1.ref.set({lock: false}, {merge: true})
      .then(() => {
        this.commonService.openBar("OK", 3000);
      });
  }

  lockSelect(id: string, name: string) {
    const data1 = this.afs.collection('user').doc(id).collection('personal').doc(name);
    return data1.ref.set({lock: true}, {merge: true})
      .then(() => {
        this.commonService.openBar("OK", 3000);
      });
  }


  registrationIdentificationName(id: string, name: number) {
    const doc = {};
    doc['name'] = name;

    const data = this.afs.collection('user').doc(id);
    return data.ref.set(doc, {merge: true})
      .then(() => {
        // this.afs.collection('user').doc(id)
        //   .collection('personal').doc('common').set({lock: false}, {merge: true}).then(() => {
        this.commonService.openBar("OK", 3000);
        // })
      });
  }


  registrationServiceData(id: string, serviceCode: string, doc: any) {
    const data = this.afs.collection('user').doc(id).collection('data').doc(serviceCode);
    return data.ref.set(doc, {merge: true})
      .then(() => {
        // this.afs.collection('user').doc(id)
        //   .collection('data').doc(serviceCode).set({lock: false}, {merge: true}).then(() => {
        this.commonService.openBar("OK", 3000);
        // })
      });
  }
}
