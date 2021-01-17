import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../../../service/common.service';
import {FormControl, FormGroup} from '@angular/forms';
import {NetworkService} from '../../../service/network.service';

@Component({
  selector: 'app-network-detail',
  templateUrl: './network-detail.component.html',
  styleUrls: ['./network-detail.component.scss']
})
export class NetworkDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public networkService: NetworkService,
    private commonService: CommonService,
  ) {
  }

  public id: string;
  public networkInput = new FormGroup({
    ID: new FormControl(),
    asn: new FormControl(''),
    group_id: new FormControl(''),
    org: new FormControl(''),
    org_en: new FormControl(''),
    postcode: new FormControl(''),
    address: new FormControl(''),
    address_en: new FormControl(''),
    pi: new FormControl(''),
    v4: new FormControl(''),
    v4_name: new FormControl(''),
    v6: new FormControl(''),
    v6_name: new FormControl(''),
    lock: new FormControl(),
    open: new FormControl()
  });
  public loading = true;
  public hide = false;
  public network: any;
  public users: any;
  public jpnicAdmin: any;
  public jpnicTech: any;

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.networkService.get(this.id).then(response => {
      console.log(response);
      if (response.status) {
        this.network = response.network[0];
        this.users = response.user;
        this.jpnicAdmin = response.jpnic_admin;
        this.jpnicTech = response.jpnic_tech;
        this.networkInput.patchValue({
          ID: response.network[0].ID,
          group_id: response.network[0].group_id,
          lock: response.network[0].lock,
          open: response.network[0].open,
        });
        this.loading = false;
        console.log(this.network);
        this.commonService.openBar('OK', 5000);
      } else {
        this.commonService.openBar('NG', 5000);
        console.log('error: ' + JSON.stringify(response));
        return;
      }
    });
  }

  update(): void {
    const json = JSON.stringify(this.networkInput.getRawValue());
    console.log(json);
    this.networkService.update(this.id, json).then(response => {
      if (response.status) {
        this.commonService.openBar('OK', 5000);
        location.reload();
      } else {
        this.commonService.openBar('NG', 5000);
        console.log('error: ' + JSON.stringify(response));
      }
    });
  }

  getUser(id: number): string {
    const user = this.users.find(e => e.ID === id);
    return user.ID + ':' + user.name + ' ';
  }

  linkUser(id: number): void {
    this.router.navigate(['/dashboard/user/' + id]).then();
  }
}
