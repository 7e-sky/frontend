import React, { useEffect, useRef, useState } from 'react';
import { FusePageSimple } from '@fuse';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import TeamsList from './TeamsList';
import TeamsHeader from './TeamsHeader';
import TeamsDialog from './TeamsDialog';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { Helmet } from "react-helmet";
import { Dialog, DialogTitle, CircularProgress, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@material-ui/core';
import _ from '@lodash';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';

function TeamsApp(props) {
    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    const user = useSelector(({ auth }) => auth.user);
    const abonnement = useSelector(({ auth }) => auth.user.abonnement);
    const loadingAbonnement = useSelector(({ auth }) => auth.user.loadingAbonnement);
    const [abonnee, setAbonnee] = useState(false);
    const [enable, setEnable] = useState(true);
    const [expired, setExpired] = useState(false);
    const [days, setDays] = useState(0);

    // Effect abonnement
    useEffect(() => {
        if (!abonnement)
            return;
        if (!abonnement.statut) {
            //desactivé par admin
            setEnable(false)
            return;
        }
        let days = moment(abonnement.expired).diff(moment(), 'days');
        setDays(days);

        if (days <= 0) {
            // abonnement expiré
            setExpired(true);
        }

        if (abonnement.statut && days > 0) {
            //abonnement en cours
            setAbonnee(true);
        }
    }, [abonnement]);

    useEffect(() => {
        if (!user.id)
            return
        dispatch(Actions.getTeams(user.id));
    }, [dispatch, user]);

    if (loadingAbonnement) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <CircularProgress color="secondary" /> &ensp;
               Chargement ...
            </div>
        );
    }



    const handleClose = () => {
        props.history.push('/dashboard');
    };


    
   /*  if (!abonnee || (abonnement && !abonnement.offre.hasCommercial)) {
        if (!enable) {
            return (
                <Dialog
                    open={true}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent className="text-center">
                        <Typography variant="h6" className="my-16 text-red">
                            Votre abonnement est désactivé
                                    </Typography>

                        <Typography color="textSecondary" className="mb-16">
                            Pour le réactiviter nous vous prions de nous contacter sur l'adresse mail suivante <strong>administrateur@lesachatsindustriels.com</strong>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Fermer
                        </Button>

                    </DialogActions>
                </Dialog>
            )
        }
        if (expired) {
            return (
                <Dialog
                    open={true}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent className="text-center">
                        <Typography variant="h6" className="my-16 text-red">
                            Votre abonnement a expiré {moment(abonnement.expired).fromNow()}
                        </Typography>

                        <Typography color="textSecondary" className="mb-16">
                            Pour le renouveler, vous pouvez ajouter une commande en cliquant sur le bouton suivant
                                    </Typography>

                        <Button component={Link} to={`/billing/renew`} className="whitespace-no-wrap" color="secondary" variant="contained">
                            <span className="">Renouveler l'abonnement</span>
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Fermer
                    </Button>

                    </DialogActions>
                </Dialog>
            )
        }

        if (abonnement && !abonnement.offre.hasCommercial) {
            return (
                <Dialog
                    open={true}
                    disableBackdropClick={true}
                    disableEscapeKeyDown={true}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogContent className="text-center">
                        <Typography variant="h6" className="my-16">
                            Mise à niveau
                         </Typography>

                        <Typography color="textSecondary" className="mb-16">
                            Ce service n'est pas accessible par votre Pack d'abonnement <strong className="uppercase">{abonnement.offre && abonnement.offre.name}</strong>,
                            nous vous invitons à mettre à niveau votre Pack d'abonnement pour bénéficier de cette fonctionnalité.
                         </Typography>

                        <Button component={Link} to={`/billing/pack`} className="whitespace-no-wrap" color="secondary" variant="contained">
                            <span className="">mise à niveau</span>
                        </Button>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Fermer
                    </Button>

                    </DialogActions>
                </Dialog>
            )
        }
        return (
            <Dialog
                open={true}
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <Typography variant="h4" className="my-16">
                        Reservé à nos abonnés
                        </Typography>

                    <Typography color="textSecondary" className="mb-16">
                    Ce service n'est pas accessible par votre Pack d'abonnement,
                            nous vous invitons à mettre à niveau votre Pack d'abonnement pour bénéficier de cette fonctionnalité.
                        
                                 </Typography>

                    <Button component={Link} to={`/billing/pack`} className="whitespace-no-wrap" color="secondary" variant="contained">
                        <span className="">Commander abonnement</span>
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Fermer
                    </Button>

                </DialogActions>
            </Dialog>

        );
    }
 */
    return (
        <React.Fragment>
            <Helmet>
                <title>Acheteur / Master | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageSimple
                classes={{
                    contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
                    content: "flex flex-col h-full",
                    leftSidebar: "w-256 border-0",
                    header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
                }}
                header={
                    <TeamsHeader pageLayout={pageLayout} />
                }
                content={
                    <TeamsList />
                }
                sidebarInner
                ref={pageLayout}
                innerScroll
            />

            <TeamsDialog />
        </React.Fragment>
    )
}

export default withReducer('teamsApp', reducer)(TeamsApp);
