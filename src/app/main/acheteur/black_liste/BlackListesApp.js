import React, { useEffect, useRef } from 'react';
import { FusePageCarded } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import BlackListesList from './BlackListesList';
import BlackListesHeader from './BlackListesHeader';
import BlackListesDialog from './BlackListesDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { Helmet } from "react-helmet";
import { Grow, Card, CardContent, Typography } from '@material-ui/core';


function BlackListesApp(props) {
    const dispatch = useDispatch();
    const user = useSelector(({ auth }) => auth.user);

    const pageLayout = useRef(null);

    useEffect(() => {

        if (user)
            dispatch(Actions.getBlackListes(user.id));
    }, [dispatch, user]);

   /*  return (
        <div className="flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32">

            <div className="flex flex-col items-center justify-center w-full">

                <Grow in={true}>
                    <Card className="w-full max-w-384">

                        <CardContent className="flex flex-col items-center justify-center text-center p-48">

                            <Typography variant="h4" className="mb-16 text-red">
                                Reservé à nos abonnés
                            </Typography>

                            <Typography color="textSecondary" className="mb-40">
                                Pour activer cette option, nous vous prions de nous contacter sur l'adresse mail suivante <strong>administrateur@lesachatsindustriesl.com</strong>
                            </Typography>
                        </CardContent>
                    </Card>
                </Grow>
            </div>
        </div>
    )  */
    return (
        <React.Fragment>
            <Helmet>
                <title>Black listes | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageCarded
                classes={{
                    content: "flex flex-col h-full",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    <BlackListesHeader pageLayout={pageLayout} />
                }
                content={
                    <BlackListesList />
                }
                innerScroll
            />

            <BlackListesDialog />
        </React.Fragment>
    )
}

export default withReducer('blackListesApp', reducer)(BlackListesApp);
