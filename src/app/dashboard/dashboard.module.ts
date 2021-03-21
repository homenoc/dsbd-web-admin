import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {UserComponent} from './user/user.component';
import {UserDetailComponent} from './user/user-detail/user-detail.component';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatChipsModule} from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {HttpClientModule} from '@angular/common/http';
import {GroupComponent} from './group/group.component';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {
  GroupDetailComponent,
  GroupDetailCreateConnection,
  GroupDetailCreateService,
  GroupDetailMail
} from './group/group-detail/group-detail.component';
import {TokenComponent} from './token/token.component';
import {SupportComponent} from './support/support.component';
import {ChatComponent} from './support/chat/chat.component';
import {ConnectionComponent} from './connection/connection.component';
import {ConnectionDetailComponent} from './connection/connection-detail/connection-detail.component';
import {ServiceComponent} from './service/service.component';
import {ServiceDetailComponent, ServiceDetailOpenProcess} from './service/service-detail/service-detail.component';
import {NoticeComponent} from './notice/notice.component';
import {NoticeDetailComponent} from './notice/notice-detail/notice-detail.component';
import {MatMenuModule} from '@angular/material/menu';
import {NocComponent} from './noc/noc.component';
import {RouterComponent} from './router/router.component';
import {RouterDetailComponent} from './router/router-detail/router-detail.component';
import {NocDetailComponent} from './noc/noc-detail/noc-detail.component';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {GatewayComponent} from './gateway/gateway.component';
import {GatewayDetailComponent} from './gateway/gateway-detail/gateway-detail.component';
import {GatewayIpDetailComponent} from './gateway-ip/gateway-ip-detail/gateway-ip-detail.component';
import {GatewayIpComponent} from './gateway-ip/gateway-ip.component';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule} from '@angular-material-components/datetime-picker';


@NgModule({
  declarations: [
    DashboardComponent,
    UserComponent,
    UserDetailComponent,
    GroupComponent,
    GroupDetailComponent,
    GroupDetailCreateService,
    GroupDetailCreateConnection,
    GroupDetailMail,
    TokenComponent,
    SupportComponent,
    ChatComponent,
    ConnectionComponent,
    ConnectionDetailComponent,
    ServiceComponent,
    ServiceDetailComponent,
    ServiceDetailOpenProcess,
    NoticeComponent,
    NoticeDetailComponent,
    NocComponent,
    RouterComponent,
    RouterDetailComponent,
    NocDetailComponent,
    GatewayComponent,
    GatewayDetailComponent,
    GatewayIpComponent,
    GatewayIpDetailComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    DashboardRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatRadioModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
    MatMenuModule,
    MatTabsModule,
    MatExpansionModule,
    MatSelectModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ],
  exports: [
    MatCardModule,
    MatSidenavModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatInputModule,
    MatMenuModule,
    FormsModule,
  ],
  entryComponents: [GroupDetailComponent, GroupDetailCreateService, GroupDetailCreateConnection],
})
export class DashboardModule {
}
