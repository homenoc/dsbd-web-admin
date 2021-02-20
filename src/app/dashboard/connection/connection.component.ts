import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../service/common.service';
import {Router} from '@angular/router';
import {ConnectionService} from '../../service/connection.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  constructor(
    private connectionService: ConnectionService,
    private commonService: CommonService,
    private router: Router,
  ) {
  }

  public connection: any[] = new Array();
  public loading = true;


  ngOnInit(): void {
    this.connectionService.getAll().then(response => {
      console.log(response);
      this.connection = response.connection;
      this.loading = false;
      this.commonService.openBar('OK', 5000);
    });
  }

  detailPage(id): void {
    this.router.navigate(['/dashboard/connection/' + id]).then();
  }
}
