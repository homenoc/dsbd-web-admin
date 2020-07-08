import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CommonService} from "../../service/common.service";
import {DataService} from "../../service/data.service";

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private commonService: CommonService,
    private dataService: DataService,
  ) {
  }

  auth = new FormGroup({
    user: new FormControl(''),
    pass: new FormControl(''),
  });
  contentJP = new FormControl('');
  subjectJP = new FormControl('');
  contentEN = new FormControl('');
  subjectEN = new FormControl('');

  mail: string;
  genre: number;

  //1:question 2:agreement 3:contract1 4:contract2 5:open(WebPage) 6:(AirMail)

  ngOnInit(): void {
    this.mail = this.route.snapshot.paramMap.get('mail');
    this.genre = parseInt(this.route.snapshot.paramMap.get('genre'));
    this.dataService.getJPMailData().then(d => {
      if (this.genre === 1) {
        this.subjectJP.setValue(d.data().subject)
        this.contentJP.setValue(d.data().question + '\n' + d.data().contact)
      } else if (this.genre === 2) {
        this.subjectJP.setValue(d.data().subject)
        this.contentJP.setValue(d.data().agreement + '\n' + d.data().contact)
      } else if (this.genre === 3) {
        this.subjectJP.setValue(d.data().subject)
        this.contentJP.setValue(d.data().contract1 + '\n' + d.data().contact)
      } else if (this.genre === 4) {
        this.subjectJP.setValue(d.data().subject)
        this.contentJP.setValue(d.data().contract2 + '\n' + d.data().contact)
      } else if (this.genre === 5) {
        this.subjectJP.setValue('開通のお知らせ')
        this.contentJP.setValue(d.data().open + '\n' + d.data().contact)
      } else if (this.genre === 6) {
        this.subjectJP.setValue('開通について')
        this.contentJP.setValue(d.data().openAirmail + '\n' + d.data().contact)
      } else {
        this.contentJP.setValue('\n' + d.data().contact)
      }
    })
    this.dataService.getENMailData().then(d => {
      if (this.genre === 1) {
        this.subjectEN.setValue(d.data().subject)
        this.contentEN.setValue(d.data().question + '\n' + d.data().contact)
      } else if (this.genre === 2) {
        this.subjectEN.setValue(d.data().subject)
        this.contentEN.setValue(d.data().agreement + '\n' + d.data().contact)
      } else if (this.genre === 3) {
        this.subjectEN.setValue(d.data().subject)
        this.contentEN.setValue(d.data().contract1 + '\n' + d.data().contact)
      } else if (this.genre === 4) {
        this.subjectEN.setValue(d.data().subject)
        this.contentEN.setValue(d.data().contract2 + '\n' + d.data().contact)
      } else if (this.genre === 5) {
        this.subjectEN.setValue('About opening')
        this.contentEN.setValue(d.data().open + '\n' + d.data().contact)
      } else if (this.genre === 6) {
        this.subjectEN.setValue('About opening')
        this.contentEN.setValue(d.data().openAirmail + '\n' + d.data().contact)
      } else {
        this.contentEN.setValue('\n' + d.data().contact)
      }
    })
  }

  sendMail() {
    const url: string = 'http://admin.local.bgp.ne.jp:8080/api/v1/mail';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        User: this.auth.value.user,
        Pass: this.auth.value.pass,
        // 'Accept': '*/*',
      })
    };
    const body: any = {
      to: this.mail,
      content: this.contentJP.value,
      subject: this.subjectJP.value
    };

    this.http.post<any>(url, body, httpOptions)
      .toPromise()
      .then(d => this.commonService.openBar(d, 3000));
  }

  sendTestMail() {
    const url: string = 'http://localhost:8080/api/v1/mail';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        User: this.auth.value.user,
        Pass: this.auth.value.pass,
        // 'Accept': '*/*',
      })
    };
    const body: any = {
      to: this.mail,
      content: this.contentJP.value,
      subject: this.subjectJP.value
    };

    this.http.post<any>(url, body, httpOptions)
      .toPromise()
      .then(d => this.commonService.openBar(d, 3000));
  }
}
