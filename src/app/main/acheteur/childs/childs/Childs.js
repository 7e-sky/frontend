import React, { useEffect } from 'react';
import { FusePageCarded } from '@fuse';
import withReducer from 'app/store/withReducer';
import ChildTable from './ChildTable';
import ChildHeader from './ChildHeader';
import reducer from '../store/reducers';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from '../store/actions';
import { Helmet } from "react-helmet";

function Childs() {

    const dispatch = useDispatch();
    const user = useSelector(({ auth }) => auth.user);

    useEffect(() => {
        if (!user)
            return;
        dispatch(Actions.getChilds(user.id));

    }, [dispatch, user]);

    return (
        <>
            <Helmet>
                <title>Tentatives d'inscriptions | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>

            <FusePageCarded
                classes={{
                    content: "flex",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    <ChildHeader />
                }
                content={
                    <ChildTable />
                }
                innerScroll
            />
        </>
    );
}

export default withReducer('childsFrsApp', reducer)(Childs);
