
import React from 'react';
import { authRoles } from 'app/auth';

export const childsConfigs = {
    settings: {
        layout: {}
    },
    auth: authRoles.acheteur,
    routes: [
        {
            path: '/childs',
            component: React.lazy(() => import('./childs/Childs'))
        }
    ]
};
