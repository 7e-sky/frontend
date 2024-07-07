import React from 'react';
import { authRoles } from 'app/auth';

export const TeamsAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    auth: authRoles.acheteur,
    routes: [
        {
            path: '/acheteur/team',
            component: React.lazy(() => import('./TeamsApp'))
        },
        {
            path: '/teams',
            component: React.lazy(() => import('./SuiviTeam'))
        }
    ]
};
