import React, { useRef, useEffect, useState } from 'react';
import { Button, Tab, Tabs, TextField, InputAdornment, Icon, Typography, LinearProgress, MenuItem, Grid, CircularProgress, IconButton, Tooltip, FormControlLabel, Radio } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, FuseUtils, TextFieldFormsy, DatePickerFormsy, SelectReactFormsyS_S, CheckboxFormsy, SelectFormsy, RadioGroupFormsy } from '@fuse';
import { useForm } from '@fuse/hooks';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import _ from '@lodash';
import { useDispatch, useSelector } from 'react-redux';
import withReducer from 'app/store/withReducer';
import * as Actions from '../store/actions';
import reducer from '../store/reducers';
import Formsy from 'formsy-react';
import moment from 'moment';
import green from '@material-ui/core/colors/green';
import ReactTable from "react-table";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },

    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    demandeImageFeaturedStar: {
        position: 'absolute',
        top: 0,
        right: 0,
        color: red[400],
        opacity: 0
    },
    demandeImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
    select: {
        zIndex: 999,
    },
    demandeImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& $demandeImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& $demandeImageFeaturedStar': {
                opacity: 1
            },
            '&:hover $demandeImageFeaturedStar': {
                opacity: 1
            }
        }
    }
}));
moment.defaultFormat = "DD/MM/YYYY HH:mm";
function Demande(props) {

    const dispatch = useDispatch();
    const demande = useSelector(({ demandesApp }) => demandesApp.demande);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const { form, handleChange, setForm } = useForm(null);

    const classes = useStyles(props);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {

        if (demande.attachement) {
            setForm(_.set({ ...form }, 'attachements', [
                demande.attachement,
                ...form.attachements
            ]));
            demande.attachement = null;
        }

    }, [demande.attachement]);

    useEffect(() => {
        dispatch(Actions.getSousSecteurs());
    }, [dispatch]);

    useEffect(() => {
        if (demande.error && (demande.error.reference || demande.error.statut || demande.error.motifRejet || demande.error.description || demande.error.descriptionEn || demande.error.descriptionEs || demande.error.dateExpiration || demande.error.isPublic || demande.error.isAnonyme || demande.error.sousSecteurs || demande.error.budget)) {
            {
                formRef.current.updateInputsWithError({
                    ...demande.error
                });
            }
            disableButton();
            demande.error = null;
        }
    }, [demande.error]);

    useEffect(() => {
        if (demande.success) {

            demande.success = false;
            demande.data = null;
            demande.error = null;
            demande.attachement_deleted = null;
            props.history.push('/demandes_admin');
        }
    }, [demande.success]);

    useEffect(() => {
        if (demande.attachement_deleted) {
            setForm(_.set({ ...form }, 'attachements', _.pullAllBy(form.attachements, [{ 'id': demande.attachement_deleted }], 'id')));
            demande.attachement_deleted = null;
        }
    }, [demande.attachement_deleted]);

    useEffect(() => {
        function updateDemandeState() {
            const params = props.match.params;
            const { demandeId } = params;

            if (demandeId === 'new') {
                dispatch(Actions.newDemande());
            }
            else {
                dispatch(Actions.getDemande(demandeId));

            }
        }

        updateDemandeState();
    }, [dispatch, props.match.params]);

    useEffect(() => {
        if (
            (demande.data && !form) ||
            (demande.data && form && demande.data.id !== form.id)
        ) {
            setForm({ ...demande.data });

            if (demande.data.sousSecteurs) {
                let sousSecteurs = demande.data.sousSecteurs.map(item => ({
                    value: item['@id'],
                    label: item.name
                }));
                setForm(_.set({ ...demande.data }, 'sousSecteurs', sousSecteurs));

            }


        }
    }, [form, demande.data, setForm]);

    function handleChangeTab(event, tabValue) {
        setTabValue(tabValue);
    }

    function handleUploadChange(e) {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        dispatch(Actions.uploadAttachement(file));
    }

    function handleDateChange(value, name) {
        //setForm(_.set({...form}, name, value.map(item => item.value)));
        setForm(_.set({ ...form }, name, moment(value).format('YYYY-MM-DDTHH:mm:ssZ')));
    }



    function handleChipChange(value, name) {

        if (!_.some(value, 'value')) {
            setForm(_.set({ ...form }, name, ''));
        }
        else {
            setForm(_.set({ ...form }, name, value));
        }
    }

    function handleRadioChange(e) {

        setForm(_.set({ ...form }, 'statut', parseInt(e.target.value)));
    }

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {

        model.sousSecteurs = _.map(model.sousSecteurs, function (value, key) {
            return value.value;
        });
        model.attachements = _.map(form.attachements, function (value, key) {
            return value['@id'];
        });

        dispatch(Actions.putDemande(model, form['@id']));

    }

    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                !demande.loading
                    ?

                    form && (
                        <div className="flex flex-1 w-full items-center justify-between">

                            <div className="flex flex-col items-start max-w-full">

                                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/demandes_admin" color="inherit">
                                        <Icon className="mr-4 text-20">arrow_back</Icon>
                                        Retour
                                </Typography>
                                </FuseAnimate>

                                <div className="flex items-center max-w-full">

                                    <div className="flex flex-col min-w-0">
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography className="text-16 sm:text-20 truncate">
                                                {form.reference ? 'RFQ-' + form.reference : 'Nouvelle Demande'}
                                            </Typography>
                                        </FuseAnimate>
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography variant="caption">Demande Detail</Typography>
                                        </FuseAnimate>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )
                    :
                    ''
            }
            contentToolbar={
                demande.loading ?
                    <div className={classes.root}>
                        <LinearProgress color="secondary" />
                    </div>
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
                        <Tab className="h-64 normal-case" label="Basic Info" />
                        <Tab className="h-64 normal-case"
                            label={
                                form && form.attachements.length > 0
                                    ? "Pièce(s) jointe(s) (" + form.attachements.length + ")"
                                    : "Pièce(s) jointe(s)"}
                        />
                        {form && form.diffusionsdemandes.length > 0 ?
                            <Tab className="h-64 normal-case" label={"Diffuser (" + form.diffusionsdemandes.length + " fois)"} />
                            : ''}

                    </Tabs>

            }
            content={
                !demande.loading ?

                    form && (
                        <div className="p-10  sm:p-24 max-w-2xl">
                            {tabValue === 0 &&
                                (
                                    <Formsy
                                        onValidSubmit={handleSubmit}
                                        onValid={enableButton}
                                        onInvalid={disableButton}
                                        ref={formRef}
                                        className="flex pt-10 flex-col ">
                                        <div className="flex">

                                            <TextFieldFormsy
                                                className="mb-24"
                                                label="Référence"
                                                autoFocus
                                                id="reference"
                                                name="reference"
                                                value={form.reference}
                                                onChange={handleChange}
                                                variant="outlined"
                                                validations={{
                                                    minLength: 4
                                                }}
                                                validationErrors={{
                                                    minLength: 'Min character length is 4'
                                                }}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">RFQ-</InputAdornment>,
                                                }}
                                                required
                                                fullWidth
                                            />
                                        </div>
                                        <div className="flex">

                                            <DatePickerFormsy
                                                className="mb-24"
                                                label="Date d'éxpiration"
                                                id="dateExpiration"
                                                name="dateExpiration"
                                                value={form.dateExpiration}
                                                onChange={(value) => handleDateChange(value, 'dateExpiration')}
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        </div>
                                        <SelectReactFormsyS_S
                                            className="mb-24 z-9999"
                                            id="sousSecteurs"
                                            name="sousSecteurs"
                                            value={
                                                form.sousSecteurs
                                            }
                                            onChange={(value) => handleChipChange(value, 'sousSecteurs')}
                                            placeholder="Selectionner multiple Sous-secteurs"
                                            textFieldProps={{
                                                label: 'Sous-secteurs',
                                                InputLabelProps: {
                                                    shrink: true
                                                },
                                                variant: 'outlined'
                                            }}
                                            options={demande.sousSecteurs}
                                            fullWidth
                                            isMulti
                                            required
                                        />



                                        <TextFieldFormsy
                                            className="mb-16  w-full"
                                            type="text"
                                            name="description"
                                            value={form.description}
                                            onChange={handleChange}
                                            label="Description"
                                            autoComplete="description"
                                            validations={{
                                                minLength: 10,
                                            }}
                                            validationErrors={{
                                                minLength: 'La longueur minimale de caractère est 10',
                                            }}

                                            variant="outlined"
                                            multiline
                                            rows="4"
                                            required

                                        />

                                        <TextFieldFormsy
                                            className="mb-24"
                                            label="Budget en Dhs"
                                            id="budget"
                                            type="number"
                                            name="budget"
                                            value={_.toString(form.budget)}
                                            onChange={handleChange}
                                            variant="outlined"
                                            validations={{

                                                isNumeric: true,
                                            }}
                                            validationErrors={{
                                                isNumeric: 'Numeric value required',

                                            }}
                                            required
                                            fullWidth
                                        />
                                        <Grid container spacing={3} >

                                            <Grid item xs={12} sm={3}>

                                                <RadioGroupFormsy
                                                    className="mb-10 inline"
                                                    name="statut"
                                                    value={form.statut}
                                                    onChange={handleRadioChange}
                                                >
                                                    <FormControlLabel value="1" checked={form.statut === 1} control={<Radio />} label="Valider" />
                                                    <FormControlLabel value="2" checked={form.statut === 2} control={<Radio />} label="Rejeter" />

                                                </RadioGroupFormsy>
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <CheckboxFormsy
                                                    className="mb-10"
                                                    name="sendEmail"
                                                    onChange={handleChange}
                                                    label="Alerter Fournisseurs"
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <CheckboxFormsy
                                                    className="mb-10"
                                                    name="isPublic"
                                                    value={form.isPublic}
                                                    onChange={handleChange}
                                                    label="Mettre en ligne"
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={3}>
                                                <CheckboxFormsy
                                                    className="mb-10"
                                                    name="isAnonyme"
                                                    value={form.isAnonyme}
                                                    onChange={handleChange}
                                                    label="Mettre la demande anonyme"
                                                />
                                            </Grid>
                                        </Grid>
                                        
                                        <Grid container spacing={3} >



                                            <Grid item xs={12} sm={4}>

                                            </Grid>
                                        </Grid>

                                        {(form.statut === 2 || form.motifRejet)
                                            ?
                                            <TextFieldFormsy
                                                className="mb-16  w-full"
                                                type="text"
                                                name="motifRejet"
                                                value={form.motifRejet}
                                                onChange={handleChange}
                                                label="Motif Rejet"
                                                validations={{
                                                    minLength: 10,
                                                }}
                                                validationErrors={{
                                                    minLength: 'La longueur minimale de caractère est 10',
                                                }}

                                                variant="outlined"
                                                multiline
                                                rows="4"
                                                required

                                            />
                                            :
                                            ''}

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className="w-200 pr-auto mt-16 normal-case"
                                            aria-label="Suivant"
                                            disabled={!isFormValid || demande.loading}
                                            value="legacy"
                                        >
                                            Sauvegarder
                                                {demande.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                        </Button>

                                    </Formsy>
                                )}
                            {tabValue === 1 && (
                                <div>
                                    <input
                                        accept="text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/pdf,image/jpeg,image/gif,image/png,application/pdf,"
                                        className="hidden"
                                        id="button-file"
                                        type="file"
                                        disabled={demande.attachementReqInProgress}
                                        onChange={handleUploadChange}
                                    />
                                    <div className="flex justify-center sm:justify-start flex-wrap">
                                        <label
                                            htmlFor="button-file"

                                            className={
                                                clsx(
                                                    classes.demandeImageUpload,
                                                    "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",
                                                    (form.attachements.length === 5) && 'hidden'
                                                )}
                                        >
                                            {
                                                demande.attachementReqInProgress ?
                                                    <CircularProgress size={24} className={classes.buttonProgress} />
                                                    :
                                                    <Icon fontSize="large" color="action">cloud_upload</Icon>

                                            }
                                        </label>


                                        {form.attachements.map(media => (
                                            <div
                                                className={
                                                    clsx(
                                                        classes.demandeImageItem,
                                                        "flex items-center cursor-pointer justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden  shadow-1 hover:shadow-5")
                                                }
                                                key={media.id}
                                                onClick={() => window.open(FuseUtils.getUrl() + media.url, "_blank")}
                                            >
                                                <Tooltip title="Supprimer" >
                                                    <IconButton className={classes.demandeImageFeaturedStar}
                                                        onClick={(ev) => {
                                                            ev.stopPropagation();
                                                            dispatch(Actions.deleteMedia(media));
                                                        }}
                                                    >
                                                        <Icon>delete</Icon>
                                                    </IconButton>
                                                </Tooltip>

                                                {_.split(media.type, '/', 1)[0] === 'image' ?
                                                 <img className="max-w-none w-auto h-full"
                                                 src={ FuseUtils.getUrl() + media.url}
                                                 alt="demande" />
                                                  : 
                                                  <Icon   color="secondary" style={{ fontSize: 80 }}>insert_drive_file</Icon>
                                                  }   
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}
                            {tabValue === 2 && (
                                <div className="w-full flex flex-col">


                                    <FuseAnimate animation="transition.slideUpIn" delay={300}>

                                        <ReactTable

                                            className="-striped -highlight h-full sm:rounded-16 overflow-hidden"
                                            data={form.diffusionsdemandes}
                                            columns={[

                                                {
                                                    Header: "#",
                                                    accessor  : "id",
                                                    Cell: row => row.index+1
                                                        
                                                    
                                                },
                                                {
                                                    Header: "Fournisseur",
                                                    className : "font-bold",
                                                    id: "fournisseur",
                                                    accessor: f => f.fournisseur.societe + ' ' + f.fournisseur.firstName + ' ' + f.fournisseur.lastName + ' ' + f.fournisseur.phone,
                                                },
                                                {
                                                    Header: "Date de diffusion",
                                                    id: "dateDiffusion",
                                                    accessor: d => moment(d.dateDiffusion).format('DD/MM/YYYY HH:mm'),
                                                },



                                            ]}
                                            defaultPageSize={10}
                                            ofText='sur'
                                        />
                                    </FuseAnimate>




                                </div>
                            )}

                        </div>
                    )
                    : ''
            }
            innerScroll
        />
    )
}

export default withReducer('demandesApp', reducer)(Demande);