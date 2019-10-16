import React, {useEffect, useCallback, useRef, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, DialogTitle, DialogContentText, InputAdornment} from '@material-ui/core';
import {useForm} from '@fuse/hooks';
import * as Actions from './store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {TextFieldFormsy} from '@fuse';
import Formsy from 'formsy-react';
import _ from '@lodash';

const defaultFormState = {
    username    : '',
    firstName    : '',
    lastName    : '',
    adresse1: '',
    adresse2: '',
    codepostal:  null,
    phone: '',
    email: '',
};

function AdminsDialog(props)
{
    const dispatch = useDispatch();
    const adminsDialog = useSelector(({adminsApp}) => adminsApp.admins.adminsDialog);
    

    const {form, handleChange, setForm} = useForm(defaultFormState);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            console.log(adminsDialog.data);
            if ( adminsDialog.type === 'edit' && adminsDialog.data )
            {
                setForm({...adminsDialog.data});
            }

            /**
             * Dialog type: 'new'
             */
            if ( adminsDialog.type === 'new' )
            {
                setForm({
                    ...adminsDialog.data,
                    ...defaultFormState
                });
            }
        },
        [adminsDialog.data, adminsDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if ( adminsDialog.props.open )
        {
            initDialog();
        }

    }, [adminsDialog.props.open, initDialog]);

    

    function closeComposeDialog()
    {
        adminsDialog.type === 'edit' ? dispatch(Actions.closeEditAdminsDialog()) : dispatch(Actions.closeNewAdminsDialog());
    }

    

    function handleSubmit(event)
    {
        //event.preventDefault();
        form.codepostal=_.parseInt(form.codepostal);
        if ( adminsDialog.type === 'new' )
        {
            dispatch(Actions.addAdmin(form));
        }
        else
        {
            dispatch(Actions.updateAdmin(form));
        }
        closeComposeDialog();
    }

    function handleRemove()
    {
        dispatch(Actions.removeAdmin(form));
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
            {...adminsDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {adminsDialog.type === 'new' ? 'Nouveau Admins' : 'Edit Admins'}
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
                            label="Adresse 1"
                            id="adresse1"
                            name="adresse1"
                            value={form.adresse1}
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
                            className="mb-24"
                            label="Adresse 2"
                            id="adresse2"
                            name="adresse2"
                            value={form.adresse2}
                            onChange={handleChange}
                            variant="outlined"
                            validations={{
                                minLength: 4
                            }}
                            validationErrors={{
                                minLength: 'Min character length is 6'
                            }}
                            fullWidth
                        />
                    </div>

                    <div className="flex">
                        
                        <TextFieldFormsy
                            className="mb-24"
                            label="Code postal"
                            id="codepostal"
                            type="number"
                            name="codepostal"
                            value={_.toString(form.codepostal)}
                            onChange={handleChange}
                            variant="outlined"
                            validations={{
                                minLength: 4,
                                isNumeric: true,
                            }}
                            validationErrors={{
                                minLength: 'Min character length is 4',
                                isNumeric: 'Numeric value required',

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

                    <div className="flex">
                        
                        <TextFieldFormsy
                            className="mb-24"
                            label="Username"
                            id="username"
                            name="username"
                            value={form.username}
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
                    {adminsDialog.type === 'new' ? 
                                    (
                                    <div>
                                    <div className="flex">
                                        
                                            <TextFieldFormsy
                                            className="mb-24"
                                            type="password"
                                            name="password"
                                            label="Mot de passe"
                                            onChange={handleChange}
                                            validations={{
                                                minLength: 6
                                            }}
                                            validationErrors={{
                                                minLength: 'Min character length is 6'
                                            }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
                                            }}
                                            variant="outlined"
                                            required
                                            fullWidth
                                        />
                                    </div>
                                    <div className="flex">
                                    
                                        <TextFieldFormsy
                                            className="mb-24"
                                            id="confirmpassword"
                                            type="password"
                                            name="confirmpassword"
                                            label="Confirmer mot de passe"
                                            validations="equalsField:password"
                                            onChange={handleChange}
                                            validationErrors={{
                                                equalsField: 'Passwords not identique'
                                            }}
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end"><Icon className="text-20" color="action">vpn_key</Icon></InputAdornment>
                                            }}
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </div> 
                                    </div>) : ''
                    }
                    
                   
                </DialogContent>

                {adminsDialog.type === 'new' ? (
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

export default AdminsDialog;
