import React, { useEffect, useState } from 'react';
import { Button, Icon, Typography, LinearProgress, Grid, FormControlLabel, CircularProgress, Dialog, DialogTitle, DialogContent,  DialogActions, Divider, Radio, Table, TableHead, TableRow, TableCell, TableBody, Tab, Tabs, InputAdornment, Checkbox } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, SelectReactFormsyS_S,  TextFieldFormsy } from '@fuse';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import Formsy from 'formsy-react';
import { useForm } from '@fuse/hooks';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import ContentLoader from 'react-content-loader'

const useStyles = makeStyles(theme => ({

    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },

    commandeImageFeaturedStar: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: red[400],
        opacity: 0
    },
    button: {
        margin: theme.spacing(1),
    },
    commandeImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },

    commandeImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& $commandeImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& $commandeImageFeaturedStar': {
                opacity: 1
            },
            '&:hover $commandeImageFeaturedStar': {
                opacity: 1
            }
        }
    },

    error: {
        backgroundColor: theme.palette.error.dark,
    },

    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    margin: {
        margin: theme.spacing(1),
    },

    chip: {
        marginLeft: theme.spacing(1),
        background: '#ef5350',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'

    },
    chip2: {
        marginLeft: theme.spacing(1),
        background: '#4caf50',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'
    },
    chip3: {
        margin: theme.spacing(1),
        background: 'green',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px'

    },
}));


function Commande(props) {

    const dispatch = useDispatch();
    const commande = useSelector(({ commandeOffreAdminApp }) => commandeOffreAdminApp.commande);
    const [sousSecteurs, setSousSecteurs] = useState([]);
    const [offre, setOffre] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [duree, setDuree] = useState(null);
    const [mode, setMode] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const { form, setForm } = useForm(null);
    const [paiement, setPaiement] = useState(false);
    const [open, setOpen] = useState(false);
    const classes = useStyles(props);
    const [prixht, setPrixht] = useState(0);
    const [tva, setTva] = useState(0);
    const [remise, setRemise] = useState(0);
    const [prixhtNet, setPrixhtNet] = useState(0);
    const [prixTTC, setPrixTTC] = useState(0);


    useEffect(() => {
        dispatch(Actions.getOffres());
        dispatch(Actions.getSousSecteurs());
        dispatch(Actions.getPaiements());
        dispatch(Actions.getDurees());
    }, [dispatch]);

    // Effect redirection and clean state
    useEffect(() => {
        if (commande.success) {

            dispatch(Actions.cleanUp())
            props.history.push('/admin/offres/commande');
        }
    }, [commande.success, dispatch,props.history]);


    useEffect(() => {
        function updateCommandeState() {
            const params = props.match.params;
            const { commandeId } = params;
            dispatch(Actions.getCommande(commandeId));

        }

        updateCommandeState();
        return () => {
            dispatch(Actions.cleanUp())
        }
    }, [dispatch, props.match.params]);

    useEffect(() => {
        if (
            (commande.data && !form) ||
            (commande.data && form && commande.data.id !== form.id)
        ) {
            setForm({ ...commande.data });

            if (commande.data.sousSecteurs) {
                setSousSecteurs(commande.data.sousSecteurs.map(item => ({
                    value: item['@id'],
                    label: item.name
                })));
            }
            if (commande.data.offre) {

                setOffre(commande.data.offre)

            }
            if (commande.data.mode)
                setMode(commande.data.mode['@id'])
            if (commande.data.duree) {
                setDuree(commande.data.duree)

                if (commande.data.offre) {
                    if (commande.data.fournisseur.currency.name === 'DHS') {
                        let ht = commande.data.offre.prixMad * commande.data.duree.name;
                        setPrixht(ht)

                        if (commande.data.duree.remise) {
                            let remis = ht * commande.data.duree.remise / 100;
                            let netHt = ht - remis;
                            let tva = netHt * 0.2;
                            setRemise(remis)
                            setPrixhtNet(netHt)
                            setTva(tva)
                            setPrixTTC(netHt + tva)

                        } else {
                            let tva = ht * 0.2;
                            setTva(tva)
                            setPrixTTC(ht + tva)
                        }

                    }
                    else {
                        let ht = commande.data.offre.prixEur * commande.data.duree.name;
                        setPrixht(ht)

                        if (commande.data.duree.remise) {
                            let remis = ht * commande.data.duree.remise / 100;
                            let netHt = ht - remis;
                            let tva = netHt * 0.2;

                            setRemise(remis)
                            setPrixhtNet(netHt)
                            setTva(tva)
                            setPrixTTC(netHt + tva)

                        } else {
                            let tva = ht * 0.2;
                            setTva(tva)
                            setPrixTTC(ht + tva)
                        }

                    }

                }
            }
        }
    }, [form, commande.data, setForm]);

    useEffect(() => {
        if (
            (commande.offres && !offre)
        ) {
            setOffre(commande.offres[0]);

        }
    }, [offre, commande.offres, setOffre]);

    useEffect(() => {
        if (
            (commande.paiements && !mode)
        ) {
            setMode(commande.paiements[0]['@id']);

        }
    }, [mode, commande.paiements, setMode]);

    useEffect(() => {
        if (
            (commande.durees && !duree)
        ) {
            setDuree(commande.durees[0]);

        }
    }, [duree, commande.durees, setDuree]);



    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function handleCheckBoxChange(e) {
        setPaiement(e.target.checked)
    }

    function handleChangeDuree(item) {
        setDuree(item);
        if (commande.data.fournisseur.currency.name === 'DHS') {
            let ht = offre.prixMad * item.name;
            setPrixht(ht)

            if (item.remise) {
                let remis = ht * item.remise / 100;
                let netHt = ht - remis;
                if(discount && discount>0){
                    netHt = (ht - remis)-discount;
                }
                let tva = netHt * 0.2;
                setRemise(remis)
                setPrixhtNet(netHt)
                setTva(tva)
                setPrixTTC(netHt + tva)

            } else {
                let netHt = ht;
                if(discount && discount>0){
                    netHt = ht-discount;
                }
                let tva = netHt * 0.2;
                setTva(tva)
                setPrixhtNet(netHt)
                setPrixTTC(netHt + tva)
            }

        }
        else {
            let ht = offre.prixEur * item.name;
            setPrixht(ht)

            if (item.remise) {
                let remis = ht * item.remise / 100;
                let netHt = ht - remis;
                if(discount && discount>0){
                    netHt = (ht - remis)-discount;
                }
                let tva = netHt * 0.2;

                setRemise(remis)
                setPrixhtNet(netHt)
                setTva(tva)
                setPrixTTC(netHt + tva)

            } else {
                let netHt = ht;
                if(discount && discount>0){
                    netHt = ht-discount;
                }
                let tva = netHt * 0.2;
                setTva(tva)
                setPrixhtNet(netHt)
                setPrixTTC(netHt + tva)
            }

        }
    }
    function handleChangeDiscount(value) { 
        setDiscount(value);
        
        if (commande.data.fournisseur.currency.name === 'DHS') {
            let ht = offre.prixMad * duree.name;
            setPrixht(ht)

            if (duree.remise) {
                let remis = ht * duree.remise / 100;
                let netHt = ht - remis;
                if(value && value>0){
                    netHt = (ht - remis)-value;
                }
                
                let tva = netHt * 0.2;
                setRemise(remis)
                setPrixhtNet(netHt)
                setTva(tva)
                setPrixTTC(netHt + tva)

            } else {
                let netHt = ht;
                if(value && value>0){
                    netHt = ht-value;
                }
                let tva = netHt * 0.2;
                setTva(tva)
                setPrixhtNet(netHt)
                setPrixTTC(netHt + tva)
            }

        }
        else {
            let ht = offre.prixEur * duree.name;
            setPrixht(ht)

            if (duree.remise) {
                let remis = ht * duree.remise / 100;
                let netHt = ht - remis;
                if(value && value>0){
                    netHt = (ht - remis)-value;
                }
                
                let tva = netHt * 0.2;

                setRemise(remis)
                setPrixhtNet(netHt)
                setTva(tva)
                setPrixTTC(netHt + tva)

            } else {

                let netHt = ht;
                if(value && value>0){
                    netHt = ht-value;
                }

                let tva = netHt * 0.2;
                setPrixhtNet(netHt)
                setTva(tva)
                setPrixTTC(netHt + tva)
            }

        }
    }
    function handleChangeOffre(item) {
        setOffre(item);
        if (sousSecteurs.length > 0) {
            setSousSecteurs(_.slice(sousSecteurs, 0, item.nbActivite));
        }
        if (commande.data.fournisseur.currency.name === 'DHS') {
            let ht = item.prixMad * duree.name;
            setPrixht(ht)

            if (duree.remise) {
                let remis = ht * duree.remise / 100;
                let netHt = ht - remis;
                if(discount && discount>0){
                    netHt = (ht - remis)-discount;
                }
                let tva = netHt * 0.2;
                setRemise(remis)
                setPrixhtNet(netHt)
                setTva(tva)
                setPrixTTC(netHt + tva)

            } else {
                let netHt = ht;
                if(discount && discount>0){
                    netHt = ht-discount;
                }
                let tva = netHt * 0.2;
                setTva(tva)
                setPrixhtNet(netHt)
                setPrixTTC(netHt + tva)
            }

        }
        else {
            let ht = item.prixEur * duree.name;
            setPrixht(ht)

            if (duree.remise) {
                let remis = ht * duree.remise / 100;
                let netHt = ht - remis;
                if(discount && discount>0){
                    netHt = (ht - remis)-discount;
                }
                let tva = netHt * 0.2;

                setRemise(remis)
                setPrixhtNet(netHt)
                setTva(tva)
                setPrixTTC(netHt + tva)

            } else {
                let netHt = ht;
                if(discount && discount>0){
                    netHt = ht-discount;
                }
                let tva = netHt * 0.2;
                setTva(tva)
                setPrixhtNet(netHt)
                setPrixTTC(netHt + tva)
            }

        }
    }

    function handleChipChange(value, name) {


        if (value.length > offre.nbActivite) {
            return;
        }
        if (!_.some(value, 'value')) {
            setSousSecteurs('');
        }
        else {

            setSousSecteurs(value);
        }
    }

    function handleClickOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleSubmit(form) {
        //event.preventDefault();

        dispatch(Actions.updateCommande(form, sousSecteurs, offre, mode, duree, discount, paiement));

    }



    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                !commande.loading
                    ?

                    form && (
                        <div className="flex flex-1 w-full items-center justify-between">

                            <div className="flex flex-col items-start max-w-full">

                                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/admin/offres/commande" color="inherit">
                                        <Icon className="mr-4 text-20">arrow_back</Icon>
                                        Retour
                                </Typography>
                                </FuseAnimate>

                                <div className="flex items-center max-w-full">

                                    <div className="flex flex-col min-w-0">
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <div className="text-16 sm:text-20 truncate">
                                                {commande.data.reference ? commande.data.reference + ', Fournisseur : ' + commande.data.fournisseur.societe : ''}
                                            </div>
                                        </FuseAnimate>

                                    </div>


                                </div>
                            </div>
                            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">Confirmation </DialogTitle>
                                <DialogContent className="mb-12">
                                    {!paiement ? 'Voullez-vous vraiment valider la commande sans confirmation du paiment?' : 'Vous êtes sur le point d\'affecter une nouvelle abonnement'}
                                </DialogContent>
                                <Divider />
                                <DialogActions>
                                    <Button
                                        onClick={handleClose}
                                        variant="outlined"
                                        color="secondary"
                                    >
                                        Annnuler
                                    </Button>
                                    <Button onClick={() => handleSubmit(form, sousSecteurs)}
                                        variant="contained" color="secondary" disabled={commande.loading}
                                    >
                                        Sauvegarder
                                        {commande.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <div className="flex items-end max-w-full">
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paiement}
                                            onChange={(e) => handleCheckBoxChange(e)}
                                            value={paiement}
                                        />
                                    }
                                    label="Confirmer le paiement de cette entreprise"
                                />

                                <FuseAnimate animation="transition.slideRightIn" delay={300}>


                                    <Button
                                        className="whitespace-no-wrap"
                                        variant="contained"
                                        disabled={commande.loading || sousSecteurs.length === 0}
                                        onClick={handleClickOpen}

                                    >
                                        Valider la commande
                                    {commande.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                    </Button>
                                </FuseAnimate>
                            </div>
                        </div>
                    )
                    :
                    ''
            }
            contentToolbar={
                commande.loading || !form ?

                    (<div className={classes.root}>
                        <LinearProgress color="secondary" />
                    </div>)
                    :
                    <Tabs
                        value={tabValue}
                        onChange={handleChangeTab}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        classes={{ root: "w-full h-64" }}
                    >
                        <Tab className="h-64 normal-case" label="Détail de la commande" />
                        <Tab className="h-64 normal-case" label="Info. de la société" />


                    </Tabs>

            }
            content={
                !commande.loading ?

                    form && (
                        <div className="p-10  sm:p-24 max-w-2xl">
                            {tabValue === 0 && (
                                <Formsy
                                    className="flex flex-col "
                                >
                                    <Grid container spacing={3} className="">
                                        <Grid item xs={12} sm={6}>
                                            <Typography className="mb-16" variant="h6">1- Offres & Activités</Typography>

                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography className="mb-16" variant="h6">Récapitulatif de votre commande</Typography>

                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    <Grid container spacing={3} className="mt-16 mb-16">
                                        <Grid item xs={12} sm={6}>
                                            {
                                                commande.offres && offre ?
                                                    commande.offres.map((item, index) => (
                                                        <Grid container key={index} spacing={3} >
                                                            <Grid item xs={6} sm={6}>
                                                                <strong className="p-1" >
                                                                    {item.name}
                                                                </strong> <br />
                                                                <span className="p-1" >
                                                                    {item.description}
                                                                </span>
                                                            </Grid>
                                                            <Grid item xs={6} sm={6}>
                                                                <FormGroup row>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                checked={offre.id === item.id}
                                                                                onChange={() => {
                                                                                    handleChangeOffre(item);
                                                                                }}
                                                                                value={item['@id']}
                                                                            />
                                                                        }
                                                                        label={
                                                                            commande.data.fournisseur.currency.name === 'DHS' ?
                                                                                parseFloat(item.prixMad).toLocaleString(
                                                                                    'fr', // leave undefined to use the browser's locale,
                                                                                    // or use a string like 'en-US' to override it.
                                                                                    { minimumFractionDigits: 2 }
                                                                                ) + ' DHS HT / mois' :
                                                                                parseFloat(item.prixEur).toLocaleString(
                                                                                    'fr', // leave undefined to use the browser's locale,
                                                                                    // or use a string like 'en-US' to override it.
                                                                                    { minimumFractionDigits: 2 }
                                                                                ) + ' € HT / mois'
                                                                        }
                                                                    />
                                                                </FormGroup>
                                                            </Grid>

                                                        </Grid>

                                                    ))

                                                    :
                                                    <ContentLoader
                                                        height={160}
                                                        width={400}
                                                        speed={2}
                                                        primaryColor="#f3f3f3"
                                                        secondaryColor="#ecebeb"
                                                    >
                                                        <circle cx="10" cy="20" r="8" />
                                                        <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
                                                        <circle cx="10" cy="50" r="8" />
                                                        <rect x="25" y="45" rx="5" ry="5" width="220" height="10" />
                                                        <circle cx="10" cy="80" r="8" />
                                                        <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
                                                    </ContentLoader>
                                            }
                                            <Divider className="mt-8" />
                                            {
                                                commande.sousSecteurs ?
                                                    <>
                                                        <SelectReactFormsyS_S
                                                            className="mt-16 z-9999"
                                                            id="sousSecteurs"
                                                            name="sousSecteurs"
                                                            value={
                                                                sousSecteurs
                                                            }
                                                            onChange={(value) => handleChipChange(value, 'sousSecteurs')}
                                                            placeholder={"Sélectionner vos activités"}
                                                            textFieldProps={{
                                                                label: 'Activités',
                                                                InputLabelProps: {
                                                                    shrink: true
                                                                },
                                                                variant: 'outlined'
                                                            }}
                                                            options={commande.sousSecteurs}
                                                            fullWidth
                                                            isMulti
                                                            required
                                                        />

                                                    </>
                                                    :
                                                    <ContentLoader
                                                        height={70}
                                                        width={400}
                                                        speed={2}
                                                        primaryColor="#f3f3f3"
                                                        secondaryColor="#ecebeb"
                                                    >
                                                        <rect x="1" y="13" rx="5" ry="5" width="220" height="24" />
                                                    </ContentLoader>
                                            }

                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            {
                                                commande.offres && offre && duree ?
                                                    <Table className="w-full -striped">
                                                        <TableHead className="bg-gray-200">
                                                            <TableRow>
                                                                <TableCell

                                                                    className="font-bold  text-black"
                                                                >
                                                                    Offre
                                                        </TableCell>
                                                                <TableCell
                                                                    className="font-bold text-black text-right"
                                                                >
                                                                    Total HT
                                                        </TableCell>

                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow >
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate text-11"
                                                                >
                                                                    <strong>{offre ? offre.name : ''}</strong>
                                                                    <br />
                                                                    {

                                                                        commande.data.fournisseur.currency.name === 'DHS' ?
                                                                            parseFloat(offre.prixMad).toLocaleString(
                                                                                'fr', // leave undefined to use the browser's locale,
                                                                                // or use a string like 'en-US' to override it.
                                                                                { minimumFractionDigits: 2 }
                                                                            ) :
                                                                            parseFloat(offre.prixEur).toLocaleString(
                                                                                'fr', // leave undefined to use the browser's locale,
                                                                                // or use a string like 'en-US' to override it.
                                                                                { minimumFractionDigits: 2 }
                                                                            )
                                                                    }
                                                                    * {duree.name + ' mois'}
                                                                </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate text-11 text-right"
                                                                >
                                                                    {
                                                                        parseFloat(prixht).toLocaleString(
                                                                            'fr', // leave undefined to use the browser's locale,
                                                                            // or use a string like 'en-US' to override it.
                                                                            { minimumFractionDigits: 2 }
                                                                        )
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow className="bg-gray-200" >
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate text-11 text-right"
                                                                >
                                                                    Total HT
                                                        </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate text-11 text-right"
                                                                >
                                                                    {
                                                                        parseFloat(prixht).toLocaleString(
                                                                            'fr', // leave undefined to use the browser's locale,
                                                                            // or use a string like 'en-US' to override it.
                                                                            { minimumFractionDigits: 2 }
                                                                        )
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                            {
                                                                duree.remise ?
                                                                    <TableRow className="" >
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                            className="truncate text-11 text-right"
                                                                        >
                                                                            Remise ({duree.remise}%)
                                                                    </TableCell>
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                            className="truncate text-11 text-right"
                                                                        >
                                                                            {
                                                                                parseFloat(remise).toLocaleString(
                                                                                    'fr', // leave undefined to use the browser's locale,
                                                                                    // or use a string like 'en-US' to override it.
                                                                                    { minimumFractionDigits: 2 }
                                                                                )
                                                                            }

                                                                        </TableCell>
                                                                    </TableRow>
                                                                    :
                                                                    null

                                                            }
                                                            <TableRow className="" >
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="text-11 text-right"
                                                                >
                                                                    Remise
                                                            </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate text-11 text-right"
                                                                >
                                                                    <TextFieldFormsy
                                                                        type="number"
                                                                        step="any"
                                                                        name="discount"
                                                                        id="discount"
                                                                        onChange={(ev) => { handleChangeDiscount(ev.target.value) }}
                                                                        value={discount}

                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                            {
                                                                prixhtNet > 0 && prixhtNet!==prixht?
                                                                    <TableRow className="bg-gray-200" >
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                            className="truncate text-11 text-right"
                                                                        >
                                                                            Montant NET HT
                                                                    </TableCell>
                                                                        <TableCell
                                                                            component="th"
                                                                            scope="row"
                                                                            className="truncate text-11 text-right"
                                                                        >
                                                                            {
                                                                                parseFloat(prixhtNet).toLocaleString(
                                                                                    'fr', // leave undefined to use the browser's locale,
                                                                                    // or use a string like 'en-US' to override it.
                                                                                    { minimumFractionDigits: 2 }
                                                                                )
                                                                            }

                                                                        </TableCell>
                                                                    </TableRow>
                                                                    :
                                                                    null

                                                            }
                                                            <TableRow className="" >
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate text-11 text-right"
                                                                >
                                                                    TVA (20%)
                                                        </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate text-11 text-right"
                                                                >
                                                                    {
                                                                        parseFloat(tva).toLocaleString(
                                                                            'fr', // leave undefined to use the browser's locale,
                                                                            // or use a string like 'en-US' to override it.
                                                                            { minimumFractionDigits: 2 }
                                                                        )
                                                                    }
                                                                </TableCell>
                                                            </TableRow>


                                                            <TableRow className="bg-gray-200" >
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate font-bold text-11 text-right"
                                                                >
                                                                    Montant TTC
                                                        </TableCell>
                                                                <TableCell
                                                                    component="th"
                                                                    scope="row"
                                                                    className="truncate font-bold text-13 text-right"
                                                                >
                                                                    {
                                                                        parseFloat(prixTTC).toLocaleString(
                                                                            'fr', // leave undefined to use the browser's locale,
                                                                            // or use a string like 'en-US' to override it.
                                                                            { minimumFractionDigits: 2 }
                                                                        )
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>

                                                    </Table>
                                                    :
                                                    <ContentLoader
                                                        height={160}
                                                        width={400}
                                                        speed={2}
                                                        primaryColor="#f3f3f3"
                                                        secondaryColor="#ecebeb"
                                                    >
                                                        <circle cx="10" cy="20" r="8" />
                                                        <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
                                                        <circle cx="10" cy="50" r="8" />
                                                        <rect x="25" y="45" rx="5" ry="5" width="220" height="10" />
                                                        <circle cx="10" cy="80" r="8" />
                                                        <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
                                                    </ContentLoader>
                                            }


                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} className="">
                                        <Grid item xs={12} sm={6}>
                                            <Typography className="mb-16" variant="h6">2- Mode de paiement </Typography>

                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography className="mb-16" variant="h6">3- Durée de votre abonnement</Typography>

                                        </Grid>
                                    </Grid>

                                    <Divider />
                                    <Grid container spacing={3} className="mt-6 mb-16">
                                        <Grid item xs={12} sm={6}>
                                            {
                                                commande.paiements ?
                                                    commande.paiements.map((item, index) => (
                                                        <FormControlLabel onChange={() => setMode(item['@id'])} key={index} value={item['@id']} checked={mode === item['@id']} control={<Radio />} label={item.name} />
                                                    ))
                                                    :
                                                    <ContentLoader
                                                        height={70}
                                                        width={400}
                                                        speed={2}
                                                        primaryColor="#f3f3f3"
                                                        secondaryColor="#ecebeb"
                                                    >
                                                        <circle cx="15" cy="17" r="6" />
                                                        <rect x="25" y="11" rx="5" ry="5" width="100" height="12" />
                                                        <circle cx="145" cy="17" r="6" />
                                                        <rect x="155" y="11" rx="5" ry="5" width="100" height="12" />
                                                    </ContentLoader>
                                            }


                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            {
                                                commande.durees && duree ?
                                                    commande.durees.map((item, index) => (
                                                        <div className="inline" key={index} >
                                                            <FormControlLabel onChange={() => handleChangeDuree(item)}
                                                                value={item['@id']}
                                                                checked={duree.id === item.id}
                                                                control={<Radio />}
                                                                label={item.name + ' mois'} />

                                                            {
                                                                item.remise ?
                                                                    <span className="text-12 text-red">(Soit {item.remise}% de remise )</span>
                                                                    : ''
                                                            }

                                                        </div >
                                                    ))
                                                    :
                                                    <ContentLoader
                                                        height={70}
                                                        width={400}
                                                        speed={2}
                                                        primaryColor="#f3f3f3"
                                                        secondaryColor="#ecebeb"
                                                    >
                                                        <circle cx="15" cy="17" r="6" />
                                                        <rect x="25" y="11" rx="5" ry="5" width="100" height="12" />
                                                        <circle cx="145" cy="17" r="6" />
                                                        <rect x="155" y="11" rx="5" ry="5" width="100" height="12" />
                                                    </ContentLoader>
                                            }
                                        </Grid>
                                    </Grid>

                                </Formsy>
                            )}
                            {tabValue === 1 && (
                                <Formsy

                                    className="flex flex-col">

                                    <Grid container spacing={3} className="mb-5">

                                        <Grid item xs={12} sm={4}>
                                            <div className="flex">
                                                <TextFieldFormsy
                                                    className=""
                                                    type="text"
                                                    name="fullname"
                                                    value={commande.data.fournisseur.civilite + ' ' + commande.data.fournisseur.firstName + ' ' + commande.data.fournisseur.lastName}
                                                    label="Nom complet"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    fullWidth

                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <div className="flex">
                                                <TextFieldFormsy
                                                    className=""
                                                    name="email"
                                                    value={commande.data.fournisseur.email}
                                                    label="Email"
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">email</Icon></InputAdornment>

                                                    }}

                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextFieldFormsy
                                                className=""
                                                type="text"
                                                name="phonep"
                                                id="phonep"
                                                value={commande.data.fournisseur.phone}
                                                label="Téléphone"
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">local_phone</Icon></InputAdornment>
                                                }}
                                                fullWidth
                                            />

                                        </Grid>

                                    </Grid>
                                    <Divider />
                                    <Grid container spacing={3} className="mb-5">

                                        <Grid item xs={12} sm={8}>
                                            <div className="flex">

                                                <TextFieldFormsy
                                                    className="mt-20"
                                                    label="Raison sociale"
                                                    id="societe"
                                                    name="societe"
                                                    value={commande.data.fournisseur.societe}
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                            </div>


                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <div className="flex">
                                                <TextFieldFormsy
                                                    className="mt-20"
                                                    name="fix"
                                                    value={commande.data.fournisseur.fix}
                                                    label="Fix"
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">local_phone</Icon></InputAdornment>
                                                    }}
                                                    fullWidth
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>


                                            <TextFieldFormsy
                                                id="secteur"
                                                className=""
                                                name="secteur"
                                                label="Secteur"
                                                value={commande.data.fournisseur.sousSecteurs ? _.join(_.map(commande.data.fournisseur.sousSecteurs, 'name'), ', ') : ''}
                                                fullWidth
                                                multiline
                                                rows="3"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                            />


                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <div className="flex">
                                                <TextFieldFormsy
                                                    id="website"
                                                    className=""
                                                    type="text"
                                                    name="website"
                                                    value={commande.data.fournisseur.website}
                                                    label="Site Web"
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">language</Icon></InputAdornment>
                                                    }}
                                                    fullWidth
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={8}>
                                            <div className="flex">
                                                {
                                                    commande.data.fournisseur.ice ?
                                                        <TextFieldFormsy
                                                            className=""
                                                            type="text"
                                                            name="ice"
                                                            id="ice"
                                                            value={commande.data.fournisseur.ice}
                                                            label="ICE"
                                                            fullWidth
                                                            InputProps={{
                                                                readOnly: true,
                                                            }}
                                                        />
                                                        :
                                                        ''
                                                }

                                            </div>

                                        </Grid>


                                    </Grid>
                                    <Divider />


                                    <Grid container spacing={3} className="mb-5">

                                        <Grid item xs={12} sm={8}>
                                            <div className="flex">

                                                <TextFieldFormsy
                                                    className="mt-20"
                                                    type="text"
                                                    name="adresse1"
                                                    id="adresse1"
                                                    value={commande.data.fournisseur.adresse1}
                                                    label="Adresse 1"
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_on</Icon></InputAdornment>
                                                    }}
                                                    fullWidth

                                                />
                                            </div>

                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextFieldFormsy
                                                className="mt-20"
                                                type="text"
                                                name="pays"
                                                id="pays"
                                                value={commande.data.fournisseur.pays ? commande.data.fournisseur.pays.name : ''}
                                                label="Pays"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                fullWidth
                                            />

                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <div className="flex">
                                                <TextFieldFormsy
                                                    className=""
                                                    type="text"
                                                    name="adresse2"
                                                    value={commande.data.fournisseur.adresse2}
                                                    label="Adresse 2"
                                                    InputProps={{
                                                        readOnly: true,
                                                        endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">location_on</Icon></InputAdornment>
                                                    }}
                                                    fullWidth

                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <div className="flex">
                                                <TextFieldFormsy
                                                    className=""
                                                    name="codepostal"
                                                    value={String(commande.data.fournisseur.codepostal)}
                                                    label="Code Postal"
                                                    fullWidth
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}

                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <TextFieldFormsy
                                                className=""
                                                type="text"
                                                name="ville"
                                                id="ville"
                                                value={commande.data.fournisseur.ville ? commande.data.fournisseur.ville.name : ''}
                                                label="Ville"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                fullWidth
                                            />

                                        </Grid>

                                    </Grid>
                                    <Divider />

                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={12}>

                                            <TextFieldFormsy
                                                className="mb-5 mt-20  w-full"
                                                type="text"
                                                name="description"
                                                value={commande.data.fournisseur.description}
                                                label="Présentation"
                                                multiline
                                                rows="2"
                                                InputProps={{
                                                    readOnly: true,
                                                }}

                                            />

                                        </Grid>

                                    </Grid>




                                </Formsy>
                            )}


                        </div>
                    )
                    : ''
            }
            innerScroll
        />

    )
}

export default withReducer('commandeOffreAdminApp', reducer)(Commande);