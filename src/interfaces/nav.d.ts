export declare interface NavLink{
    name: string;
    url: string;
    avatar: string;
    description: string;
    color: string;
    id: string;
    latency?: number;
}
export declare interface NavLinkGroup{
    name: string;
    description: string;
    order?: number;
    links: NavLink[];
}