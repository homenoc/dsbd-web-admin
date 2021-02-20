import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../service/common.service';
import {Router} from '@angular/router';
import {RouterService} from '../../service/router.service';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-router',
  templateUrl: './router.component.html',
  styleUrls: ['./router.component.scss']
})
export class RouterComponent implements OnInit {

  constructor(
    private routerService: RouterService,
    private commonService: CommonService,
    private router: Router,
  ) {
  }

  public routers: any[] = new Array();
  public loading = true;
  public routerInput = new FormGroup({
    noc: new FormControl(),
    hostname: new FormControl(),
    address: new FormControl(),
    enable: new FormControl(),
  });

  ngOnInit(): void {
    this.routerService.getAll().then(response => {
      console.log(response);
      this.routers = response.router;
      this.loading = false;
      this.commonService.openBar('OK', 5000);
    });
  }

  add(): void {
    const json = JSON.stringify(this.routerInput.getRawValue());
    console.log(json);
    this.routerService.create(json).then(() => {
      this.commonService.openBar('OK', 5000);
      location.reload();
    });
  }

  detailPage(id): void {
    this.router.navigate(['/dashboard/router/' + id]).then();
  }

  delete(id): void {
    this.routerService.delete(id).then(() => {
      location.reload();
    });
  }
}