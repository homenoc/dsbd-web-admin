import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {DataService} from "../../service/data.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
  ) {
  }

  public id: string;
  public serviceCode: string;
  public status: 0;
  data = new FormGroup({
    as: new FormControl(''),
    ipv4: new FormControl(''),
    ipv6: new FormControl(''),
    // contract: new FormGroup({
    service: new FormControl(''),
    name: new FormControl(''),
    fee: new FormControl(''),
    assign: new FormControl(''),
    // }),
    // connection: new FormGroup({
    connection: new FormControl(''),
    noc: new FormControl(''),
    termAddress: new FormControl(''),
    linkV4Our: new FormControl(''),
    linkV4Your: new FormControl(''),
    linkV6Our: new FormControl(''),
    linkV6Your: new FormControl(''),
    // }),
  });
  maxServiceCount = new FormControl(1, Validators.min(0));
  private new = false;


  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.serviceCode = this.route.snapshot.paramMap.get('service');
    this.dataService.getServiceData(this.id, this.serviceCode).then(d => {
        if (d.data() == undefined) {
          console.log('Data None');
          this.new = true;
        }
        console.log(d.data().as);
        this.data.setValue({
          as: d.data().as,
          ipv4: d.data().v4,
          ipv6: d.data().v6,
          service: d.data().service,
          name: d.data().name,
          fee: d.data().fee,
          assign: d.data().assign,
          connection: d.data().connection,
          noc: d.data().noc,
          termAddress: d.data().terminatedAddress,
          linkV4Our: d.data().v4_our,
          linkV4Your: d.data().v4_your,
          linkV6Our: d.data().v6_our,
          linkV6Your: d.data().v6_your,
        })
      }
    )
    this.dataService.getUser(this.id).then(doc => {
      this.status = doc.data().status;
      if (doc.data().status !== undefined) {
        console.log(doc.data().status)
      }
    })
  }

  registrationData(): void {
    let status: number = this.status + 10;

    const doc = {}
    doc['as'] = this.data.value.as;
    doc['v4'] = this.data.value.ipv4;
    doc['v6'] = this.data.value.ipv6;
    doc['service'] = this.data.value.service;
    doc['name'] = this.data.value.name;
    doc['fee'] = this.data.value.fee;
    doc['assign'] = this.data.value.assign;
    doc['connection'] = this.data.value.connection;
    doc['noc'] = this.data.value.noc;
    doc['terminatedAddress'] = this.data.value.termAddress;
    doc['v4_our'] = this.data.value.linkV4Our;
    doc['v4_your'] = this.data.value.linkV4Your;
    doc['v6_our'] = this.data.value.linkV6Our;
    doc['v6_your'] = this.data.value.linkV6Your;


    this.dataService.registrationServiceData(this.id, this.serviceCode, doc).then(() => {
        if (this.new) {
          this.dataService.registrationStatus(this.id, status).then()
        }
      }
    )
  }

}
