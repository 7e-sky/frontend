import React from 'react';
import { useSelector } from 'react-redux';
import DashboardApp from '../fournisseur/dashboard/DashboardApp';
import DashboardAppAcheteur from '../acheteur/dashboard/DashboardApp';
import { Typography } from '@material-ui/core';
import DashboardAdmin from '../administration/dashboard/DashboardAdmin';
import DashboardAppMediateur from '../mediateur/dashboard/DashboardApp';

function Dashboard(props) {

    const user = useSelector(({ auth }) => auth.user);


    if (user.role === 'ROLE_FOURNISSEUR') {
        return (
            <DashboardApp />
        )
    }

    if (user.role === 'ROLE_ACHETEUR') {
        return (
            <DashboardAppAcheteur />
        )
    }

    if (user.role === 'ROLE_ADMIN') {
        return (    
            <DashboardAdmin />
        )
    }

    if (user.role === 'ROLE_Mediateur') {
        return (    
            <DashboardAppMediateur />
        )
    }

    return (
        'jjj'
    )

}

export default Dashboard;
