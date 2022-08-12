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
    service_type: string,
    service_number: number,
    pass: boolean,
    enable: boolean,
    lock: boolean,
    add_allow: boolean,
    ip?: IPData[],
    jpnic_admin?: JPNICData,
    jpnic_tech?: JPNICData[],
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
    is_group: boolean,
    hidden: boolean,
    address: string,
    address_en: string,
    country: string,
    dept: string,
    dept_en: string,
    title: string,
    title_en: string,
    fax: string,
    v4_jpnic_handle: string,
    v6_jpnic_handle: string,
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
    preferred_ap: string,
    bgp_router_id: number,
    bgp_router?: BGPRouterDetailData,
    group?: GroupDetailData,
    service?: ServiceDetailData,
    connection_type: string,
    connection_number: number,
    tunnel_endpoint_router_ip_id: number,
    ntt: string,
    ipv4_route: string,
    ipv6_route: string,
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

export interface MailTemplateData {
    id: string
    subject: string
    message: string
}

export interface MemberTypeTemplateData {
    id: string
    name: string
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
    name: string,
    type: string
    comment: string
    need_comment: boolean
    need_cross_connect: boolean
    need_internet: boolean
    is_l2: boolean
    is_l3: boolean
}

export interface GroupDetailData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    memos?: MemoData[],
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
    coupon_id: string,
    member_type: number,
    member_expired: string,
    users?: UserDetailData[],
    tickets?: TicketDetailData[],
    services?: ServiceDetailData[]
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

export interface TemplateData {
    bgp_router?: BGPRouterDetailData[]
    connections?: ConnectionTemplateData[]
    services?: ServiceTemplateData[]
    ipv4?: string[]
    ipv6?: string[]
    nocs?: NocTemplateData[]
    ntts?: string[]
    tunnel_endpoint_router?: TunnelEndPointRouterTemplateData[]
    tunnel_endpoint_router_ip?: TunnelEndPointRouterIPTemplateData[]
    ipv4_route?: string[]
    ipv6_route?: string[]
    preferred_ap?: string[]
    user?: UserDetailData[]
    group?: GroupDetailData[]
    mail_template?: MailTemplateData[]
    member_type?: MemberTypeTemplateData[]
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
    service_type: string,
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
    is_group: boolean,
    hidden: boolean,
    org: string,
    org_en: string,
    mail: string,
    postcode: string,
    address: string,
    address_en: string,
    name: string,
    name_en: string,
    dept: string,
    dept_en: string,
    title: string,
    title_en: string,
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
    connection_type: string,
    connection_comment: string,
    ipv4_route?: string,
    ipv6_route?: string,
    ntt: string,
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

export interface JPNICRegistrationData {
    network: JPNICRegistrationNetworkData,
    admin_user: JPNICRegistrationUserData,
    tech_users: JPNICRegistrationUserData[],
    etc: JPNICRegistrationEtcData
}

export interface JPNICReturnData {
    version: number,
    address: string[],
    network_name: string,
    return_date: string,
    notify_e_mail: string
}

export interface JPNICSearchData {
    version: number,
    org: string
}

export interface JPNICRegistrationNetworkData {
    kind_id: string;
    ip_address: string;
    network_name: string;
    infra_user_kind: string;
    org_jp_1: string;
    org_jp_2: string;
    org_jp_3: string;
    org_1: string;
    org_2: string;
    org_3: string;
    zip_code: string;
    addr_jp_1: string;
    addr_jp_2: string;
    addr_jp_3: string;
    addr_1: string;
    addr_2: string;
    addr_3: string;
    abuse: string;
    ryakusho: string;
    name_server: string;
    notify_email: string;
    plan: string;
    deli_no: string;
    return_date: string;
}

export interface JPNICRegistrationUserData {
    jpnic_handle: string;
    name_jp: string;
    name: string;
    email: string;
    org_jp_1: string;
    org_jp_2: string;
    org_jp_3: string;
    org_1: string;
    org_2: string;
    org_3: string;
    zip_code: string;
    addr_jp_1: string;
    addr_jp_2: string;
    addr_jp_3: string;
    addr_1: string;
    addr_2: string;
    addr_3: string;
    division_jp: string;
    division: string;
    phone: string;
    fax: string;
    notify_mail: string;
}

export interface JPNICRegistrationEtcData {
    cert_id: string;
    password: string;
}

export interface JPNICGetData {
    ip_address: string;
    detail_link: string;
    size: string;
    network_name: string;
    assign_date: string;
    return_date: string;
    org_name: string;
    ryakusho: string;
    recep_no: string;
    deli_no: string;
    type: string;
    kind_id: string;
}

export interface JPNICGetDetailData {
    ip_address: string;
    ryakusho: string;
    type: string;
    infra_user_kind: string;
    network_name: string;
    org: string;
    org_en: string;
    post_code: string;
    address: string;
    address_en: string;
    admin_jpnic_handle: string;
    admin_jpnic_handle_link: string;
    tech_jpnic_handle: string;
    tech_jpnic_handle_link: string;
    name_server: string;
    ds_record: string;
    notify_address: string;
    deli_no: string;
    recep_no: string;
    assign_date: string;
    return_date: string;
    update_date: string;
}

export interface JPNICGetHandleData {
    is_jpnic_handle: boolean;
    jpnic_handle: string;
    name: string;
    name_en: string;
    email: string;
    org: string;
    org_en: string;
    division: string;
    division_en: string;
    title: string;
    title_en: string;
    tel: string;
    fax: string;
    notify_address: string;
    update_date: string;
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
    member_type: undefined,
}

export const DefaultGroupDetailData: GroupDetailData = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
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
    coupon_id: "",
    member_expired: "",
    member_type: 1,
    users: undefined,
    tickets: undefined,
    services: undefined,
};

export const DefaultGroupDetailDataArray: GroupDetailData[] = [DefaultGroupDetailData]

export const DefaultServiceJPNICData: JPNICData = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    DeletedAt: "",
    is_group: false,
    hidden: false,
    address: "",
    address_en: "",
    country: "",
    dept: "",
    dept_en: "",
    title: "",
    title_en: "",
    fax: "",
    v4_jpnic_handle: "",
    v6_jpnic_handle: "",
    mail: "",
    name: "",
    name_en: "",
    org: "",
    org_en: "",
    postcode: "",
    tel: "",
    lock: false
}


export const DefaultServiceAddIPv4PlanData: ServiceAddIPv4PlanData = {
    name: "",
    after: 0,
    half_year: 0,
    one_year: 0,
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
    service_type: "",
    service_number: 0,
    lock: false,
    pass: false,
    enable: false,
    add_allow: false,
    ip: undefined,
    jpnic_admin: undefined,
    jpnic_tech: undefined,
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
    preferred_ap: "",
    bgp_router_id: 0,
    bgp_router: undefined,
    connection_type: "",
    connection_number: 0,
    tunnel_endpoint_router_ip_id: 0,
    ntt: "",
    ipv4_route: "",
    ipv6_route: "",
    service: undefined,
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

export const DefaultJPNICRegistrationData: JPNICRegistrationData = {
    network: {
        kind_id: "10",
        ip_address: "",
        network_name: "",
        infra_user_kind: "2",
        org_jp_1: "",
        org_jp_2: "",
        org_jp_3: "",
        org_1: "",
        org_2: "",
        org_3: "",
        zip_code: "",
        addr_jp_1: "",
        addr_jp_2: "",
        addr_jp_3: "",
        addr_1: "",
        addr_2: "",
        addr_3: "",
        abuse: "",
        ryakusho: "",
        name_server: "",
        notify_email: "",
        plan: "",
        deli_no: "",
        return_date: "",
    },
    admin_user: {
        jpnic_handle: "",
        name_jp: "",
        name: "",
        email: "",
        org_jp_1: "",
        org_jp_2: "",
        org_jp_3: "",
        org_1: "",
        org_2: "",
        org_3: "",
        zip_code: "",
        addr_jp_1: "",
        addr_jp_2: "",
        addr_jp_3: "",
        addr_1: "",
        addr_2: "",
        addr_3: "",
        division_jp: "",
        division: "",
        phone: "",
        fax: "",
        notify_mail: "",
    },
    tech_users: [{
        jpnic_handle: "",
        name_jp: "",
        name: "",
        email: "",
        org_jp_1: "",
        org_jp_2: "",
        org_jp_3: "",
        org_1: "",
        org_2: "",
        org_3: "",
        zip_code: "",
        addr_jp_1: "",
        addr_jp_2: "",
        addr_jp_3: "",
        addr_1: "",
        addr_2: "",
        addr_3: "",
        division_jp: "",
        division: "",
        phone: "",
        fax: "",
        notify_mail: "",
    }, {
        jpnic_handle: "",
        name_jp: "",
        name: "",
        email: "",
        org_jp_1: "",
        org_jp_2: "",
        org_jp_3: "",
        org_1: "",
        org_2: "",
        org_3: "",
        zip_code: "",
        addr_jp_1: "",
        addr_jp_2: "",
        addr_jp_3: "",
        addr_1: "",
        addr_2: "",
        addr_3: "",
        division_jp: "",
        division: "",
        phone: "",
        fax: "",
        notify_mail: "",
    }],
    etc: {
        cert_id: "",
        password: "",
    }
}

export const DefaultJPNICUserRegistrationData: JPNICRegistrationUserData = {
    jpnic_handle: "",
    name_jp: "",
    name: "",
    email: "",
    org_jp_1: "",
    org_jp_2: "",
    org_jp_3: "",
    org_1: "",
    org_2: "",
    org_3: "",
    zip_code: "",
    addr_jp_1: "",
    addr_jp_2: "",
    addr_jp_3: "",
    addr_1: "",
    addr_2: "",
    addr_3: "",
    division_jp: "",
    division: "",
    phone: "",
    fax: "",
    notify_mail: "",
}

export const DefaultJPNICReturnData: JPNICReturnData = {
    version: 0,
    address: [],
    network_name: "",
    return_date: "",
    notify_e_mail: ""
}
