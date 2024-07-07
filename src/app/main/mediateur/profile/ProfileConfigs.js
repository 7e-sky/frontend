
import React from 'react';
import {authRoles} from 'app/auth';

export const ProfileConfigs = {
    settings: {
        layout: {}
    },
    auth    : authRoles.acheteur,
    routes  : [
        {
            path     : '/ac/profile',
            component: React.lazy(() => import('./Profile'))
        },
       
    ]
};
