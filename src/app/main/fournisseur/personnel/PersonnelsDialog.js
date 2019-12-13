import React, {useEffect, useCallback, useRef, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, DialogTitle, DialogContentText} from '@material-ui/core';
import {useForm} from '@fuse/hooks';
import * as Actions from './store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {TextFieldFormsy} from '@fuse';
import Formsy from 'formsy-react';

const defaultFormState = {
    firstName    : '',
    lastName    : '',
    phone: '',
    email: '',
};

function PersonnelsDialog(props)
{
    const dispatch = useDispatch();
    const personnelsDialog = useSelector(({personnelsApp}) => personnelsApp.personnels.personnelsDialog);
    const user = useSelector(({auth}) => auth.user);
    const imageReqInProgress = useSelector(({personnelsApp}) => personnelsApp.personnels.imageReqInProgress);
    const avatar = useSelector(({personnelsApp}) => personnelsApp.personnels.avatar);

    const {form, handleChange, setForm} = useForm(defaultFormState);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if ( personnelsDialog.type === 'edit' && personnelsDialog.data )
            {
                setForm({...personnelsDialog.data});
            }

            /**
             * Dialog type: 'new'
             */
            if ( personnelsDialog.type === 'new' )
            {
                setForm({
                    ...personnelsDialog.data,
                    ...defaultFormState
                });
            }
        },
        [personnelsDialog.data, personnelsDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if ( personnelsDialog.props.open )
        {
            initDialog();
        }

    }, [personnelsDialog.props.open, initDialog]);


    function closeComposeDialog()
    {
        personnelsDialog.type === 'edit' ? dispatch(Actions.closeEditPersonnelsDialog()) : dispatch(Actions.closeNewPersonnelsDialog());
    }

   

    function handleSubmit(event)
    {
        //event.preventDefault();
        if ( personnelsDialog.type === 'new' )
        {
            dispatch(Actions.addPersonnel(form,user.id));
        }
        else
        {
            dispatch(Actions.updatePersonnel(form,user.id));
        }
        closeComposeDialog();
    }

    function handleRemove()
    {
        dispatch(Actions.removePersonnel(form,user.id));
        dispatch(Actions.closeDialog())
        closeComposeDialog();
    }


    function disableButton()
    {
        setIsFormValid(false);
    }

    function enableButton()
    {
        setIsFormValid(true);
    }

    return (
        <Dialog
            classes={{
                paper: "m-24"
            }}
            {...personnelsDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {personnelsDialog.type === 'new' ? 'Nouveau Personnel' : 'Edit Personnel'}
                    </Typography>
                </Toolbar>
               
            </AppBar>
            <Formsy 
            onValidSubmit={handleSubmit}
            onValid={enableButton}
            onInvalid={disableButton}
            ref={formRef}
            className="flex flex-col overflow-hidden">
                <DialogContent classes={{root: "p-24"}}>
                    <div className="flex">
                        
                        <TextFieldFormsy
                            className="mb-24"
                            label="Nom"
                            autoFocus
                            id="lastName"
                            name="lastName"
                            value={form.lastName}
                            onChange={handleChange}
                            variant="outlined"
                            validations={{
                                minLength: 4
                            }}
                            validationErrors={{
                                minLength: 'Min character length is 4'
                            }}
                            required
                            fullWidth
                        />
                    </div>

                    <div className="flex">
                        
                        <TextFieldFormsy
                            className="mb-24"
                            label="Prénom"
                            id="firstName"
                            name="firstName"
                            value={form.firstName}
                            onChange={handleChange}
                            variant="outlined"
                            validations={{
                                minLength: 6
                            }}
                            validationErrors={{
                                minLength: 'Min character length is 4'
                            }}
                            required
                            fullWidth
                        />
                    </div>

                    <div className="flex">
                        
                        <TextFieldFormsy
                            className="mb-24"
                            label="Téléphone"
                            id="phone"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            variant="outlined"
                            validations={{
                                minLength: 10,
                                isNumeric: true,
                            }}
                            validationErrors={{
                                minLength: 'Min character length is 10',
                                isNumeric: 'Numeric value required',
                            }}
                            required
                            fullWidth
                        />
                    </div>
                    <div className="flex">
                        
                        <TextFieldFormsy
                            className="mb-24"
                            label="E-mail"
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            variant="outlined"
                            validations="isEmail"
                            validationErrors={{
                                isEmail:"This is not a valid email"
                            }}
                            required
                            fullWidth
                        />
                    </div>

                   
                </DialogContent>

                {personnelsDialog.type === 'new' ? (
                    <DialogActions className="justify-between pl-16">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            Ajouter
                        </Button>
                    </DialogActions>
                ) : (
                    <DialogActions className="justify-between pl-16">
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!isFormValid}
                        >
                            Modifier
                        </Button>
                        <IconButton
                            onClick={()=> dispatch(Actions.openDialog({
                                children: (
                                    <React.Fragment>
                                        <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-description">
                                            Voulez vous vraiment supprimer cet enregistrement ?
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={()=> dispatch(Actions.closeDialog())} color="primary">
                                                Non
                                            </Button>
                                            <Button onClick={handleRemove} color="primary" autoFocus>
                                                Oui
                                            </Button>
                                        </DialogActions>
                                    </React.Fragment>
                                     )
                                 }))}
                            
                            
                        >
                            <Icon>delete</Icon>
                        </IconButton>
                    </DialogActions>
                )}
            </Formsy>
        </Dialog>
    );
}

export default PersonnelsDialog;