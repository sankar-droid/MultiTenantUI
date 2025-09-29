import { Routes } from '@angular/router';
import { TenantList } from './features/tenants/tenant-list/tenant-list';
import { TenantDetail } from './features/tenants/tenant-detail/tenant-detail';
import { UserList } from './features/users/user-list/user-list';
import { UserDetail } from './features/users/user-detail/user-detail';
import { Profile } from './features/users/profile/profile';
import { WorkspaceList } from './features/workspaces/workspace-list/workspace-list';
import { WorkspaceAdmin } from './features/workspace-admin/workspace-admin';
import { WorkspaceDetail } from './features/workspaces/workspace-detail/workspace-detail';

import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';
import { Dashboard } from './features/dashboard/dashboard';
import { FileUpload } from './features/files/file-upload';
import { Messages } from './features/messages/messages';
import { AuditLogs } from './features/audit/audit-logs';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'signup', component: Signup },
    { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },

    { path: 'users', component: UserList, canActivate: [AuthGuard] },
    { path: 'users/:id', component: UserDetail, canActivate: [AuthGuard] },
    { path: 'workspaces', component: WorkspaceAdmin, canActivate: [AuthGuard, RoleGuard], data: { role: 'Admin' } },
    { path: 'workspaces/:id', component: WorkspaceDetail, canActivate: [AuthGuard, RoleGuard], data: { role: 'Admin' } },
    { path: 'files', component: FileUpload, canActivate: [AuthGuard] },
    { path: 'messages', component: Messages, canActivate: [AuthGuard] },
    { path: 'audit', component: AuditLogs, canActivate: [AuthGuard, RoleGuard], data: { role: 'Admin' } },
    { path: 'profile', component: Profile, canActivate: [AuthGuard] },
    { path: 'unauthorized', loadComponent: () => import('./components/unauthorized/unauthorized').then(m => m.Unauthorized) }
];
