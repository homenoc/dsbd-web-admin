import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {DataService} from "../../service/data.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
})
export class MailComponent implements OnInit {

  constructor(
    private dataService: DataService) {
  }

  dataJP = new FormGroup({
    question: new FormControl(''),
    agreement: new FormControl(''),
    contract1: new FormControl(''),
    contract2: new FormControl(''),
    contact: new FormControl(''),
    subject: new FormControl(''),
    open: new FormControl(''),
    openAirmail: new FormControl(''),
  });

  dataEN = new FormGroup({
    question: new FormControl(''),
    agreement: new FormControl(''),
    contract1: new FormControl(''),
    contract2: new FormControl(''),
    contact: new FormControl(''),
    subject: new FormControl(''),
    open: new FormControl(''),
    openAirmail: new FormControl(''),
  });

  ngOnInit(): void {
    this.dataService.getJPMailData().then(d => {
      this.dataJP.setValue({
        question: d.data().question,
        agreement: d.data().agreement,
        contract1: d.data().contract1,
        contract2: d.data().contract2,
        contact: d.data().contact,
        subject: d.data().subject,
        open: d.data().open,
        openAirmail: d.data().openAirmail,
      })
    })
    this.dataService.getENMailData().then(d => {
      this.dataEN.setValue({
        question: d.data().question,
        agreement: d.data().agreement,
        contract1: d.data().contract1,
        contract2: d.data().contract2,
        contact: d.data().contact,
        subject: d.data().subject,
        open: d.data().open,
        openAirmail: d.data().openAirmail,
      })
    })
  }


  registrationJPMailData() {
    const doc = {}
    doc['question'] = this.dataJP.value.question;
    doc['agreement'] = this.dataJP.value.agreement;
    doc['contract1'] = this.dataJP.value.contract1;
    doc['contract2'] = this.dataJP.value.contract2;
    doc['contact'] = this.dataJP.value.contact;
    doc['subject'] = this.dataJP.value.subject;
    doc['open'] = this.dataEN.value.subject;
    doc['openAirmail'] = this.dataEN.value.subject;

    this.dataService.registrationJPMailData(doc).then();
  }

  registrationENMailData() {
    const doc = {}
    doc['question'] = this.dataEN.value.question;
    doc['agreement'] = this.dataEN.value.agreement;
    doc['contract1'] = this.dataEN.value.contract1;
    doc['contract2'] = this.dataEN.value.contract2;
    doc['contact'] = this.dataEN.value.contact;
    doc['subject'] = this.dataEN.value.subject;
    doc['open'] = this.dataEN.value.subject;
    doc['openAirmail'] = this.dataEN.value.subject;


    this.dataService.registrationENMailData(doc).then();
  }

}
