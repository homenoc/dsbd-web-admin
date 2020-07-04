import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../service/data.service";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService,
  ) {
  }

  public id: string;
  public status = 'None';
  public question: { base1: '', base2: '', base3: '', base4: '' };
  public agreement = false;
  public contract1: {
    data10: '', data100: false, data101: false, data102: false, data103: false, data104: false, data105: '',
    data11: '', data110: '', data120: '', data130: '',
    data20: false, data21: false, data22: false, data220: '', data221: '',
    data23: false, data230: '', data231: '',
    data31: '', data32: '', data33: '', data34: '', data35: '', data36: '', data37: '',
    data40: false, data41: '', data42: '', data43: '', data44: '', data45: '', data46: '', data47: '',
    data50: false, data51: '', data52: '', data53: '', data54: '', data55: '', data56: '', data57: '',
    data60: '', data70: false, data71: any, data72: false, data73: any, data80: '',
    data90: '', data91: '', data92: '', data93: '', data94: '',
  };
  public contract2: {
    data100: '', data101: false, data102: false, data110: false, data111: false,
    data200: false, data201: false, data202: false, data210: '', data211: '', data212: '',
    data310: '', data311: '', data312: '', data313: '', data314: '', data315: '', data316: '', data317: '', data318: '',
    data320: '', data321: '', data322: '', data323: '', data324: '',
    data400: false, data410: '', data411: '', data412: '', data413: '', data414: '', data415: '', data416: '', data417: '', data418: '',
    data420: '', data421: '', data422: '', data423: '', data424: '', data500: '',
  };
  private dataStatus = 0;
  public registerStatus: number;
  identificationName = new FormControl('');
  serviceCode = new FormControl('');

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.dataService.getUser(this.id).then(doc => {
      console.log('data: ' + doc.data());
      if (doc.data().status % 10 == 1) {
        this.status = 'question';
      }
      if (doc.data().status % 10 == 2) {
        this.status = 'question=>check';
      }
      if (doc.data().status % 10 == 3) {
        this.status = 'question=>check=>agreement';
      }
      if (doc.data().status % 10 == 4) {
        this.status = 'question=>check=>agreement=>check';
      }
      if (doc.data().status % 10 == 5) {
        this.status = 'question=>check=>agreement=>contract1';
      }
      if (doc.data().status % 10 == 6) {
        this.status = 'question=>check=>agreement=>contract1=>check';
      }
      if (doc.data().status % 10 == 7) {
        this.status = 'question=>check=>agreement=>contract1=>check=>contract2';
      }
      if (doc.data().status % 10 == 8) {
        this.status = 'question=>check=>agreement=>contract1=>check=>contract2=>check';
      }
      console.log('status: ' + doc.data().status);
      console.log('dataStatus: ' + doc.data().status / 10);
      this.dataStatus = doc.data().status / 10;
    })
    this.dataService.getPersonalData(this.id).then(doc => {
      for (let i = 0; i < doc.size; i++) {
        console.log(doc.docs[i].data().data1)
        if (doc.docs[i].id == 'question') {
          this.question = {
            base1: doc.docs[i].data().data1,
            base2: doc.docs[i].data().data2,
            base3: doc.docs[i].data().data3,
            base4: doc.docs[i].data().data4
          }
        }
        if (doc.docs[i].id == 'term') {
          this.agreement = doc.docs[i].data().agree;
        }
        if (doc.docs[i].id == 'contract1') {
          this.contract1 = doc.docs[i].data();
        }
        if (doc.docs[i].id == 'contract2') {
          this.contract2 = doc.docs[i].data();
        }
      }
    })
  }

  pushRegisterStatus(): void {
    console.log('d: ' + this.dataStatus + ' r: ' + this.registerStatus)
    console.log('d: ' + Math.floor(this.dataStatus) + ' r: ' + this.registerStatus)
    let tmp: number = parseInt(String(Math.floor(this.dataStatus) * 10)) + parseInt(String(this.registerStatus));
    this.dataService.registrationStatus(this.id, tmp).then();
  }

  pushIdentificationName() {
    this.dataService.registrationIdentificationName(this.id, this.identificationName.value).then();
  }

  pageMove() {
    this.router.navigate(['/dashboard/user/' + this.id + '/' + this.serviceCode.value]).then();
  }
}
