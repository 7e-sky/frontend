import React from 'react';
import {authRoles} from 'app/auth';

export const DashboardAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth    : authRoles.mediateur,
    routes  : [
        {
            path     : '/dashboard_me',
            component: React.lazy(() => import('./DashboardApp'))
        }
    ]
};
