import {LucideIconInput, LucideFolder, LucideMail, LucideSettings } from '@lucide/angular';


export interface NavItem {
    label: string;
    route: string;
    icon: LucideIconInput;
    badgeKey?: 'invitations';
}



export const NAV_ITEMS: NavItem[] = [
  { label: 'Workspaces',  route: '/workspaces',  icon: LucideFolder },
  { label: 'Invitations', route: '/invitations', icon: LucideMail, badgeKey: 'invitations' },
  { label: 'Settings',    route: '/settings',    icon: LucideSettings },
];