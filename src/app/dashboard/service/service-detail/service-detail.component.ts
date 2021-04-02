import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ServiceService} from '../../../service/service.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConnectionService} from '../../../service/connection.service';
import {IpService} from '../../../service/ip.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

export interface DialogData {
  service: any;
}

@Component({
  selector: 'app-network-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public serviceService: ServiceService,
    private commonService: CommonService,
    public dialog: MatDialog,
  ) {
  }

  public id: string;
  public serviceInput = new FormGroup({
    ID: new FormControl(),
    asn: new FormControl(''),
    group_id: new FormControl(''),
    org: new FormControl(''),
    org_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    route_v4: new FormControl(''),
    route_v6: new FormControl(''),
    type: new FormControl(),
    lock: new FormControl(),
    open: new FormControl()
  });
  public loading = true;
  public hide = false;
  public service: any;
  public serviceCode: string;
  public ips: any[] = [];

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.serviceService.get(this.id).then(response => {
      console.log(response);
      this.service = response.service[0];
      this.serviceInput.patchValue({
        ID: response.service[0].ID,
        group_id: response.service[0].group_id,
        lock: response.service[0].lock,
        open: response.service[0].open,
      });
      for (const tmpIP of response.service[0].ip) {
        if (tmpIP.plan !== null || tmpIP.plan !== 0) {
          const tmp = {
            ID: tmpIP.ID,
            After: 0,
            HalfYear: 0,
            OneYear: 0,
          };
          for (const tmpPlan of tmpIP.plan) {
            tmp.After += tmpPlan.after;
            tmp.HalfYear += tmpPlan.half_year;
            tmp.OneYear += tmpPlan.one_year;
          }
          this.ips.push(tmp);
        }
      }
      this.serviceCode = this.service.group_id + '-' + this.service.service_template.type + ('000' + this.service.service_number).slice(-3);

      this.loading = false;
      this.commonService.openBar('OK', 5000);
    });
  }

  update(): void {
    const json = JSON.stringify(this.serviceInput.getRawValue());
    console.log(json);
    this.serviceService.update(this.id, json).then(response => {
      this.commonService.openBar('OK', 5000);
      location.reload();
    });
  }

  getPlanAfter(id: number): any {
    const result = this.ips.find(item => item.ID === id);
    return result.After;
  }

  getPlanHalfYear(id: number): any {
    const result = this.ips.find(item => item.ID === id);
    return result.HalfYear;
  }

  getPlanOneYear(id: number): any {
    const result = this.ips.find(item => item.ID === id);
    return result.OneYear;
  }

  linkUser(id: number): void {
    this.router.navigate(['/dashboard/user/' + id]).then();
  }

  requestServiceRequestLock(lock: boolean) {
    this.serviceService.update(this.service.ID, {lock}).then(() => {
        this.commonService.openBar('OK', 5000);
        location.reload();
      }
    );
  }

  // tslint:disable-next-line:variable-name
  requestServiceRequestAddAllow(add_allow: boolean) {
    this.serviceService.update(this.service.ID, {add_allow}).then(() => {
        this.commonService.openBar('OK', 5000);
        location.reload();
      }
    );
  }

  connectionPage(id): void {
    this.router.navigate(['/dashboard/connection/' + id]).then();
  }

  openProcess() {
    const dialogRef = this.dialog.open(ServiceDetailOpenProcess, {
      data: {
        service: this.service,
      },
      height: '600px',
      width: '900px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      location.reload();
    });
  }

  openIP() {
    const dialogRef = this.dialog.open(ServiceDetailIP, {
      data: {
        service: this.service,
      },
      height: '600px',
      width: '900px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      location.reload();
    });
  }

  openJPNICAdmin() {
    const dialogRef = this.dialog.open(ServiceDetailJPNICAdmin, {
      data: {
        service: this.service,
      },
      height: '600px',
      width: '900px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      location.reload();
    });
  }

  openJPNICTech() {
    const dialogRef = this.dialog.open(ServiceDetailJPNICTech, {
      data: {
        service: this.service,
      },
      height: '600px',
      width: '900px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      location.reload();
    });
  }
}


// 開通に関するフィールド
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'service-detail-open-process',
  templateUrl: 'service-detail-open-process.html',
  styleUrls: ['./service-detail.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ServiceDetailOpenProcess implements OnInit {

  public asn = new FormControl();
  public ipSubnet = new FormControl([]);
  public connections = new FormArray([]);
  public ips = new FormArray([]);
  public serviceCode: string;
  public templateTunnelEndPointRouterIP: any[] = [];
  public bgpRouters: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<ServiceDetailOpenProcess>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private serviceService: ServiceService,
    private connectionService: ConnectionService,
    private ipService: IpService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {
    this.asn.patchValue(this.data.service.asn);

    for (const tmpIP of this.data.service.ip) {
      this.addIP(tmpIP);
    }
    for (const tmpConnection of this.data.service.connections) {
      this.addConnection(tmpConnection);
    }

    this.commonService.getTemplate().then(template => {
      this.bgpRouters = template.bgp_router;
      console.log(this.bgpRouters);
      for (const tmpNOC of template.nocs) {
        for (const tmpEndPoint of tmpNOC.tunnel_endpoint_router) {
          for (const tmpEndPointIP of tmpEndPoint.tunnel_endpoint_router_ip) {
            console.log(tmpNOC.ID, tmpNOC.name);
            if (tmpNOC.enable && tmpEndPoint.enable && tmpEndPointIP.enable) {
              this.templateTunnelEndPointRouterIP.push({
                ID: Number(tmpEndPointIP.ID),
                noc: tmpNOC.name,
                hostname: tmpEndPoint.hostname,
                ip: tmpEndPointIP.ip,
              });
            }
          }
        }
      }
    });

    this.serviceCode = this.data.service.group_id + '-' + this.data.service.service_template.type +
      ('000' + this.data.service.service_number).slice(-3);
  }

  addIP(tmpData: any) {
    const control = new FormGroup({
      id: new FormControl(tmpData.ID),
      ip: new FormControl(tmpData.ip),
      name: new FormControl(tmpData.name),
      open: new FormControl(tmpData.open),
    });
    this.ips.push(control);
  }

  addConnection(tmpData: any) {
    const control = new FormGroup({
      ID: new FormControl(tmpData.ID),
      open: new FormControl(tmpData.open),
      link_v4_our: new FormControl(tmpData.link_v4_our),
      link_v4_your: new FormControl(tmpData.link_v4_your),
      link_v6_our: new FormControl(tmpData.link_v6_our),
      link_v6_your: new FormControl(tmpData.link_v6_your),
      noc_id: new FormControl(tmpData.noc_id),
      bgp_router_id: new FormControl(tmpData.bgp_router_id),
      type: new FormControl(tmpData.connection_template.type),
      number: new FormControl(tmpData.connection_number),
      connection_template_id: new FormControl(tmpData.connection_template_id),
      tunnel_endpoint_router_ip_id: new FormControl(tmpData.tunnel_endpoint_router_ip_id),
      term_ip: new FormControl(tmpData.term_ip),
    });
    this.connections.push(control);
  }

  requestService() {
    this.serviceService.update(this.data.service.ID, {
      asn: this.asn.value,
    }).then(() => {
        this.commonService.openBar('OK', 5000);
        location.reload();
      }
    );
  }

  requestServiceOpen(open: boolean) {
    this.serviceService.update(this.data.service.ID, {
      asn: this.asn.value,
      open
    }).then(() => {
        this.commonService.openBar('OK', 5000);
        location.reload();
      }
    );
  }

  requestConnectionOpen(index: number, open: boolean) {
    const tmpConnection = this.connections.value[index];
    console.log(tmpConnection);

    this.connectionService.update(tmpConnection.ID, {
      link_v4_our: tmpConnection.link_v4_our,
      link_v4_your: tmpConnection.link_v4_your,
      link_v6_our: tmpConnection.link_v6_our,
      link_v6_your: tmpConnection.link_v6_your,
      noc_id: tmpConnection.noc_id,
      bgp_router_id: tmpConnection.bgp_router_id,
      connection_template_id: tmpConnection.connection_template_id,
      tunnel_endpoint_router_ip_id: tmpConnection.tunnel_endpoint_router_ip_id,
      term_ip: tmpConnection.term_ip,
      open,
    }).then(() => {
      this.commonService.openBar('OK', 5000);
      location.reload();
    });
  }

  requestConnection(index: number) {
    const tmpConnection = this.connections.value[index];
    console.log(tmpConnection);

    this.connectionService.update(tmpConnection.ID, {
      link_v4_our: tmpConnection.link_v4_our,
      link_v4_your: tmpConnection.link_v4_your,
      link_v6_our: tmpConnection.link_v6_our,
      link_v6_your: tmpConnection.link_v6_your,
      noc_id: tmpConnection.noc_id,
      bgp_router_id: tmpConnection.bgp_router_id,
      connection_template_id: tmpConnection.connection_template_id,
      tunnel_endpoint_router_ip_id: tmpConnection.tunnel_endpoint_router_ip_id,
      term_ip: tmpConnection.term_ip,
    }).then(() => {
      this.commonService.openBar('OK', 5000);
      location.reload();
    });
  }

  requestIPOpen(id: string, ip: string, open: boolean) {
    this.ipService.updateIP(id, {ID: id, ip, open}).then(() => {
        this.commonService.openBar('OK', 5000);
        location.reload();
      }
    );
  }

  requestIP(id: string, ip: string) {
    this.ipService.updateIP(id, {ID: id, ip}).then(() => {
        this.commonService.openBar('OK', 5000);
        location.reload();
      }
    );
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'service-detail-ip',
  templateUrl: 'service-detail-ip.html',
  styleUrls: ['./service-detail.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ServiceDetailIP implements OnInit {

  public hide = false;
  public id = 0;
  public ips: any[] = [];
  public ipStruct = new FormGroup({
    name: new FormControl(''),
    ip: new FormControl(''),
    version: new FormControl(4),
  });
  public plan: FormGroup;
  public dateStart: string;
  public dateEnd: string;
  public dateEndUnlimited = false;
  public dateStartTemplate = new FormControl(new Date());
  public dateEndTemplate = new FormControl(new Date());


  constructor(
    public dialogRef: MatDialogRef<ServiceDetailOpenProcess>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private serviceService: ServiceService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {
    console.log(this.data.service);
    for (const tmp of this.data.service.ip) {
      console.log(tmp);
      this.ips.push(tmp);
    }
    this.plan = this.formBuilder.group({
      v4: this.formBuilder.array([])
    });
  }

  change(event) {
    if (event.value === 0) {
      this.id = 0;
      this.ipStruct.patchValue({
        name: '',
        ip: '',
        version: 4,
      });
      this.plan = this.formBuilder.group({
        v4: this.formBuilder.array([])
      });
    } else {
      this.id = event.value.ID;
      this.ipStruct.patchValue({
        name: event.value.name,
        ip: event.value.ip,
        version: event.value.version,
      });
      if (event.value.end_date === null) {
        this.dateEndUnlimited = true;
      } else {
        this.dateEndTemplate.setValue(event.value.end_date);
        this.dateEnd = this.dateToString(new Date(Date.parse(this.dateEndTemplate.value)));
      }
      this.dateStartTemplate.setValue(event.value.start_date);
      this.dateStart = this.dateToString(new Date(Date.parse(this.dateStartTemplate.value)));

      for (const tmp of event.value.plan) {
        console.log(tmp.ID);
        this.planProcess.push(this.formBuilder.group({
          ID: tmp.ID,
          name: tmp.name,
          after: tmp.after,
          half_year: tmp.half_year,
          one_year: tmp.one_year,
        }));
      }
    }
  }

  addEventStart(event: MatDatepickerInputEvent<Date>) {
    this.dateStart = this.dateToString(event.value);
  }

  addEventEnd(event: MatDatepickerInputEvent<Date>) {
    if (event.value !== null) {
      this.dateEnd = this.dateToString(event.value);
    }
  }

  dateToString(data: Date): any {
    if (data === null) {
      return null;
    } else {
      return this.dateEnd = data.getFullYear() + '-' + ('00' + (data.getMonth() + 1)).slice(-2) + '-' + ('00' + (data.getDate())).slice(-2);
    }
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

  createPlan(i: number) {
    const plan = this.plan.getRawValue().v4[i];
    console.log(plan);
    plan.ip_id = this.id;
    this.serviceService.createPlan(plan).then(response => {
      console.log(response);
      location.reload();
    });
  }

  updatePlan(i: number) {
    const plan = this.plan.getRawValue().v4[i];
    console.log(plan);
    plan.ip_id = this.id;
    this.serviceService.updatePlan(plan.ID, plan).then(response => {
      console.log(response);
      location.reload();
    });
  }

  deletePlan(i: number) {
    const plan = this.plan.getRawValue().v4[i];
    console.log(plan);
    this.serviceService.deletePlan(plan.ID).then(response => {
      console.log(response);
      location.reload();
    });
  }

  createIP() {
    const body = this.ipStruct.getRawValue();
    body.start_date = this.dateStart;
    if (this.dateEndUnlimited) {
      body.end_date = null;
    } else {
      body.end_date = this.dateEnd;
    }

    body.plan = this.plan.getRawValue().v4;
    console.log(body);
    this.serviceService.createIP(this.data.service.ID, body).then(response => {
      console.log(response);
      location.reload();
    });
  }

  deleteIP() {
    this.serviceService.deleteIP(this.data.service.ID, this.id).then(response => {
      console.log(response);
      location.reload();
    });
  }

  updateIP() {
    const body = this.ipStruct.getRawValue();
    body.start_date = this.dateStart;
    if (this.dateEndUnlimited) {
      body.end_date = null;
    } else {
      body.end_date = this.dateEnd;
    }
    console.log(body);

    this.serviceService.updateIP(this.data.service.ID, this.id, body).then(response => {
        console.log(response);
        location.reload();
      }
    );
  }
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'service-detail-jpnic-admin',
  templateUrl: 'service-detail-jpnic-admin.html',
  styleUrls: ['./service-detail.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ServiceDetailJPNICAdmin implements OnInit {

  public jpnicAdmin = new FormGroup({
    jpnic_handle: new FormControl(''),
    org: new FormControl(''),
    org_en: new FormControl(''),
    mail: new FormControl(''),
    name: new FormControl(''),
    name_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    dept: new FormControl(''),
    dept_en: new FormControl(''),
    pos: new FormControl(''),
    pos_en: new FormControl(''),
    tel: new FormControl(''),
    fax: new FormControl(''),
    country: new FormControl(''),
  });
  public hide = true;


  constructor(
    public dialogRef: MatDialogRef<ServiceDetailOpenProcess>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private serviceService: ServiceService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {
    console.log(this.data.service);

    if (this.data.service.jpnic_admin_id !== 0) {
      this.jpnicAdmin.patchValue({
        jpnic_handle: this.data.service.jpnic_admin.jpnic_handle,
        org: this.data.service.jpnic_admin.org,
        org_en: this.data.service.jpnic_admin.org_en,
        mail: this.data.service.jpnic_admin.mail,
        name: this.data.service.jpnic_admin.name,
        name_en: this.data.service.jpnic_admin.name_en,
        postcode: this.data.service.jpnic_admin.postcode,
        address: this.data.service.jpnic_admin.address,
        address_en: this.data.service.jpnic_admin.address_en,
        dept: this.data.service.jpnic_admin.dept,
        dept_en: this.data.service.jpnic_admin.dept_en,
        tel: this.data.service.jpnic_admin.tel,
        fax: this.data.service.jpnic_admin.fax,
        country: this.data.service.jpnic_admin.country,
      });
    }

  }

  requestCreate() {
    const body = this.jpnicAdmin.getRawValue();
    console.log(body);
    this.serviceService.createJPNICAdmin(this.data.service.ID, body).then(d => {
      console.log(d);
    });
  }

  requestUpdate() {
    const body = this.jpnicAdmin.getRawValue();
    console.log(body);
    this.serviceService.updateJPNICAdmin(this.data.service.ID, this.data.service.jpnic_admin_id, body).then(d => {
      console.log(d);
    });
  }
}


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'service-detail-jpnic-tech',
  templateUrl: 'service-detail-jpnic-tech.html',
  styleUrls: ['./service-detail.component.scss']
})
// tslint:disable-next-line:component-class-suffix
export class ServiceDetailJPNICTech implements OnInit {

  public jpnicTechUser: any[] = [];
  public hide = false;
  public id = 0;
  public jpnicTech = new FormGroup({
    jpnic_handle: new FormControl(''),
    org: new FormControl(''),
    org_en: new FormControl(''),
    mail: new FormControl(''),
    name: new FormControl(''),
    name_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    dept: new FormControl(''),
    dept_en: new FormControl(''),
    pos: new FormControl(''),
    pos_en: new FormControl(''),
    tel: new FormControl(''),
    fax: new FormControl(''),
    country: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<ServiceDetailOpenProcess>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private serviceService: ServiceService,
    private commonService: CommonService,
  ) {
  }

  ngOnInit() {
    for (const tmp of this.data.service.jpnic_tech) {
      console.log(tmp);
      this.jpnicTechUser.push(tmp);
    }
  }

  change(event) {
    if (event.value === 0) {
      this.id = 0;
      this.jpnicTech.patchValue({
        jpnic_handle: '',
        org: '',
        org_en: '',
        mail: '',
        name: '',
        name_en: '',
        postcode: '',
        address: '',
        address_en: '',
        dept: '',
        dept_en: '',
        tel: '',
        fax: '',
        country: '',
      });

    } else {
      this.id = event.value.ID;
      this.jpnicTech.patchValue({
        jpnic_handle: event.value.jpnic_handle,
        org: event.value.org,
        org_en: event.value.org_en,
        mail: event.value.mail,
        name: event.value.name,
        name_en: event.value.name_en,
        postcode: event.value.postcode,
        address: event.value.address,
        address_en: event.value.address_en,
        dept: event.value.dept,
        dept_en: event.value.dept_en,
        tel: event.value.tel,
        fax: event.value.fax,
        country: event.value.country,
      });
    }
  }

  createJPNICTech() {
    const body = this.jpnicTech.getRawValue();
    console.log(body);
    this.serviceService.createJPNICTech(this.data.service.ID, body).then(() => {
      location.reload();
    });
  }

  deleteJPNICTech() {
    this.serviceService.deleteJPNICTech(this.data.service.ID, this.id).then(() => {
      location.reload();
    });
  }

  updateJPNICTech() {
    const body = this.jpnicTech.getRawValue();
    console.log(body);
    this.serviceService.updateJPNICTech(this.data.service.ID, this.id, body).then(() => {
        location.reload();
      }
    );
  }
}
