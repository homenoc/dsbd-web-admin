import {Component, OnInit} from '@angular/core';
import {DataService} from "../../service/data.service";
import {Router} from "@angular/router";

class dataStruct {
  id: string;
  release: number;
  isAdmin = false;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
  ) {
  }

  public user: dataStruct[] = new Array();


  ngOnInit(): void {
    this.getUser();
  }

  userPage(id): void {
    this.router.navigate(['/dashboard/user/' + id ]).then();
  }

  getUser(): void {
    this.dataService.getAllUser().then(doc => {
      // console.log(doc.data())
      for (let i = 0; i < doc.size; i++) {
        console.log(doc.docs[i].id);
        // console.log(doc.docs[i].key('admin'));

        let status: number;
        let admin = false;
        if (doc.docs[i].data().status === undefined) {
          status = 1;
        } else {
          status = doc.docs[i].data().status;
        }

        if (doc.docs[i].data().admin) {
          admin = true;
        }

        this.user.push({
          id: doc.docs[i].id,
          release: status,
          isAdmin: admin,
        });
      }
      console.log(this.user);
    })
  }

}
