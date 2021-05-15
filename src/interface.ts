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

export interface UserDetailData {
    ID: number,
    name: string,
    email: string,
}

export interface TicketDetailData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    solved: boolean,
    title: string,
    chat?: ChatData[],
    user?: UserDetailData,
    group?: GroupDetailData,
}

export interface ServiceDetailData {
    ID: number,
    CreatedAt: string,
    UpdatedAt: string,
    group_id: number,
    open: boolean,
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
    bgp_router: BGPRouterDetailData
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
    status: number,
    pass: boolean,
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
    users: UserDetailData[],
    tickets?: TicketDetailData[],
    services?: ServiceDetailData[]
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

export const DefaultTemplateData: TemplateData = {
    bgp_router: undefined,
    connections: undefined,
    services: undefined,
    ipv4: undefined,
    ipv6: undefined,
    nocs: undefined,
    ntts: undefined,
    tunnel_endpoint_router: undefined,
    tunnel_endpoint_router_ip: undefined
}

export const DefaultGroupDetailData: GroupDetailData = {
    ID: 0,
    CreatedAt: "",
    UpdatedAt: "",
    org: "",
    org_en: "",
    status: 0,
    pass: false,
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
    lock: false,
    users: [{
        ID: 0,
        name: "",
        email: "",
    }],
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
    title: "",
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
    open: false,
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
