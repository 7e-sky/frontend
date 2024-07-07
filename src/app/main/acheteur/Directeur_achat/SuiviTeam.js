import React, { useRef, useState, useEffect } from 'react';
import { Tab, Tabs, Typography, Dialog, DialogContent, Button, DialogActions, CircularProgress } from '@material-ui/core';
import { FusePageSimple } from '@fuse';
//import Widget7 from '../dashboard/widgets/Widget7';
//import Widget8 from '../dashboard/widgets/Widget8';
//import Widget6 from '../dashboard/widgets/Widget6';
import Widget12 from '../dashboard/widgets/Widget12';
import Widget1 from '../dashboard/widgets/Widget1';
import Widget2 from '../dashboard/widgets/Widget2';
import Widget3 from '../dashboard/widgets/Widget3';
import Widget4 from '../dashboard/widgets/Widget4';

import { makeStyles } from '@material-ui/styles';
import { Helmet } from "react-helmet";
import withReducer from 'app/store/withReducer';
import reducer from '../dashboard/store/reducers';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
    content: {
        '& canvas': {
            maxHeight: '100%'
        }
    },
    selectedProject: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '8px 0 0 0'
    },
    projectMenuButton: {
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderRadius: '0 8px 0 0',
        marginLeft: 1
    },
}));

function SuiviTeam(props) {
    const classes = useStyles(props);
    const pageLayout = useRef(null);
    const [tabValue, setTabValue] = useState(0);

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

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

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
    /* if (!abonnee || (abonnement && !abonnement.offre.hasCommercial)) {
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
    } */

    return (
        <>
            <Helmet>
                <title>Suivi des ventes de vos Acheteurs / Masters | Les Achats Industriels</title>
                <meta name="robots" content="noindex, nofollow" />
                <meta name="googlebot" content="noindex" />
            </Helmet>
            <FusePageSimple
                classes={{
                    header: "min-h-160 h-160",
                    toolbar: "min-h-48 h-48",
                    rightSidebar: "w-288",
                    content: classes.content,
                }}
                header={
                    <div className="flex flex-col justify-between flex-1 px-24 pt-24">
                        <div className="flex justify-between">
                            <Typography className="py-0 sm:py-24" variant="h4">Suivi des ventes de vos Acheteurs / Masters</Typography>

                        </div>
                    </div>
                }
                contentToolbar={
                    <Tabs
                        value={tabValue}
                        onChange={handleChangeTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="off"
                        className="w-full border-b-1 px-24"
                    >
                        <Tab className="text-14 font-600 normal-case" label="Acheteur / Master" />
                        {/* <Tab className="text-14 font-600 normal-case" label="Résumé du budget" /> */}
                    </Tabs>
                }
                content={
                    <div className="p-12">
                        {tabValue === 0 && (

                            <Widget12 />
                        )}
                        {tabValue === 1 && (

                            <div className="flex flex-wrap">
                                <div className="widget w-full sm:w-1/3 p-16">
                                   
                                </div>
                                <div className="widget w-full sm:w-2/3 p-16">
                                  
                                </div>
                            </div>

                        )}

                    </div>
                }
                ref={pageLayout}
            />
        </>
    );
}

export default withReducer('dashboardApp', reducer)(SuiviTeam);

