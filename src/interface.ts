export interface NoticeData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    start_time: string
    end_time: string
    everyone: boolean
    fault: boolean
    important: boolean
    info: boolean
    title: string,
    data: string,
    group_id: number,
    noc_id: number,
    user_id: number
}

export interface NoticeRegisterData {
    user_id: number[],
    group_id: number[],
    noc_id: number[],
    start_time: string,
    end_time?: string,
    title: string,
    data: string,
    everyone: boolean,
    important: boolean,
    fault: boolean
    info: boolean
}

export interface UserDetailData {
    CreatedAt: string,
    ID: number,
    UpdatedAt: string,
    email: string,
    expired_status: number,
    group?: GroupDetailData
    group_id: number,
    level: number,
    mail_token: string,
    mail_verify: true,
    name: string,
    name_en: string,
    notice?: NoticeData[],
    pass: string,
    tokens?: TokenDetailData[]
}

export interface PaymentDetailData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    user?: UserDetailData,
    group?: GroupDetailData,
    is_membership: boolean,
    paid: boolean,
    refund: boolean,
    fee: number,
    payment_intent_id: string,
    comment: string,
}

export interface TokenDetailData {
    CreatedAt: string,
    ID: number,
    UpdatedAt: string,
    access_token: string,
    admin: boolean,
    debug: string,
    expired_at: string,
    status: number,
    tmp_token: string,
    user?: UserDetailData,
    user_id: number,
    user_token: string,
}

export interface TicketDetailData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    solved: boolean,
    group_id: number,
    user_id: number,
    admin: boolean,
    title: string,
    request: boolean,
    request_reject: boolean,
    chat?: ChatData[],
    user?: UserDetailData,
    group?: GroupDetailData,
}

export interface ServiceDetailData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    group_id: number,
    asn: number,
    fee: number,
    org: string,
    org_en: string,
    postcode: string,
    address: string,
    address_en: string,
    route_v4: string,
    route_v6: string,
    avg_downstream: number,
    avg_upstream: number,
    max_downstream: number,
    max_upstream: number,
    max_bandwidth_as: number,
    service_number: number,
    pass: boolean,
    enable: boolean,
    lock: boolean,
    add_allow: boolean,
    ip?: IPData[],
    jpnic_admin?: JPNICData,
    jpnic_tech?: JPNICData[],
    service_template: ServiceTemplateData
    connections?: ConnectionDetailData[]
}

export interface IPData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    DeletedAt: string,
    service_id: number,
    PlanJPNIC: string,
    start_date: string,
    end_date: string,
    user_case: string
    ip: string,
    name: string,
    version: number
    open: boolean,
    plan?: PlanData[]
}

export interface PlanData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    DeletedAt: string,
    name: string,
    ip: string,
    after: number,
    half_year: number,
    one_year: number
}

export interface JPNICData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    DeletedAt: string,
    address: string,
    address_en: string,
    country: string,
    dept: string,
    dept_en: string,
    fax: string,
    jpnic_handle: string,
    mail: string,
    name: string,
    name_en: string,
    org: string,
    org_en: string,
    postcode: string,
    tel: string,
    lock: boolean
}

export interface ServiceTemplateData {
    ID: number,
    name: string,
    comment: string,
    hidden: boolean,
    type: string
    need_comment: boolean,
    need_global_as: boolean,
    need_jpnic: boolean,
    need_route: boolean
}

export interface ConnectionDetailData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    address: string,
    link_v4_our: string,
    link_v4_your: string,
    link_v6_our: string,
    link_v6_your: string,
    term_ip: string,
    enable: boolean,
    open: boolean,
    monitor: boolean,
    noc?: NocTemplateData,
    noc_id: number,
    bgp_router_id: number,
    bgp_router?: BGPRouterDetailData,
    service?: ServiceDetailData,
    connection_number: number,
    tunnel_endpoint_router_ip_id: number,
    ntt_template_id: number,
    ntt_template?: NTTTemplateData,
    ipv4_route_template?: IPv4RouteTemplate,
    ipv6_route_template?: IPv6RouteTemplate,
    connection_template: ConnectionTemplateData,
    tunnel_endpoint_router_ip?: TunnelEndPointRouterIPTemplateData
}

export interface BGPRouterDetailData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    address: string
    comment: string
    enable: boolean
    hostname: string
    noc: NocTemplateData
    noc_id: number
    tunnel_endpoint_router: null
}

export interface NocTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    name: string
    bandwidth: string
    bgp_router?: BGPRouterDetailData
    comment: string
    enable: boolean
    location: string
}

export interface NTTTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    name: string
    comment: string
    hidden: boolean
}

export interface MailTemplateData {
    process_id: string
    subject: string
    message: string
}

export interface IPTemplateData {
    name: any;
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    comment: string
    hide: boolean
    quantity: number
    subnet: string
    title: string
}

export interface TunnelEndPointRouterTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    capacity: number
    comment: string
    enable: boolean
    hostname: string
    noc_id: number
    tunnel_endpoint_router_ip: TunnelEndPointRouterIPTemplateData[]
}

export interface TunnelEndPointRouterIPTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    ip: string,
    enable: boolean
    tunnel_endpoint_router: TunnelEndPointRouterTemplateData
}

export interface ConnectionTemplateData {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    name: string,
    type: string
    comment: string
    need_comment: boolean
    need_cross_connect: boolean
    need_internet: boolean
    l2: boolean
    l3: boolean
}

export interface GroupDetailData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    memos?: MemoData[],
    payment_coupon_template_id?: number,
    payment_membership_template_id?: number,
    expired_status: number,
    status: number,
    pass: boolean,
    add_allow: boolean,
    agree: boolean,
    question: string,
    org: string,
    org_en: string,
    postcode: string,
    address: string,
    address_en: string,
    tel: string,
    country: string,
    contract: string,
    student: boolean,
    student_expired: string,
    fee: number,
    lock: boolean,
    paid: boolean,
    member_expired: string,
    users?: UserDetailData[],
    tickets?: TicketDetailData[],
    services?: ServiceDetailData[],
    payment_coupon_template?: PaymentCouponTemplateData
    payment_membership_template?: PaymentMembershipTemplate
}

export interface IPv4RouteTemplate {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    name: string
}

export interface IPv6RouteTemplate {
    CreatedAt: string
    DeletedAt: string
    ID: number
    UpdatedAt: string
    name: string
}

export interface MemoData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    group_id: number,
    type: number,
    title: string,
    message: string
}

export interface PaymentMembershipTemplate {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    title: string,
    plan: string,
    monthly: boolean,
    yearly: boolean,
    fee: number,
    comment: string
}

export interface PaymentCouponTemplateData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    title: string,
    discount_rate: number,
    comment: string
}

export interface TemplateData {
    bgp_router?: BGPRouterDetailData[]
    connections?: ConnectionTemplateData[]
    services?: ServiceTemplateData[]
    ipv4?: IPTemplateData[]
    ipv6?: IPTemplateData[]
    nocs?: NocTemplateData[]
    ntts?: NTTTemplateData[]
    tunnel_endpoint_router?: TunnelEndPointRouterTemplateData[]
    tunnel_endpoint_router_ip?: TunnelEndPointRouterIPTemplateData[]
    payment_membership_template?: PaymentMembershipTemplate[]
    payment_coupon_template?: PaymentCouponTemplateData[]
    ipv4_route?: IPRouteData[]
    ipv6_route?: IPRouteData[]
    user?: UserDetailData[]
    group?: GroupDetailData[]
    mail_template?: MailTemplateData[]
}

export interface IPRouteData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    name: string
}

export interface MemoAddData {
    group_id: number,
    type: number,
    title: string,
    message: string
}

export interface TicketAddData {
    is_group: boolean,
    user_id: number,
    group_id: number,
    title: string,
    data: string
}

export interface ServiceAddData {
    jpnic_admin?: ServiceAddJPNICData,
    jpnic_tech?: ServiceAddJPNICData[],
    service_template_id: number,
    service_comment: string,
    org?: string,
    org_en?: string,
    postcode?: string,
    address?: string,
    address_en?: string,
    route_v4?: string,
    route_v6?: string,
    avg_upstream: number,
    max_upstream: number,
    avg_downstream: number,
    max_downstream: number,
    max_bandwidth_as?: string,
    asn?: number,
    ip?: ServiceAddIPData[],
    start_date: string,
    end_date?: string
}

export interface ServiceAddJPNICData {
    org: string,
    org_en: string,
    mail: string,
    postcode: string,
    address: string,
    address_en: string,
    name: string,
    name_en: string,
    dept_en: string,
    dept: string,
    country: string,
    tel: string,
    fax: string,
}

export interface ServiceAddIPData {
    version: number,
    ip: string,
    plan?: ServiceAddIPv4PlanData[],
    name: string,
    start_date: string,
    end_date?: string
}

export interface ServiceAddIPv4PlanData {
    name: string,
    after: number,
    half_year: number,
    one_year: number,
}

export interface ConnectionAddData {
    address: string,
    connection_template_id: number,
    connection_comment: string,
    ipv4_route_template_id?: number,
    ipv6_route_template_id?: number,
    ntt_template_id: number,
    noc_id: number,
    term_ip: string,
    monitor: boolean
}

export interface ChatData {
    time: string,
    data: string,
    user_name: string,
    admin: boolean,
}

export interface MailSendData {
    to_mail: string,
    subject: string,
    content: string,
}

export const DefaultTemplateData: TemplateData = {
    bgp_router: undefined,
    connections: undefined,
    services: undefined,
    ipv4: undefined,
    ipv6: undefined,
    nocs: undefined,
    ntts: undefined,
    tunnel_endpoint_router: undefined,
    tunnel_endpoint_router_ip: undefined,
    user: undefined,
    group: undefined,
}

export const DefaultGroupDetailData: GroupDetailData = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    payment_coupon_template_id: 0,
    org: "",
    org_en: "",
    status: 0,
    expired_status: 0,
    pass: false,
    add_allow: false,
    agree: false,
    question: "",
    postcode: "",
    address: "",
    address_en: "",
    tel: "",
    country: "",
    contract: "",
    student: false,
    student_expired: "",
    fee: 0,
    member_expired: "",
    paid: false,
    lock: false,
    users: undefined,
    tickets: undefined,
    services: undefined,
};

export const DefaultGroupDetailDataArray: GroupDetailData[] = [DefaultGroupDetailData]
export const DefaultServiceAddData: ServiceAddData = {
    jpnic_admin: undefined,
    jpnic_tech: undefined,
    service_template_id: 0,
    service_comment: "",
    org: undefined,
    org_en: undefined,
    postcode: undefined,
    address: undefined,
    address_en: undefined,
    route_v4: undefined,
    route_v6: undefined,
    avg_upstream: 10,
    max_upstream: 100,
    avg_downstream: 10,
    max_downstream: 100,
    max_bandwidth_as: undefined,
    asn: undefined,
    ip: undefined,
    start_date: "",
    end_date: undefined
}

export const DefaultServiceJPNICData: JPNICData = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    DeletedAt: "",
    address: "",
    address_en: "",
    country: "",
    dept: "",
    dept_en: "",
    fax: "",
    jpnic_handle: "",
    mail: "",
    name: "",
    name_en: "",
    org: "",
    org_en: "",
    postcode: "",
    tel: "",
    lock: false
}

export const DefaultServiceAddJPNICData: ServiceAddJPNICData = {
    org: "",
    org_en: "",
    mail: "",
    postcode: "",
    address: "",
    address_en: "",
    name: "",
    name_en: "",
    dept_en: "",
    dept: "",
    country: "",
    tel: "",
    fax: "",
}

export const DefaultServiceAddIPv4PlanData: ServiceAddIPv4PlanData = {
    name: "",
    after: 0,
    half_year: 0,
    one_year: 0,
}

export const DefaultConnectionAddData: ConnectionAddData = {
    address: "",
    connection_template_id: 0,
    connection_comment: "",
    ntt_template_id: 0,
    noc_id: 0,
    term_ip: "",
    monitor: false
}

export const DefaultChatData: ChatData = {
    time: "",
    data: "",
    user_name: "",
    admin: false,
}

export const DefaultChatDataArray: ChatData[] = [DefaultChatData]

export const DefaultTicketData: TicketDetailData = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    solved: false,
    group_id: 0,
    user_id: 0,
    title: "",
    request_reject: false,
    request: false,
    admin: false,
    chat: undefined,
    user: undefined,
    group: undefined,
}

export const DefaultTicketDataArray: TicketDetailData[] = [DefaultTicketData]

export const DefaultNoticeData: NoticeData = {
    CreatedAt: "",
    ID: 0,
    UpdatedAt: "",
    data: "",
    end_time: "",
    everyone: false,
    fault: false,
    group_id: 0,
    important: false,
    info: false,
    noc_id: 0,
    start_time: "",
    title: "",
    user_id: 0
}

export const DefaultNoticeDataArray: NoticeData[] = [DefaultNoticeData]

export const DefaultServiceDetailData: ServiceDetailData = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    group_id: 0,
    asn: 0,
    fee: 0,
    org: "",
    org_en: "",
    postcode: "",
    address: "",
    address_en: "",
    route_v4: "",
    route_v6: "",
    avg_downstream: 0,
    avg_upstream: 0,
    max_downstream: 0,
    max_upstream: 0,
    max_bandwidth_as: 0,
    service_number: 0,
    lock: false,
    pass: false,
    enable: false,
    add_allow: false,
    ip: undefined,
    jpnic_admin: undefined,
    jpnic_tech: undefined,
    service_template: {
        ID: 0,
        name: "",
        comment: "",
        hidden: false,
        type: "",
        need_comment: false,
        need_global_as: false,
        need_jpnic: false,
        need_route: false
    },
    connections: undefined
}

export const DefaultServiceDetailDataArray: ServiceDetailData[] = [DefaultServiceDetailData]

export const DefaultConnectionDetailData: ConnectionDetailData = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    address: "",
    link_v4_our: "",
    link_v4_your: "",
    link_v6_our: "",
    link_v6_your: "",
    term_ip: "",
    open: false,
    enable: false,
    monitor: false,
    noc: undefined,
    noc_id: 0,
    bgp_router_id: 0,
    bgp_router: undefined,
    connection_number: 0,
    tunnel_endpoint_router_ip_id: 0,
    ntt_template_id: 0,
    ntt_template: undefined,
    service: undefined,
    connection_template: {
        CreatedAt: "",
        DeletedAt: "",
        ID: 0,
        UpdatedAt: "",
        name: "",
        type: "",
        comment: "",
        need_comment: false,
        need_cross_connect: false,
        need_internet: false,
        l2: false,
        l3: false
    },
    tunnel_endpoint_router_ip: undefined
}

export const DefaultConnectionDetailDataArray: ConnectionDetailData[] = [DefaultConnectionDetailData]

export const DefaultUserDetailData: UserDetailData = {
    CreatedAt: "",
    ID: 0,
    UpdatedAt: "",
    email: "",
    expired_status: 0,
    group: undefined,
    group_id: 0,
    level: 0,
    mail_token: "",
    mail_verify: true,
    name: "",
    name_en: "",
    notice: undefined,
    pass: "",
    tokens: undefined,
}
export const DefaultUserDetailDataArray: UserDetailData[] = [DefaultUserDetailData]

export const DefaultTokenDetailData: TokenDetailData = {
    CreatedAt: "",
    ID: 0,
    UpdatedAt: "",
    access_token: "",
    admin: false,
    debug: "",
    expired_at: "",
    status: 0,
    tmp_token: "",
    user: undefined,
    user_id: 0,
    user_token: "",
}

export const DefaultTokenDetailDataArray: TokenDetailData[] = [DefaultTokenDetailData];

export const DefaultNoticeRegisterData: NoticeRegisterData = {
    user_id: [],
    group_id: [],
    noc_id: [],
    start_time: "",
    end_time: undefined,
    title: "",
    data: "",
    everyone: false,
    important: false,
    fault: false,
    info: false
}

export const DefaultNOCTemplateData: NocTemplateData = {
    CreatedAt: "",
    DeletedAt: "",
    ID: 0,
    UpdatedAt: "",
    name: "",
    bandwidth: "",
    bgp_router: undefined,
    comment: "",
    enable: false,
    location: ""
}

export const DefaultNOCTemplateDataArray: NocTemplateData[] = [DefaultNOCTemplateData]

export const DefaultAddIP: ServiceAddIPData = {
    version: 0,
    ip: "",
    plan: undefined,
    name: "",
    start_date: "",
    end_date: undefined
}

export const DefaultMemoAddData: MemoAddData = {
    group_id: 0,
    type: 0,
    title: "",
    message: ""
}

export const DefaultTicketAddData: TicketAddData = {
    is_group: true,
    user_id: 0,
    group_id: 0,
    title: "",
    data: ""
}

export const DefaultMailSendData: MailSendData = {
    to_mail: "",
    subject: "",
    content: ""
}