import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Typography, Toolbar, AppBar, FormControlLabel, Radio } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { RadioGroupFormsy } from '@fuse';
import Formsy from 'formsy-react';
import _ from '@lodash';

const defaultFormState = {
    name: '',
};

function CommandesDialog(props) {
    const dispatch = useDispatch();
    const CommandesDialog = useSelector(({ commandesApp }) => commandesApp.commandes.commandesDialog);
    const user = useSelector(({ auth }) => auth.user);



    const { form, setForm } = useForm(defaultFormState);


    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if (CommandesDialog.type === 'edit' && CommandesDialog.data) {
                setForm({ ...CommandesDialog.data });
            }

            /**
             * Dialog type: 'new'
             */
            if (CommandesDialog.type === 'new') {
                setForm({
                    ...defaultFormState,
                    ...CommandesDialog.data,
                });
            }
        },
        [CommandesDialog.data, CommandesDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (CommandesDialog.props.open) {
            initDialog();
        }

    }, [CommandesDialog.props.open, initDialog]);



    function closeComposeDialog() {
        CommandesDialog.type === 'edit' ? dispatch(Actions.closeEditCommandesDialog()) : dispatch(Actions.closeNewCommandesDialog());
    }



    function handleSubmit(event) {
        //event.preventDefault();

        console.log(event);
        if (CommandesDialog.type === 'new') {
            dispatch(Actions.addCommande(form, user.id));
        }
        else {
            dispatch(Actions.updateCommande(form, user.id));
        }
        closeComposeDialog();
    }



    function handleRadioChange(e) {

        setForm(_.set({ ...form }, 'nbrJeton', parseInt(e.target.value)));
    }

    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    return (
        <Dialog
            classes={{
                paper: "m-24"
            }}
            {...CommandesDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {CommandesDialog.type === 'new' ? 'Nouveau Commande' : 'Edit Commande'}
                    </Typography>
                </Toolbar>

            </AppBar>
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
                className="flex flex-col overflow-hidden">
                <DialogContent classes={{ root: "p-24" }}>
                    <div className="flex">
                        <div className="min-w-50 pt-5 pr-5 font-bold">
                            Nombre de jetons
                        </div>

                        <RadioGroupFormsy
                            className=" inline"
                            name="nbrJeton"
                            onChange={handleRadioChange}
                        >
                            <FormControlLabel value="5" checked={form.nbrJeton === 5} control={<Radio />} label="5" />
                            <FormControlLabel value="10" checked={form.nbrJeton === 10} control={<Radio />} label="10" />
                            <FormControlLabel value="20" checked={form.nbrJeton === 20} control={<Radio />} label="20" />

                        </RadioGroupFormsy>

                    </div>

                </DialogContent>

                {CommandesDialog.type === 'new' ? (
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
                            {
                                form.isUse ? '' :
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={!isFormValid}
                                    >
                                        Modifier
                                    </Button>
                            }


                        </DialogActions>
                    )}
            </Formsy>
        </Dialog>
    );
}

export default CommandesDialog;