import React from 'react';
import { Redirect } from 'react-router-dom';
import { FuseUtils } from '@fuse';
import { ExampleConfig } from 'app/main/example/ExampleConfig';
import _ from '@lodash';
import { authRoles } from 'app/auth';
import { LoginConfig } from '../main/login/LoginConfig';
import { pagesConfigs } from 'app/main/pages/pagesConfigs';
import { administrateurConfigs } from '../main/administration/administrateurConfigs';
import { RegisterPageConfig } from '../main/inscription/RegisterPageConfig';
import { acheteurConfigs } from '../main/acheteur/acheteurConfigs';
import { mediateurConfigs } from '../main/mediateur/mediateurConfigs';
import { fournisseurConfigs } from '../main/fournisseur/fournisseurConfigs';
import { PortailConfig } from '../main/portail/PortailConfig';
import { DashboardConfigs } from '../main/dashboard/DashboardConfigs';

//import AcheteursPage from '../main/acheteur/AcheteursPage';
function setAdminAuth(configs) {
    return configs.map(config => _.merge({}, config, { auth: authRoles.admin }))
}
const routeConfigs = [
    ...setAdminAuth([
        ...administrateurConfigs,
    ]),
    ...acheteurConfigs,
    ...mediateurConfigs,
    ...fournisseurConfigs,
    ...pagesConfigs,
    ...RegisterPageConfig,
    ...PortailConfig,
    ExampleConfig,
    LoginConfig,
    DashboardConfigs
];

const routes = [
    ...FuseUtils.generateRoutesFromConfigs(routeConfigs),
    /*{
        path     : '/',
        exact    : true,
        component: () => <Redirect to="/login"/>
    },*/
    {
        component: () => <Redirect to="/pages/errors/error-404" />
    }
];

export default routes;
