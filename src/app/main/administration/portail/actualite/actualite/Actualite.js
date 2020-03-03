import React, { useRef, useEffect, useState } from 'react';
import { Button, Tab, Tabs, InputAdornment, Icon, Typography, LinearProgress, Grid, CircularProgress, IconButton, Tooltip, SnackbarContent } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import { FuseAnimate, FusePageCarded, FuseUtils, TextFieldFormsy, DatePickerFormsy, SelectReactFormsyS_S, CheckboxFormsy } from '@fuse';
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
import ErrorIcon from '@material-ui/icons/Error';
import ReactTable from "react-table";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    actualiteImageUpload: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
    },
    actualiteImageItem: {
        transitionProperty: 'box-shadow',
        transitionDuration: theme.transitions.duration.short,
        transitionTimingFunction: theme.transitions.easing.easeInOut,
        '&:hover': {
            '& $actualiteImageFeaturedStar': {
                opacity: .8
            }
        },
        '&.featured': {
            pointerEvents: 'none',
            boxShadow: theme.shadows[3],
            '& $actualiteImageFeaturedStar': {
                opacity: 1
            },
            '&:hover $actualiteImageFeaturedStar': {
                opacity: 1
            }
        }
    },


}));
function Actualite(props) {

    const dispatch = useDispatch();
    const actualite = useSelector(({ actualiteApp }) => actualiteApp.actualite);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);
    const { form, handleChange, setForm } = useForm(null);

    const classes = useStyles(props);
    const [tabValue, setTabValue] = useState(0);
    const [description, setDescription] = useState(null);

    useEffect(() => {
        function updateActualiteState() {
            const params = props.match.params;
            const { actualiteId } = params;
            
            if (actualiteId === 'new') {
                dispatch(Actions.newActualite());
            }
            else {
                dispatch(Actions.getActualite(actualiteId));

            }
        }

        updateActualiteState();
    }, [dispatch, props.match.params]);

    useEffect(() => {

        if (actualite.image) {
            setForm(_.set({ ...form }, 'image', actualite.image));
            actualite.image = null;
        }

    }, [form, setForm, actualite.image]);


    useEffect(() => {
        if (actualite.error && (actualite.error.titre || actualite.error.source)) {
            formRef.current.updateInputsWithError({
                ...actualite.error
            });
            disableButton();
            actualite.error = null;
        }
    }, [actualite.error]);

    useEffect(() => {
        if (actualite.success) {

            actualite.success = false;
            actualite.data = null;
            actualite.error = null;
            actualite.image_deleted = null;
            props.history.push('/admin/actualites');
        }
    }, [actualite.success]);



    

    useEffect(() => {
        if (
            (actualite.data && !form) ||
            (actualite.data && form && actualite.data.id !== form.id)
        ) {
            setForm({ ...actualite.data });
        }
    }, [form, actualite.data, setForm]);

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


    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleSubmit(model) {
        //event.preventDefault();



        const params = props.match.params;
        const { actualiteId } = params;

        if (actualiteId === 'new') {
            dispatch(Actions.saveActualite(form));
        }
        else {

            dispatch(Actions.putActualite(form, form.id));
        }
    }

    return (
        <FusePageCarded
            classes={{
                toolbar: "p-0",
                header: "min-h-72 h-72 sm:h-136 sm:min-h-136"
            }}
            header={
                !actualite.loading
                    ?

                    form && (
                        <div className="flex flex-1 w-full items-center justify-between">

                            <div className="flex flex-col items-start max-w-full">

                                <FuseAnimate animation="transition.slideRightIn" delay={300}>
                                    <Typography className="normal-case flex items-center sm:mb-12" component={Link} role="button" to="/admin/actualites" color="inherit">
                                        <Icon className="mr-4 text-20">arrow_back</Icon>
                                        Retour
                                </Typography>
                                </FuseAnimate>

                                <div className="flex items-center max-w-full">

                                    <div className="flex flex-col min-w-0">
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography className="text-16 sm:text-20 truncate">
                                                {form.titre ? form.titre : 'Nouvelle Actualite'}
                                            </Typography>
                                        </FuseAnimate>
                                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                            <Typography variant="caption">Actualite Detail</Typography>
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
                actualite.loading ?
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
                            label="Image"

                        />


                    </Tabs>

            }
            content={
                !actualite.loading ?

                    form && (
                        <div className="p-10  sm:p-24 max-w-2xl">
                            {tabValue === 0 &&
                                (
                                    <Formsy
                                        onValidSubmit={handleSubmit}
                                        onValid={enableButton}
                                        onInvalid={disableButton}
                                        ref={formRef}
                                        className="flex flex-col ">

                                        <div className="flex pt-10 ">


                                            <TextFieldFormsy
                                                className="mb-16"
                                                label="Titre"
                                                autoFocus
                                                id="titre"
                                                name="titre"
                                                value={form.titre}
                                                onChange={handleChange}
                                                variant="outlined"
                                                validations={{
                                                    minLength: 6
                                                }}
                                                validationErrors={{
                                                    minLength: 'Min character length is 6'
                                                }}
                                                required
                                                fullWidth
                                            />

                                        </div>

                                        <div className="flex">

                                            <TextFieldFormsy
                                                className="mb-16"
                                                type="text"
                                                name="source"
                                                value={form.source}
                                                onChange={handleChange}
                                                autoComplete="website"
                                                label="Source"
                                                validations="isUrl"
                                                validationErrors={{
                                                    isUrl: 'Exemple : http://www.exemple.com',
                                                }}
                                                variant="outlined"
                                                required
                                                fullWidth
                                            />
                                        </div>


                                        <CKEditor
                                            editor={ClassicEditor}
                                            data={form.description}
                                            onInit={editor => {
                                                // You can store the "editor" and use when it is needed.
                                                console.log('Editor is ready to use!', editor);
                                            }}
                                            name='description'
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setForm(_.set({ ...form }, 'description', data))
                                            }}
                                            required
                                        />
                                        {
                                            actualite.error && actualite.error.description ? <span className='text-red'> {actualite.error.description}</span> : ''
                                        }

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            className="w-200 pr-auto mt-16 normal-case"
                                            aria-label="Suivant"
                                            disabled={!isFormValid || actualite.loading || !form.description || !form.image}
                                            value="legacy"
                                        >
                                            Sauvegarder
                                                {actualite.loading && <CircularProgress size={24} className={classes.buttonProgress} />}

                                        </Button>

                                    </Formsy>
                                )}
                            {tabValue === 1 && (
                                <div>
                                    <input
                                        accept="image/jpeg,image/gif,image/png"
                                        className="hidden"
                                        id="button-file"
                                        type="file"
                                        disabled={actualite.imageReqInProgress}
                                        onChange={handleUploadChange}
                                    />
                                    <div className="flex justify-center sm:justify-start flex-wrap">
                                        <label
                                            htmlFor="button-file"

                                            className={
                                                clsx(
                                                    classes.imageImageUpload,
                                                    "flex items-center justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5",

                                                )}
                                        >
                                            {
                                                actualite.imageReqInProgress ?
                                                    <CircularProgress size={24} className={classes.buttonProgress} />
                                                    :
                                                    <Icon fontSize="large" color="action">cloud_upload</Icon>

                                            }
                                        </label>


                                        {form.image ?
                                            <div
                                                className={
                                                    clsx(
                                                        classes.imageImageItem,
                                                        "flex items-center cursor-pointer justify-center relative w-128 h-128 rounded-4 mr-16 mb-16 overflow-hidden  shadow-1 hover:shadow-5")
                                                }
                                                onClick={form.image ? () => window.open(FuseUtils.getUrl() + form.image.url, "_blank") : ''}
                                            >
                                                <img className="max-w-none w-auto h-full"
                                                    src={FuseUtils.getUrl() + form.image.url}
                                                    alt={form.titre} />
                                            </div>
                                            :
                                            ''}



                                    </div>

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

export default withReducer('actualiteApp', reducer)(Actualite);
