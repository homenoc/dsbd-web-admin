import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailTemplateService {

  constructor() {
  }

  //
  // status
  // 0:グループ審査完了 1:サービス情報の追加 2:サービス情報の審査完了=>接続情報の登録 3:開通作業=>開通

  getSubject(genre: number): string {
    let title: string;
    if (genre === 0) {
      title = 'グループ審査につきまして';
    } else if (genre === 1) {
      title = 'サービス情報の登録につきまして';
    } else if (genre === 2) {
      title = 'サービス内容確認の完了のお知らせ';
    }else if (genre === 3) {
      title = '開通作業の完了のお知らせ';
    }

    return title;
  }

  getContent(genre: number): string {
    let content: string;
    if (genre === 0) {
      content = 'ご担当者様\n\nグループ審査が完了致しました。\n' +
        'https://dashboard.homenoc.ad.jp よりサービス利用申請をしてください。';
    } else if (genre === 1) {
      content = 'ご担当者様\n\nサービスの追加をDashboardより申請可能です。\n' +
        'https://dashboard.homenoc.ad.jp よりサービス追加の申請ができます。';
    } else if (genre === 2) {
      content = 'ご担当者様\n\nサービス内容の確認が完了致しました。\n接続の追加をできるように設定変更致しました。\n' +
        'https://dashboard.homenoc.ad.jp より新規/続きの申請をしてください。';
    }else if (genre === 3) {
      content = 'ご担当者様\n\n先程、開通作業が完了致しました。\n' +
        'https://dashboard.homenoc.ad.jp より開通情報をご覧いただけます。';
    }

    return content;
  }
}
