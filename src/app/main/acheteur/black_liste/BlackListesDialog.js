import React, { useEffect, useCallback, useRef, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, Icon, IconButton, Typography, Toolbar, AppBar, DialogTitle, DialogContentText, ListItemText, CircularProgress, Popper, Chip } from '@material-ui/core';
import { useForm } from '@fuse/hooks';
import * as Actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { TextFieldFormsy, CheckboxFormsy } from '@fuse';
import Formsy from 'formsy-react';
import _ from '@lodash';
import Autosuggest from 'react-autosuggest';
import green from '@material-ui/core/colors/green';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Highlighter from "react-highlight-words";

const defaultFormState = {
    raison: '',
    fournisseur: '',
    fournisseurEx:'',
    email: '',
    pays: '',
    ville: '',
    ice: '',
    siret: '',
    OUT: false // Assurez-vous que OUT est initialisé
};

const useStyles = makeStyles(theme => ({
    root: {
        height: 250,
        flexGrow: 1,
    },
    container: {
        position: 'relative',
        width: '100%',
    },

    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    divider: {
        height: theme.spacing(2),
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
}));

function renderSuggestion(suggestion, { query, isHighlighted }) {
    return (
        <MenuItem selected={isHighlighted} component="div" className="z-999" dense={true}>
            <ListItemText
                className="pl-0 "
                primary={
                    <Highlighter
                        highlightClassName="YourHighlightClass"
                        searchWords={[query]}
                        autoEscape={true}
                        textToHighlight={suggestion.societe}
                    />
                }
                secondary={suggestion.firstName + ' ' + suggestion.lastName}
            />
        </MenuItem>

    );

}
function renderInputComponent(inputProps) {
    const { classes, inputRef = () => { }, ref, ...other } = inputProps;
    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
            }}
            {...other}
        />
    );
}
function BlackListesDialog(props) {

    const classes = useStyles();
    const dispatch = useDispatch();
    const BlackListesDialog = useSelector(({ blackListesApp }) => blackListesApp.blackListes.blackListesDialog);
    const loading = useSelector(({ blackListesApp }) => blackListesApp.blackListes.loading);
    const searchFournisseur = useSelector(({ blackListesApp }) => blackListesApp.searchFournisseur);
    const [fournisseur, setFournisseur] = React.useState(null);
    const user = useSelector(({ auth }) => auth.user);
    const { form, handleChange, setForm } = useForm(defaultFormState);
    const suggestionsNode = useRef(null);
    const popperNode = useRef(null);

    const [isFormValid, setIsFormValid] = useState(false);
    const formRef = useRef(null);


    const initDialog = useCallback(
        () => {
            /**
             * Dialog type: 'edit'
             */
            if (BlackListesDialog.type === 'edit' && BlackListesDialog.data) {
                setForm({ ...BlackListesDialog.data });
                setFournisseur(BlackListesDialog.data.fournisseur);
                setForm(_.set({ ...BlackListesDialog.data }, 'fournisseur', BlackListesDialog.data.fournisseur['@id']));
            }

            /**
             * Dialog type: 'new'
             */
            if (BlackListesDialog.type === 'new') {
                setForm({
                    ...defaultFormState,
                    ...BlackListesDialog.data,
                });
            }
        },
        [BlackListesDialog.data, BlackListesDialog.type, setForm],
    );

    useEffect(() => {
        /**
         * After Dialog Open
         */
        if (BlackListesDialog.props.open) {
            initDialog();
        }

    }, [BlackListesDialog.props.open, initDialog]);



    function closeComposeDialog() {
        BlackListesDialog.type === 'edit' ? dispatch(Actions.closeEditBlackListesDialog()) : dispatch(Actions.closeNewBlackListesDialog());
    }


    function handleCheckBoxChange(e, name) {

        setForm(_.set({ ...form }, name, e.target.checked));
    }
    function handleSubmit(event) {
        // Supprimer event.preventDefault() pour permettre à la sauvegarde de se produire normalement
    
        // Récupérer les valeurs sélectionnées du pays et de la ville
        const pays = selectedPays;
        const ville = selectedVille;
       // Déterminer ICE ou SIRET en fonction du pays sélectionné
    let iceOrSiret = '';
    if (pays === 'Maroc') {
        iceOrSiret = form.ice;
    } else {
        iceOrSiret = form.siret;
    }
        

    
        // Créer un nouvel objet form avec les données du formulaire et les valeurs sélectionnées du pays et de la ville
        const updatedForm = {
            ...form,
            pays: pays,
            ville: ville,
            ice: iceOrSiret // Utiliser ICE ou SIRET en fonction du pays sélectionné
            
        };
    
        // Envoyer l'objet updatedForm à l'action addBlackListe
        if (BlackListesDialog.type === 'new') {
            dispatch(Actions.addBlackListe(updatedForm, user.id));
        }
        else {
            dispatch(Actions.updateBlackListe(updatedForm, user.id));
        }
    
        // Fermer le dialogue après l'ajout ou la mise à jour
        closeComposeDialog();
    }
    

    function handleRemove() {

        dispatch(Actions.removeBlackListe(form, user.id));
        dispatch(Actions.closeDialog())
        closeComposeDialog();
    }


    function disableButton() {
        setIsFormValid(false);
    }

    function enableButton() {
        setIsFormValid(true);
    }

    function handleChangeSearch(event) {
        dispatch(Actions.setGlobalSearchText(event))
    }
    function showSearch() {
        dispatch(Actions.showSearch());
    }

    function hideSearch() {
        dispatch(Actions.hideSearch());
    }


    function handleSuggestionsFetchRequested({ value }) {
        if (value.trim().length > 1) {
            dispatch(Actions.loadSuggestions(value.trim()));
            // Fake an AJAX call
        }
    }
    function handleSuggestionsClearRequested() {
        dispatch(Actions.cleanUp());
    }
    const autosuggestProps = {
        renderInputComponent,
        highlightFirstSuggestion: true,
        suggestions: searchFournisseur.suggestions,
        onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        renderSuggestion
    };

    function handleDelete() {
        setFournisseur(null);
        setForm(_.set({ ...form }, 'fournisseur', null))
    }


    // États pour stocker les valeurs sélectionnées du pays et de la ville
    const [selectedPays, setSelectedPays] = useState('');
    const [selectedProblem, setSelectedProblem] = useState('');
    const [selectedVille, setSelectedVille] = useState('');
    const [inputLabel, setInputLabel] = useState('');


    // Gérer le changement de sélection du pays
    const handlePaysChange = (event) => {
        setSelectedPays(event.target.value);
        // Réinitialiser la sélection de la ville lorsque le pays est changé
        setSelectedVille('');
        // Déterminer le label de la zone de texte en fonction du pays sélectionné
        if (event.target.value !== 'Maroc') {
            setInputLabel('SIRET');
        } else {
            setInputLabel('ICE');
        }
        // Réinitialiser les valeurs de ICE et SIRET lorsque le pays est changé
         setForm({ ...form, ice: '', siret: '' });
    };

    // État pour stocker le type de numéro en fonction du pays sélectionné
const [numeroType, setNumeroType] = useState('');

// Fonction pour déterminer le type de numéro (ICE ou SIRET) en fonction du pays sélectionné
const determineNumeroType = (pays) => {
    if (pays === 'Maroc') {
        setNumeroType('ICE');
    } else {
        setNumeroType('SIRET');
    }
};

// Effet pour mettre à jour le type de numéro lorsque le pays est sélectionné
useEffect(() => {
    determineNumeroType(selectedPays);
}, [selectedPays]);
    // Tableaux de données factices pour les options de sélection des pays et des villes
    const paysOptions = ['France', 'Allemagne', 'Espagne','Maroc'];
    const villesParPays = {
        'France': ['Paris', 'Marseille', 'Lyon'],
        'Allemagne': ['Berlin', 'Hambourg', 'Munich'],
        'Espagne': ['Madrid', 'Barcelone', 'Valence'],
        'Maroc': ['Casablanca', 'Rabat', 'Fes']
    };
    const problemOptions = [
        "Problème de communication",
        "Retard de livraison",
        "Non-conformité",
        "Litiges sur les paiements",
        "Augmentation des coûts"
    ];

    const handleProblemChange = (event) => {
        setSelectedProblem(event.target.value);
    };
    // Gérer le changement de sélection du pays
   /*  const handlePaysChange = (event) => {
        setSelectedPays(event.target.value);
        // Réinitialiser la sélection de la ville lorsque le pays est changé
        setSelectedVille('');
    }; */

    // Gérer le changement de sélection de la ville
    const handleVilleChange = (event) => {
        setSelectedVille(event.target.value);
         // Réinitialiser les valeurs de ICE et SIRET lorsque la ville est changée
    setForm({ ...form, ice: '', siret: '' });
    };
    function handleCheckBoxChange(e) {
        // Mettre à jour l'état de la case à cocher et exécuter d'autres logiques si nécessaire
        setForm(_.set({ ...form }, 'OUT', e.target.checked));
        // Exemple: masquer la zone de recherche du fournisseur si la case est cochée
        if (e.target.checked) {
            hideSearch();
        } else {
            showSearch();
        }
    }

    return (
        <Dialog
            classes={{
                paper: "m-24 overflow-visible"
            }}
            {...BlackListesDialog.props}
            onClose={closeComposeDialog}
            fullWidth
            maxWidth="xs"
        >

            <AppBar position="static" elevation={1}>
                <Toolbar className="flex w-full">
                    <Typography variant="subtitle1" color="inherit">
                        {BlackListesDialog.type === 'new' ? 'Nouveau Fournisseur à BlackListé' : 'Editer BlackListe'}
                    </Typography>
                </Toolbar>

            </AppBar>
            <Formsy
                onValidSubmit={handleSubmit}
                onValid={enableButton}
                onInvalid={disableButton}
                ref={formRef}
                className="flex flex-col overflow-visible">
                <DialogContent classes={{ root: "p-24 overflow-visible" }}>
                {!form.OUT && (
                    <div className="flex">
                <h5>Pour ajouter à cette liste un fournisseur hors liste, veuillez saisir <span style={{ color: 'red' }}>Fournisseur externe</span> dans la barre de recherche.</h5>
              
               </div>
               
                )}
                 <br></br>
                {!form.OUT &&  (     
                            
                <div className="flex">
                    
                        <div className="min-w-48 pt-20">
                            <Icon color="action">work</Icon>
                        </div>
                       
                        <div className="w-full" ref={popperNode}>
                            <Autosuggest
                            
                                {...autosuggestProps}
                                getSuggestionValue={suggestion => suggestion.societe}
                                onSuggestionSelected={(event, { suggestion, method }) => {
                                    if (method === "enter") {
                                        event.preventDefault();
                                    }
                                    setFournisseur(suggestion);
                                    setForm(_.set({ ...form }, 'fournisseur', suggestion['@id']))
                                    hideSearch();
                                }}
                                required
                                inputProps={{
                                    classes,
                                    label: 'Fournisseur',
                                    placeholder: "Cherchez le Fournisseur à blacklisté",
                                    value: searchFournisseur.searchText,
                                    variant: "outlined",
                                    name: "fournisseur",
                                    onChange: handleChangeSearch,
                                    onFocus: showSearch,
                                    InputLabelProps: {
                                        shrink: true,
                                    }

                                }}
                                theme={{
                                    container: classes.container,
                                    suggestionsContainerOpen: classes.suggestionsContainerOpen,
                                    suggestionsList: classes.suggestionsList,
                                    suggestion: classes.suggestion,
                                }}
                                renderSuggestionsContainer={options => (
                                    <Popper
                                        anchorEl={popperNode.current}
                                        open={Boolean(options.children) || searchFournisseur.noSuggestions || searchFournisseur.loading}
                                        popperOptions={{ positionFixed: true }}
                                        className="z-9999"
                                    >
                                        <div ref={suggestionsNode}>
                                            <Paper
                                                elevation={1}
                                                square
                                                {...options.containerProps}
                                                style={{ width: popperNode.current ? popperNode.current.clientWidth : null }}
                                            >
                                                {options.children}
                                                {searchFournisseur.noSuggestions && (
                                                    <Typography className="px-16 py-12">
                                                        Aucun résultat..
                                                    </Typography>
                                                )}
                                                {searchFournisseur.loading && (
                                                    <div className="px-16 py-12 text-center">
                                                        <CircularProgress color="secondary" /> <br /> Chargement ...
                                                    </div>
                                                )}
                                            </Paper>
                                        </div>
                                    </Popper>
                                )}
                            />

                        </div>

                       
                    </div>
                     )}
                     
                    {
                        fournisseur &&

                        <Chip
                            label={fournisseur.societe}
                            onDelete={handleDelete}
                            className="mt-8 ml-48"
                        />

                    }
                        <div className="flex">
                                <div className="min-w-48 ">
                                </div>
                                <CheckboxFormsy
                className="mb-24"
                name="OUT"  
                checked={form.OUT}
                label={form.OUT ? "Fournisseur listé" : "Fournisseur Hors liste"}
                onChange={handleCheckBoxChange}
                fullWidth
            />
                    </div>

                    
                    {!form.OUT && (
                        
                    <div className="flex">

                       {/* Sélection du problème */}
              <select value={selectedProblem} onChange={handleProblemChange}>
                <option value="">Sélectionnez un Raison</option>
                {problemOptions.map((problem, index) => (
                    <option key={index} value={problem}>{problem}</option>
                ))}
            </select> 
            
            </div>
                    )}
              {!form.OUT && (
            <div className="flex">
                    <div className="min-w-48 pt-20">
                        <Icon color="action">chat</Icon>
                    </div>
                        
                    <TextFieldFormsy
                        className="mb-24 mt-24"
                        label="Autres"
                        id="raison"
                        name="raison"
                        value={form.raison}
                        onChange={handleChange}
                        variant="outlined"
                        validations={{
                            minLength: 6
                        }}
                        validationErrors={{
                            minLength: 'La longueur minimale des caractères est de 6'
                        }}
                        required
                        multiline
                        rows="4"
                        fullWidth
                    />
                    
                    
                </div>
                
                      )}
                   

                    


                    {form.OUT && (
        <>
            <div  className="flex" style={{ marginTop: '-15px' }}>

             

            {/* Sélection du pays */}
            <select value={selectedPays} onChange={handlePaysChange}>
                <option value="">Sélectionnez un pays</option>
                {paysOptions.map((pays, index) => (
                    <option key={index} value={pays}>{pays}</option>
                ))}
            </select>

            {/* Sélection de la ville */}
            {selectedPays && (
                <select value={selectedVille} onChange={handleVilleChange}>
                    <option value="">Sélectionnez une ville</option>
                    {villesParPays[selectedPays].map((ville, index) => (
                        <option key={index} value={ville}>{ville}</option>
                    ))}
                </select>
            )}

            {/* Afficher la sélection actuelle */}
            {selectedPays && selectedVille && (
                <div>
                    <p>Pays sélectionné : {selectedPays}</p>
                    <p>Ville sélectionnée : {selectedVille}</p>
                </div>
            )}
        </div>
        <div className="flex" style={{ marginTop: '-15px' }}>
                {/* Afficher la zone de texte correspondante au pays sélectionné */}
                <TextFieldFormsy
    className="mb-24 mt-24"
    label={numeroType}
    id={numeroType.toLowerCase()} // Utilisez le type de numéro comme ID
    name={numeroType.toLowerCase()} // Utilisez le type de numéro comme nom
    value={form[numeroType.toLowerCase()]} // Accédez à la valeur du type de numéro dans le formulaire
    onChange={handleChange}
    variant="outlined"
    fullWidth
/>
            </div>
            <div className="flex" style={{ marginTop: '-15px' }}>
                {/* Première zone de texte */}
                <TextFieldFormsy
                    className="mb-24 mt-24"
                    label="Fournisseur *"
                    id="fournisseurEx"
                    name="fournisseurEx"
                    value={form.fournisseurEx}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                />
         
            </div>
            <div className="flex" style={{ marginTop: '-15px' }}>
                {/* Première zone de texte */}
                <TextFieldFormsy
                    className="mb-24 mt-24"
                    label="Email *"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                />
         
            </div>
            <TextFieldFormsy
                    className="mb-24 mt-24"
                    label="raison *"
                    id="raison"
                    name="raison"
                    value={form.raison}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                />
          

         
         
        
            
        </>
    )}

                    
                    {
                        BlackListesDialog.type === 'edit' ?
                            <div className="flex">
                                <div className="min-w-48 ">
                                </div>
                                <CheckboxFormsy
                                    className="mb-24 "
                                    name="etat"
                                    value={form.etat}
                                    label="Blacklister"
                                    onChange={(e) => handleCheckBoxChange(e, 'etat')}
                                    fullWidth
                                />
                            </div>
                            : ''
                    }
            
                      
                         
                      

                </DialogContent>

                {BlackListesDialog.type === 'new' ? (
                    <DialogActions className="pl-16">
                        <Button onClick={() => dispatch(Actions.closeNewBlackListesDialog())} color="primary">
                            Annuler
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={!isFormValid || !fournisseur || loading}
                        >
                            Ajouter
                            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </Button>
                    </DialogActions>
                ) : (
                        <DialogActions className="justify-between pl-16">
                            <Button onClick={() => dispatch(Actions.closeEditBlackListesDialog())} color="primary">
                                Annuler
                                                    </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={!isFormValid || !fournisseur || loading}
                            >
                                Modifier
                                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </Button>
                            <IconButton
                                onClick={() => dispatch(Actions.openDialog({
                                    children: (
                                        <React.Fragment>
                                            <DialogTitle id="alert-dialog-title">Suppression</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Voulez vous vraiment supprimer cet enregistrement ?
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => dispatch(Actions.closeDialog())} color="primary">
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

export default BlackListesDialog;
