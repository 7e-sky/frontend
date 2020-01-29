
import agent from 'agent';
import { showMessage } from 'app/store/actions/fuse';
import _ from '@lodash';


export const REQUEST_COMMANDE = '[COMMANDE APP] REQUEST COMMANDE';
export const GET_COMMANDE = '[COMMANDE APP] GET COMMANDE';

export const REQUEST_SUGGESTION = '[COMMANDE APP] REQUEST_SUGGESTION';
export const REQUEST_SOUS_SECTEURS = '[COMMANDE APP] REQUEST_SOUS_SECTEURS';
export const GET_SOUS_SECTEURS = '[COMMANDE APP] GET SOUS_SECTEURS';

export const REQUEST_FOURNISSEUR = '[COMMANDE APP] REQUEST FOURNISSEUR';
export const GET_FOURNISSEUR = '[COMMANDE APP] GET FOURNISSEUR';

export const REQUEST_OFFRES = '[COMMANDE APP] REQUEST OFFRES';
export const GET_OFFRES = '[COMMANDE APP] GET OFFRES';

export const REQUEST_SAVE = '[COMMANDE APP] REQUEST SAVE';
export const SAVE_COMMANDE = '[COMMANDE APP] SAVE COMMANDE';
export const SAVE_SUGGESTION = '[COMMANDE APP] SAVE_SUGGESTION';
export const SAVE_ERROR = '[COMMANDE APP] SAVE ERROR';
export const GET_PAIEMENT = '[COMMANDE APP] GET_PAIEMENT';
export const GET_DUREE = '[COMMANDE APP] GET_DUREE';
export const CLEAN_UP = '[COMMANDE APP] CLEAN_UP';



export function cleanUp() {

    return (dispatch) => dispatch({
        type: CLEAN_UP,
    });
}

export function updateCommande(data,sousSecteurs,offre,mode,duree) {
    
    data.offre =offre['@id'];
    data.sousSecteurs = _.map(sousSecteurs, function (value, key) {
        return value.value;
    });
    data.mode=mode;
    data.duree=duree['@id'];
    const request = agent.put(data['@id'], data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Commande modifiée avec succès' }));

            return dispatch({
                type: SAVE_COMMANDE,
                payload: response.data
            })
        }
        );
    }

}

export function saveCommande(data,sousSecteurs,offre,mode,duree) {
    
    data.offre =offre['@id'];
    data.sousSecteurs = _.map(sousSecteurs, function (value, key) {
        return value.value;
    });
    data.mode=mode;
    data.duree=duree['@id'];
    const request = agent.post('/api/demande_abonnements', data);

    return (dispatch) => {
        dispatch({
            type: REQUEST_SAVE,
        });
        return request.then((response) => {

            dispatch(showMessage({ message: 'Commande sauvegarder' }));

            return dispatch({
                type: SAVE_COMMANDE,
                payload: response.data
            })
        }
        );
    }

}

export function updateSocieteSousSecteurs(sousSecteurs, id_fournisseur) {
    let data={};
    if (sousSecteurs.length > 0 && id_fournisseur)
    data.sousSecteurs = sousSecteurs.map((item => {return item.value}));
    else{
        return;
    }
    return (dispatch, getState) => {

        const request = agent.put(`/api/fournisseurs/${id_fournisseur}`, data);
        dispatch({
            type: REQUEST_SUGGESTION,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: GET_FOURNISSEUR,
                    payload: response.data
                }),
                dispatch({
                    type: SAVE_SUGGESTION
                }),
                dispatch(showMessage({
                    message: 'Activités bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        );
    };

}

export function AddSuggestionSecteur(secteur,sousSecteur,id_user) {
    let data={};
    if (sousSecteur && secteur){
        data.sousSecteur = sousSecteur;
        data.secteur = secteur;
        data.pageSuggestion = "Demande Offre d'abonnement fournisseur";
        data.user = `/api/fournisseurs/${id_user}`
    }
    
    else{
        return;
    }
    return (dispatch, getState) => {

        const request = agent.post(`/api/suggestion_secteurs`, data);
        dispatch({
            type: REQUEST_SUGGESTION,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: SAVE_SUGGESTION
                }),
                dispatch(showMessage({
                    message: 'Votre suggestion a bien été enregistré, un mail vous sera envoyé dès la validation de votre suggestion, nous vous remercions pour votre confiance!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        );
    };

}

export function getFournisseurSousSecteurs(params) {
    const request = agent.get(`/api/fournisseurs/${params}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_FOURNISSEUR,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_FOURNISSEUR,
                payload: response.data
            })
        }

        );
    }

}

export function getSousSecteurs() {
    const request = agent.get('/api/sous_secteurs?parent[exists]=false&pagination=false&properties[]=id&properties[]=name');

    return (dispatch) => {
        dispatch({
            type: REQUEST_SOUS_SECTEURS,
        });
        return request.then((response) => {
            dispatch({
                type: GET_SOUS_SECTEURS,
                payload: response.data['hydra:member']
            })
        });

    }

}

export function getPaiements() {
    const request = agent.get(`/api/paiements`);

    return (dispatch) => {

        return request.then((response) => {
            dispatch({
                type: GET_PAIEMENT,
                payload: response.data['hydra:member']
            })
        });
    }

}

export function getDurees() {
    const request = agent.get(`/api/durees`);

    return (dispatch) => {

        return request.then((response) => {
            dispatch({
                type: GET_DUREE,
                payload: response.data['hydra:member']
            })
        });
    }

}

export function getOffres() {
    const request = agent.get(`/api/offres`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_OFFRES,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_OFFRES,
                payload: response.data['hydra:member']
            })
        }

        );
    }

}

export function getCommande(params) {
    const request = agent.get(`/api/demande_abonnements/${params}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_COMMANDE,
        });
        return request.then((response) => {
            return dispatch({
                type: GET_COMMANDE,
                payload: response.data
            })
        }

        );
    }

}

export function newCommande() {
    const data = {
        offre: null,
        sousSecteurs: []
    };

    return {
        type: GET_COMMANDE,
        payload: data
    }
}





