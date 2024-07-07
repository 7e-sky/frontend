import React, { useEffect } from 'react';
import { Typography } from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from './store/actions'
import reducer from './store/reducers';
import Widget1 from './widgets/Widget1';
import Widget2 from './widgets/Widget2';
import Widget3 from './widgets/Widget3';
import Widget4 from './widgets/Widget4';
import Widget5 from './widgets/Widget5';
import Widget6 from './widgets/Widget6';
import ContentLoader from 'react-content-loader';
import { Helmet } from "react-helmet";



function DashboardApp(props) {
    const dispatch = useDispatch();
    const widgets = useSelector(({ dashboardApp }) => dashboardApp.widgets);




    useEffect(() => {
        dispatch(Actions.getWidgets());
    }, [dispatch]);

    /*
    if ( !widgets || !projects )
    {
        return null;
    }
*/
    return (
        <div className="w-full">
            <Helmet>
                <title>Dashboard | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <Widget5 />
            {
                widgets.loading === false ?
                    <FuseAnimate animation="transition.slideUpIn" delay={200}>

                        <div className="flex flex-col md:flex-row sm:p-8 container">

                            <div className="flex flex-1 flex-col min-w-0">

                                <FuseAnimate delay={600}>
                                    <Typography className="p-16 pb-8 text-18 font-300">
                                        Le suivi de vos demandes
                                </Typography>
                                </FuseAnimate>


                                <div className="flex flex-col sm:flex sm:flex-row ">

                                    <div className="widget flex w-full sm:w-1/4 p-16">
                                        <Widget3 widget={widgets.data.widget3} />
                                    </div>
                                    <div className="widget flex w-full sm:w-1/4 p-16">
                                        <Widget1 widget={widgets.data.widget1} />
                                    </div>
                                    <div className="widget flex w-full sm:w-1/4 p-16">
                                        <Widget2 widget={widgets.data.widget2} />
                                    </div>
                                    <div className="widget w-full sm:w-1/4 p-16">
                                        <Widget4 widget={widgets.data.widget4} />
                                    </div>
                                </div>





                            </div>
                        </div>
                    </FuseAnimate>
                    :
                    <ContentLoader
                        height={100}
                        width={650}
                        speed={2}
                        primaryColor="#d9d9d9"
                        secondaryColor="#ecebeb"
                    >
                        <circle cx="90" cy="50" r="30" />
                        <rect x="20" y="90" rx="0" ry="0" width="140" height="25" />
                        <circle cx="250" cy="50" r="30" />
                        <rect x="180" y="90" rx="0" ry="0" width="140" height="25" />
                        <circle cx="400" cy="50" r="30" />
                        <rect x="340" y="90" rx="0" ry="0" width="140" height="25" />
                        <circle cx="570" cy="50" r="30" />
                        <rect x="500" y="90" rx="0" ry="0" width="140" height="25" />
                    </ContentLoader>
            }
            <div className="flex flex-col md:flex-row sm:p-8 container">
                <div className="flex flex-1 flex-col min-w-0">
                    <div className="widget w-full sm:w-1/2 p-16">
                        <Widget6 />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withReducer('dashboardApp', reducer)(DashboardApp);
