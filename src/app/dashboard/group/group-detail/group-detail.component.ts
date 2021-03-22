import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GroupService} from '../../../service/group.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {UserService} from '../../../service/user.service';
import {ServiceService} from '../../../service/service.service';
import {ConnectionService} from '../../../service/connection.service';
import {MailTemplateService} from '../../../service/mail-template.service';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

export interface DialogData {
  groups: any;
  id: number;
  mail: {
    toEmail: string;
    templateID: number;
  };
}

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss']
})
export class GroupDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public groupService: GroupService,
    public commonService: CommonService,
    public dialog: MatDialog,
  ) {
  }

  public id: string;
  public org = '';
  public groupInput = new FormGroup({
    ID: new FormControl(),
    org: new FormControl(),
    status: new FormControl(),
    student: new FormControl(),
    expired_status: new FormControl(),
    lock: new FormControl(),
    pass: new FormControl(),
  });
  public statusInfo = '';
  public loading = true;
  public hide = false;
  public group: any;
  public users: any;
  public connectionTemplates: any;
  public networkTemplates: any;
  public nocTemplates: any;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.groupService.get(this.id).then(response => {
      console.log(response);
      this.group = response.group;
      this.groupInput.patchValue({
        ID: response.group.ID,
        expired_status: response.group.expired_status,
        status: response.group.status,
        student: response.group.student,
        lock: response.group.lock,
      });
      this.org = response.group.org;
      this.loading = false;

      if (this.group.expired_status === 1) {
        this.statusInfo = 'Masterによる廃止申請';
      } else if (this.group.expired_status === 2) {
        this.statusInfo = '運営委員によるアカウントの廃止';
      } else if (this.group.expired_status === 3) {
        this.statusInfo = '審査落ち';
      } else if (!this.group.pass) {
        this.statusInfo = 'グループ審査中';
      } else if (this.group.status === 1) {
        this.statusInfo = 'サービス情報　記入段階';
      } else if (this.group.status === 2) {
        this.statusInfo = '審査中';
      } else if (this.group.status === 3) {
        this.statusInfo = '接続情報　記入段階';
      } else if (this.group.status === 4) {
        this.statusInfo = '開通作業中';
      }

      this.commonService.openBar('OK', 5000);
    });
  }

  updateStatus(status: number): void {
    this.groupInput.patchValue({
      ID: this.group.ID,
      status,
      pass: this.group.pass,
      lock: this.group.lock,
    });
    this.update().then(d => {
      if (d) {
        if (status === 1) {
          this.openMailDialog(1);
        } else if (status === 3) {
          this.openMailDialog(2);
        } else if (status === 0) {
          this.openMailDialog(3);
        } else {
          location.reload();
        }
      }
    });
  }

  updateExpiredStatus(status: number): void {
    this.groupInput.patchValue({
      ID: this.group.ID,
      expired_status: status,
      pass: this.group.pass,
      lock: this.group.lock,
    });
    this.update();
  }

  updatePass(pass: boolean): void {
    this.groupInput.patchValue({
      ID: this.group.ID,
      pass,
      lock: this.group.lock,
    });
    this.update().then(d => {
      if (d) {
        this.openMailDialog(0);
      }
    });
  }

  update(): Promise<boolean> {
    const json = JSON.stringify(this.groupInput.getRawValue());
    console.log(json);
    return this.groupService.update(this.id, json).then(response => {
      this.commonService.openBar('OK', 5000);
      return true;
    }).catch(err => {
      console.log(err);
      return false;
    });
  }

  requestLock(lock: boolean): void {
    this.groupService.update(this.id, {lock}).then(() => {
      this.commonService.openBar('OK', 5000);
      location.reload();
    });
  }

  userPage(id): void {
    this.router.navigate(['/dashboard/user/' + id]).then();
  }

  connectionPage(id): void {
    this.router.navigate(['/dashboard/connection/' + id]).then();
  }

  servicePage(id): void {
    this.router.navigate(['/dashboard/service/' + id]).then();
  }

  openMailDialog(id: number) {

    let email: string;
    let count = 0;

    for (const user of this.group.users) {
      if (user.level === 1) {
        count++;
        email = user.email;
      }
    }

    if (count > 1) {
      this.commonService.openBar('ユーザ権限Levelが1のユーザが複数存在します。', 5000);
    }

    const dialogRef = this.dialog.open(GroupDetailMail, {
      data: {
        group: this.group,
        id: this.id,
        mail: {
          templateID: id,
          toEmail: email
        }
      },
      height: '650px',
      width: '900px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  createNetworkInfo() {
    const dialogRef = this.dialog.open(GroupDetailCreateService, {
      data: {
        group: this.group,
        id: this.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  createConnectionInfo() {
    const dialogRef = this.dialog.open(GroupDetailCreateConnection, {
      data: {
        group: this.group,
        id: this.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

// service情報の追加フィールド
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'group-detail-create-service',
  templateUrl: 'group-detail-create-service.html',
})
// tslint:disable-next-line:component-class-suffix
export class GroupDetailCreateService implements OnInit {

  public ip: FormGroup;
  public routeV4: string;
  public routeV4Etc = new FormControl();
  public routeV6: string;
  public routeV6Etc = new FormControl();
  public routeV4Check = false;
  public routeV6Check = false;
  public asn = new FormControl();
  public jpnicJa = new FormGroup({
    org: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
  });
  public jpnicEn = new FormGroup({
    org: new FormControl(''),
    address: new FormControl(''),
  });
  public checkV4 = false;
  public checkV6 = false;
  public jpnicV4 = new FormGroup({
    name: new FormControl(''),
    subnet: new FormControl(''),
  });
  public jpnicV6 = new FormGroup({
    name: new FormControl(''),
    subnet: new FormControl(''),
  });
  public bandwidth = new FormGroup({
    aveUpstream: new FormControl(10, Validators.min(0)),
    maxUpstream: new FormControl(100, Validators.min(0)),
    aveDownstream: new FormControl(10, Validators.min(0)),
    maxDownstream: new FormControl(100, Validators.min(0)),
    asn: new FormControl()
  });
  public templateConnections: any[] = [];
  public templateServices: any[] = [];
  public users: any[] = [];
  public admin: any;
  public serviceTypeID = '0';
  public serviceComment = new FormControl();
  public bandwidthAs = false;
  public dateStart: string;
  public dateEnd: string;
  public dateEndUnlimited = false;
  public jpnicTech: FormGroup;
  public plan: FormGroup;
  public jpnicAdmin = new FormGroup({
    org: new FormControl(''),
    org_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    name: new FormControl(''),
    name_en: new FormControl(''),
    dept: new FormControl(''),
    dept_en: new FormControl(''),
    pos: new FormControl(''),
    pos_en: new FormControl(''),
    tel: new FormControl(''),
    fax: new FormControl(''),
    country: new FormControl(''),
  });
  public hide = false;
  public needJPNIC = false;
  public needGlobalAS = false;
  public needComment = false;
  public needRoute = false;

  constructor(
    public dialogRef: MatDialogRef<GroupDetailCreateService>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private groupService: GroupService,
    private serviceService: ServiceService,
    private router: Router,
    private commonService: CommonService,
  ) {
  }

  ngOnInit(): void {
    // アクセス制御
    this.jpnicTech = this.formBuilder.group({
      tech: this.formBuilder.array([])
    });
    this.plan = this.formBuilder.group({
      v4: this.formBuilder.array([])
    });

    this.commonService.getTemplate().then(res => {
      console.log(res);
      this.templateConnections = res.connections;
      this.templateServices = res.services;
    });
  }

  addEventStart(event: MatDatepickerInputEvent<Date>) {
    this.dateStart = event.value.getFullYear() + '-' + ('00' + (event.value.getMonth() + 1)).slice(-2) +
      '-' + ('00' + (event.value.getDate())).slice(-2);
  }

  addEventEnd(event: MatDatepickerInputEvent<Date>) {
    this.dateEnd = event.value.getFullYear() + '-' + ('00' + (event.value.getMonth() + 1)).slice(-2) +
      '-' + ('00' + (event.value.getDate())).slice(-2);
  }

  get jpnicTechProcess(): FormArray {
    return this.jpnicTech.get('tech') as FormArray;
  }

  addTechUserOptionForm() {
    this.jpnicTechProcess.push(this.optionJPNICForm);
  }

  removeTechUserOptionForm(idx: number) {
    this.jpnicTechProcess.removeAt(idx);
  }

  get optionJPNICForm(): FormGroup {
    return this.formBuilder.group({
      org: [''],
      org_en: [''],
      postcode: [''],
      address: [''],
      address_en: [''],
      name: [''],
      name_en: [''],
      dept: [''],
      dept_en: [''],
      pos: [''],
      pos_en: [''],
      tel: [''],
      fax: [''],
      country: [''],
    });
  }

  get planProcess(): FormArray {
    return this.plan.get('v4') as FormArray;
  }

  addPlanOptionForm() {
    this.planProcess.push(this.optionPlanForm);
  }

  removePlanOptionForm(idx: number) {
    this.planProcess.removeAt(idx);
  }

  get optionPlanForm(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      after: [''],
      half_year: [''],
      one_year: [''],
    });
  }

  changeStatus(jpnic, comment, globalAS, route: boolean) {
    this.needJPNIC = jpnic;
    this.needComment = comment;
    this.needGlobalAS = globalAS;
    this.needRoute = route;

  }

  copyJPNIC() {
    this.jpnicTechProcess.push(this.formBuilder.group({
      org: [this.jpnicAdmin.value.org],
      org_en: [this.jpnicAdmin.value.org_en],
      postcode: [this.jpnicAdmin.value.postcode],
      address: [this.jpnicAdmin.value.address],
      address_en: [this.jpnicAdmin.value.address_en],
      name: [this.jpnicAdmin.value.name],
      name_en: [this.jpnicAdmin.value.name_en],
      dept: [this.jpnicAdmin.value.dept],
      dept_en: [this.jpnicAdmin.value.dept_en],
      pos: [this.jpnicAdmin.value.pos],
      pos_en: [this.jpnicAdmin.value.pos_en],
      tel: [this.jpnicAdmin.value.tel],
      fax: [this.jpnicAdmin.value.fax],
      country: [this.jpnicAdmin.value.country],
    }));
  }

  request() {
    let body: any;
    const ip: any[] = [];

    if (this.bandwidth.value.aveUpstream === 0) {
      this.commonService.openBar('平均アップロード帯域が0です。', 5000);
      return;
    }
    if (this.bandwidth.value.maxUpstream === 0) {
      this.commonService.openBar('最大アップロード帯域が0です。', 5000);
      return;
    }
    if (this.bandwidth.value.aveDownstream === 0) {
      this.commonService.openBar('平均ダウンロード帯域が0です。', 5000);
      return;
    }
    if (this.bandwidth.value.maxDownstream === 0) {
      this.commonService.openBar('最大ダウンロード帯域が0です。', 5000);
      return;
    }

    if (this.needJPNIC || this.needGlobalAS) {
      if (!this.checkV4 && !this.checkV6) {
        this.commonService.openBar('v4とv6どちらか選択する必要があります。。', 5000);
        return;
      }
      if (this.checkV4) {
        if (this.jpnicV4.value.name === '') {
          this.commonService.openBar('v4のネットワーク名が入力されていません。', 5000);
          return;
        }
        if (this.jpnicV4.value.subnet === '') {
          this.commonService.openBar('v4のAddress/Subnetが入力されていません。', 5000);
          return;
        }
      }
      if (this.checkV6) {
        if (this.jpnicV6.value.name === '') {
          this.commonService.openBar('v6のネットワーク名が入力されていません。', 5000);
          return;
        }
        if (this.jpnicV6.value.subnet === '') {
          this.commonService.openBar('v6のAddress/Subnetが入力されていません。', 5000);
          return;
        }
      }
    }

    if (this.needJPNIC) {
      // 管理責任者のCheck
      if (this.jpnicAdmin.value.org === '') {
        this.commonService.openBar('団体名が入力されていません。', 5000);
        return;
      }
      if (this.jpnicAdmin.value.org_en === '') {
        this.commonService.openBar('団体名(English)が入力されていません。', 5000);
        return;
      }
      if (this.jpnicAdmin.value.postcode === '') {
        this.commonService.openBar('郵便番号が入力されていません。', 5000);
        return;
      }
      if (this.jpnicAdmin.value.address === '') {
        this.commonService.openBar('住所が入力されていません。', 5000);
        return;
      }
      if (this.jpnicAdmin.value.address_en === '') {
        this.commonService.openBar('住所(English)が入力されていません。', 5000);
        return;
      }
      if (this.jpnicAdmin.value.group_name === '') {
        this.commonService.openBar('グループ名/個人名が入力されていません。', 5000);
        return;
      }
      if (this.jpnicAdmin.value.group_name_en === '') {
        this.commonService.openBar('グループ名/個人名(English)が入力されていません。', 5000);
        return;
      }
      if (this.jpnicAdmin.value.tel === '') {
        this.commonService.openBar('電話番号が入力されていません。', 5000);
        return;
      }
      if (this.jpnicAdmin.value.country === '') {
        this.commonService.openBar('居住国が入力されていません。', 5000);
        return;
      }
      // 技術連絡担当者のCheck
      if (this.jpnicTech.value.tech.length <= 0 || this.jpnicTech.value.tech.length > 2) {
        this.commonService.openBar('技術連絡担当者が多い又は入力されていません。', 5000);
        return;
      }
      for (const tmp of this.jpnicTech.value.tech) {
        if (tmp.org === '') {
          this.commonService.openBar('団体名が入力されていません。', 5000);
          return;
        }
        if (tmp.org_en === '') {
          this.commonService.openBar('団体名(English)が入力されていません。', 5000);
          return;
        }
        if (tmp.postcode === '') {
          this.commonService.openBar('郵便番号が入力されていません。', 5000);
          return;
        }
        if (tmp.address === '') {
          this.commonService.openBar('住所が入力されていません。', 5000);
          return;
        }
        if (tmp.address_en === '') {
          this.commonService.openBar('住所(English)が入力されていません。', 5000);
          return;
        }
        if (tmp.group_name === '') {
          this.commonService.openBar('グループ名/個人名が入力されていません。', 5000);
          return;
        }
        if (tmp.group_name_en === '') {
          this.commonService.openBar('グループ名/個人名(English)が入力されていません。', 5000);
          return;
        }
        if (tmp.tel === '') {
          this.commonService.openBar('電話番号が入力されていません。', 5000);
          return;
        }
        if (tmp.country === '') {
          this.commonService.openBar('居住国が入力されていません。', 5000);
          return;
        }
      }
      if (this.checkV4 && this.plan.value.v4.length === 0) {
        this.commonService.openBar('Planが設定されていません。', 5000);
        return;
      }
    }

    if (this.needComment) {
      if (this.serviceComment.value === '') {
        this.commonService.openBar('その他の項目が入力されていません。', 5000);
        return;
      }
    }

    if (this.needRoute) {
      if (this.routeV4 === '' && this.routeV6 === '') {
        this.commonService.openBar('経路情報が選択されていません。', 5000);
        return;
      }
    }

    if (this.needGlobalAS) {
      if (this.asn.value === '') {
        this.commonService.openBar('AS番号が入力されていません。', 5000);
        return;
      }
    }

    // 2000 , 3S00 , 3B00
    if (this.needJPNIC) {
      if (this.checkV4) {
        ip.push({
          version: 4,
          name: this.jpnicV4.value.name,
          ip: this.jpnicV4.value.subnet,
          plan: this.plan.getRawValue().v4,
          start_date: this.dateStart,
          end_date: this.dateEnd,
        });
      }
      if (this.checkV6) {
        ip.push({
          version: 6,
          name: this.jpnicV6.value.name,
          ip: this.jpnicV6.value.subnet,
          start_date: this.dateStart,
          end_date: this.dateEnd,
        });
      }

      body = {
        jpnic_admin: this.jpnicAdmin.getRawValue(),
        jpnic_tech: this.jpnicTech.getRawValue().tech,
        service_template_id: parseInt(this.serviceTypeID, 10),
        service_comment: this.serviceComment.value,
        org: this.jpnicJa.value.org,
        org_en: this.jpnicEn.value.org,
        postcode: this.jpnicJa.value.postcode,
        address: this.jpnicJa.value.address,
        address_en: this.jpnicEn.value.address,
        route_v4: this.routeV4,
        route_v6: this.routeV6,
        avg_upstream: this.bandwidth.value.aveUpstream,
        max_upstream: this.bandwidth.value.maxDownstream,
        avg_downstream: this.bandwidth.value.aveDownstream,
        max_downstream: this.bandwidth.value.maxDownstream,
        asn: this.asn.value,
        ip,
      };
    } else if (this.needGlobalAS) {
      const ipv4 = this.jpnicV4.value.subnet.split(',');
      const ipv6 = this.jpnicV6.value.subnet.split(',');
      for (const tmp of ipv4) {
        ip.push({
          version: 4,
          ip: tmp,
          start_date: this.dateStart,
          end_date: this.dateEnd,
        });
      }
      for (const tmp of ipv6) {
        ip.push({
          version: 6,
          ip: tmp,
          start_date: this.dateStart,
          end_date: this.dateEnd,
        });
      }
      body = {
        service_template_id: parseInt(this.serviceTypeID, 10),
        service_comment: this.serviceComment.value,
        route_v4: this.routeV4,
        route_v6: this.routeV6,
        avg_upstream: this.bandwidth.value.aveUpstream,
        max_upstream: this.bandwidth.value.maxDownstream,
        avg_downstream: this.bandwidth.value.aveDownstream,
        max_downstream: this.bandwidth.value.maxDownstream,
        bandwidth_as: this.bandwidth.value.asn,
        asn: this.asn.value,
        ip,
      };
    } else {
      this.commonService.openBar('Error: ServiceCode', 5000);
      return;
    }
    console.log(body);

    this.serviceService.create(this.data.id, body).then();
    location.reload();
  }
}

// connection情報の追加フィールド
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'group-detail-create-connection',
  templateUrl: 'group-detail-create-connection.html',
})
// tslint:disable-next-line:component-class-suffix
export class GroupDetailCreateConnection implements OnInit {

  public nttID: string;
  public nocID: string;
  public termIP = new FormControl();
  public address = new FormControl();
  public monitor: boolean;
  public termUser: any;
  public serviceID = 0;
  public connections: any[] = [];
  public connectionType: string;
  public connectionComment = new FormControl();
  public nocs: any[] = [];
  public ntts: any[] = [];
  public services: any[] = [];
  public needInternet = false;
  public needCrossConnect = false;
  public needComment = false;

  constructor(
    public dialogRef: MatDialogRef<GroupDetailCreateService>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private commonService: CommonService,
    private connectionService: ConnectionService,
    private userService: UserService,
    private groupService: GroupService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.commonService.getTemplate().then(res => {
      this.connections = res.connections;
      this.ntts = res.ntts;
      this.nocs = res.nocs;
    });
  }


  changeStatus(internet, crossConnect, comment: boolean) {
    this.needInternet = internet;
    this.needCrossConnect = crossConnect;
    this.needComment = comment;
  }

  request() {
    if (this.needInternet) {
      if (this.termIP.value === '') {
        this.commonService.openBar('終端先アドレスが入力されていません。', 5000);
        return;
      }
      if (this.nttID === '') {
        this.commonService.openBar('フレッツ光に関する質問が入力されていません。。', 5000);
        return;
      }
    }
    if (this.needComment && this.connectionComment.value === '') {
      this.commonService.openBar('その他項目が入力されていません。', 5000);
      return;
    }

    const body = {
      address: this.address.value,
      connection_template_id: parseInt(this.connectionType, 10),
      connection_comment: this.connectionComment.value,
      ntt_template_id: parseInt(this.nttID, 10),
      noc_id: parseInt(this.nocID, 10),
      term_ip: this.termIP.value,
      monitor: this.monitor
    };
    console.log(body);

    this.connectionService.create(this.serviceID, body).then(() => {
      console.log('---response---');
      this.commonService.openBar('申請完了', 5000);
      this.router.navigate(['/dashboard']).then();
      location.reload();
    });
  }
}


// connection情報の追加フィールド
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'group-detail-mail',
  templateUrl: 'group-detail-mail.html',
  styleUrls: ['./group-detail.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class GroupDetailMail implements OnInit {

  public mailInput = new FormGroup({
    to_email: new FormControl(),
    subject: new FormControl(),
    contents: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<GroupDetailCreateService>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private commonService: CommonService,
    private mailTemplateService: MailTemplateService,
    private http: HttpClient,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.mailInput.patchValue({
      to_email: this.data.mail.toEmail,
      subject: this.mailTemplateService.getSubject(this.data.mail.templateID),
      contents: this.mailTemplateService.getContent(this.data.mail.templateID)
    });
    console.log(this.mailInput.value);
  }

  notSend() {
    location.reload();
  }

  send() {
    if (this.mailInput.value.to_email === '') {
      this.commonService.openBar('送信先メールアドレスがありません。。', 5000);
      return;
    }

    if (this.mailInput.value.subject === '') {
      this.commonService.openBar('タイトルがありません。。', 5000);
      return;
    }

    if (this.mailInput.value.contents === '') {
      this.commonService.openBar('本文がありません。。', 5000);
      return;
    }

    const body = {
      to_mail: this.mailInput.value.to_email,
      subject: this.mailInput.value.subject,
      content: this.mailInput.value.contents,
    };
    console.log(body);

    this.http.post(environment.api.url + environment.api.path + '/mail',
      body, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          ACCESS_TOKEN: sessionStorage.getItem('AccessToken'),
        }),
      }).toPromise().then(r => {
      const response: any = r;
      console.log(response);
      location.reload();
    }).catch(error => {
      sessionStorage.setItem('error', JSON.stringify(error));
      this.router.navigate(['/error']).then();
    });

  }
}
