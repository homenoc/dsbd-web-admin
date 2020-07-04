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

  registrationStatus(id: string, status: number) {
    const doc = {};
    doc['status'] = status;

    const data = this.afs.collection('user').doc(id);
    return data.ref.set(doc, {merge: true})
      .then(() => {
        // this.afs.collection('user').doc(id)
        //   .collection('personal').doc('common').set({lock: false}, {merge: true}).then(() => {
        this.commonService.openBar("OK", 3000);
        // })
      });
  }

  unlockAll(id: string) {
    const data1 = this.afs.collection('user').doc(id).collection('personal').doc('question');
    return data1.ref.set({lock: false}, {merge: true})
      .then(() => {
        const data2 = this.afs.collection('user').doc(id).collection('personal').doc('term');
        return data2.ref.set({lock: false}, {merge: true})
          .then(() => {
            const data3 = this.afs.collection('user').doc(id).collection('personal').doc('contract1');
            return data3.ref.set({lock: false}, {merge: true})
              .then(() => {
                const data4 = this.afs.collection('user').doc(id).collection('personal').doc('contract2');
                return data4.ref.set({lock: false}, {merge: true})
                  .then(() => {
                    this.commonService.openBar("OK", 3000);
                  });
              });
          });
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
