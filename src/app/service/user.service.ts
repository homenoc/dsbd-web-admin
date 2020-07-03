import {Injectable} from '@angular/core';
import {AngularFireAuth} from "@angular/fire/auth";
import {AngularFirestore} from "@angular/fire/firestore";
import {CommonService} from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    private commonService: CommonService,
  ) {
  }

  createUser(email, pass): void {
    this.afAuth.createUserWithEmailAndPassword(email, pass)
      .then(result => {
        result.user.sendEmailVerification().then(d => {
            // console.log(d.uid)
          }
        )
        this.commonService.openBar('Please follow the email confirmation link.。', 10000);
      })
      .catch(err => this.commonService.openBar('Failed register account!!!' + err, 2000));
  }
}
