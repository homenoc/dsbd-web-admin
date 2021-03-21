import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ServiceService} from '../../../service/service.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConnectionService} from '../../../service/connection.service';
import {IpService} from '../../../service/ip.service';

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
