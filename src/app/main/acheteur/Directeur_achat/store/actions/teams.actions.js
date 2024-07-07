import agent from "agent";
import axios from 'axios';
import FuseUtils from '@fuse/FuseUtils';
import { showMessage } from 'app/store/actions/fuse';
import _ from '@lodash';

export const GET_TEAMS = '[TEAMS APP] GET TEAMS';
export const SET_SEARCH_TEXT = '[TEAMS APP] SET SEARCH TEXT';
export const TOGGLE_IN_SELECTED_TEAMS = '[TEAMS APP] TOGGLE IN SELECTED TEAMS';
export const SELECT_ALL_TEAMS = '[TEAMS APP] SELECT ALL TEAMS';
export const DESELECT_ALL_TEAMS = '[TEAMS APP] DESELECT ALL TEAMS';
export const OPEN_NEW_TEAMS_DIALOG = '[TEAMS APP] OPEN NEW TEAMS DIALOG';
export const CLOSE_NEW_TEAMS_DIALOG = '[TEAMS APP] CLOSE NEW TEAMS DIALOG';
export const OPEN_EDIT_TEAMS_DIALOG = '[TEAMS APP] OPEN EDIT TEAMS DIALOG';
export const CLOSE_EDIT_TEAMS_DIALOG = '[TEAMS APP] CLOSE EDIT TEAMS DIALOG';
export const ADD_TEAM = '[TEAMS APP] ADD TEAM';
export const SAVE_ERROR = '[TEAMS APP] SAVE ERROR';
export const UPDATE_TEAM = '[TEAMS APP] UPDATE TEAM';
export const REMOVE_TEAM = '[TEAMS APP] REMOVE TEAM';
export const UPLOAD_IMAGE = '[TEAMS APP] UPLOAD IMAGE';
export const UPLOAD_REQUEST = '[TEAMS APP] UPLOAD REQUEST';
export const UPLOAD_ERROR = '[TEAMS APP] UPLOAD ERROR';
export const REQUEST_SAVE = '[TEAMS APP APP] REQUEST_SAVE';
export const SAVE_DATA = '[TEAMS APP APP]  SAVE_DATA';
export function getTeams(id) {
    const request = agent.get(`/api/acheteurs/${id}/teams`);

    return (dispatch) =>
        request.then((response) => {

            dispatch({
                type: GET_TEAMS,
                payload: response.data['hydra:member']
            })
        });
}

export function setSearchText(event) {
    return {
        type: SET_SEARCH_TEXT,
        searchText: event.target.value
    }
}

export function toggleInSelectedTeams(TeamsId) {
    return {
        type: TOGGLE_IN_SELECTED_TEAMS,
        TeamsId
    }
}



export function openNewTeamsDialog() {
    return {
        type: OPEN_NEW_TEAMS_DIALOG
    }
}

export function closeNewTeamsDialog() {
    return {
        type: CLOSE_NEW_TEAMS_DIALOG
    }
}

export function openEditTeamsDialog(data) {
    return {
        type: OPEN_EDIT_TEAMS_DIALOG,
        data
    }
}

export function closeEditTeamsDialog() {
    return {
        type: CLOSE_EDIT_TEAMS_DIALOG
    }
}


export function addTeam(newTeam, id) {
     // Définir isactif à 1
     const isactifValue = true; // Assurez-vous que isactif est un booléen

    const data = {
        ...newTeam,
        codepostal: parseInt(newTeam.codepostal, 10),
        avatar: newTeam.avatar ? newTeam.avatar['@id'] : null,
        isactif: isactifValue
    };

    // Envoi de la requête pour ajouter une équipe
    return (dispatch, getState) => {
        const request = agent.post('/api/teams', data);

        return request.then((response) => {
            // Enregistrement des données de l'utilisateur (Acheteur)
            const acheteurData = {
                societe: data.societe,
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
                password: data.password,
                confirmpassword: data.confirmpassword,
                avatar: data.avatar,
                isactif: isactifValue
                // Ajoutez d'autres champs spécifiques à Acheteur si nécessaire
            };

            // Envoi de la requête pour ajouter l'Acheteur
            return agent.post('/api/acheteurs', acheteurData).then((acheteurResponse) => {
                dispatch({
                    type: ADD_TEAM
                });

                dispatch(showMessage({
                    message: 'Acheteur / Master bien ajouté!',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right'
                    },
                    variant: 'success'
                }));

                dispatch(closeNewTeamsDialog());

                // Recharger les équipes après l'ajout
                dispatch(getTeams(id));

                return acheteurResponse;
            });
        }).catch((error) => {
            dispatch({
                type: SAVE_ERROR
            });

            dispatch(showMessage({
                message: _.map(FuseUtils.parseApiErrors(error), (value, key) => `${key}: ${value}`).join(', '),
                autoHideDuration: 6000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right'
                },
                variant: 'error'
            }));

            throw error;
        });
    };
}

/* export function addTeam(newTeam, id) {

    const data = {
        ...newTeam,
        codepostal: parseInt(newTeam.codepostal, 10),
        avatar: newTeam.avatar ? newTeam.avatar['@id'] : null
    }

    return (dispatch, getState) => {


        const request = agent.post('/api/teams', data);
        const acheteurRequest = agent.post('/api/acheteurs', data);


        return request.then((response) =>
            Promise.all([
                acheteurRequest,
                dispatch({
                    type: ADD_TEAM
                }),
                dispatch(showMessage({
                    message: 'Acheteur / Master bien ajouté!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getTeams(id)))
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,

            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return key + ': ' + value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        });
    };
} */


/////////////////////////////////////////////////////////////////

//import agent from '../api/agent'; // Assurez-vous que l'import de l'agent est correctement configuré

/* export function addTeam(newTeam, newUser, id) {
    const teamData = {
        ...newTeam,
        avatar: newTeam.avatar ? newTeam.avatar['@id'] : null
    };

    const userData = {
        ...newUser,
        avatar: newUser.avatar ? newUser.avatar['@id'] : null
    };

    return (dispatch, getState) => {
        return agent.post('/api/teams', teamData)
            .then(teamResponse => {
                dispatch({ type: ADD_TEAM, payload: teamResponse.data });

                dispatch(showMessage({
                    message: 'Acheteur / Master bien ajouté!',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    variant: 'success'
                }));

                console.log('Response from adding team:', teamResponse.data);

                return agent.post('/api/acheteurs', userData); // Envoyer les données de l'utilisateur après l'équipe
            })
            .then(userResponse => {
               
                console.log('Response from adding user:', userResponse.data);

                dispatch(getTeams(id)); // Recharge des équipes après l'ajout

                dispatch(showMessage({
                    message: 'Utilisateur bien ajouté!',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    variant: 'success'
                }));

                return userResponse;
            })
            .catch(error => {
                dispatch({ type: SAVE_ERROR });

                const errorMessage = _.map(FuseUtils.parseApiErrors(error), (value, key) => `${key}: ${value}`).join(', ');
                dispatch(showMessage({
                    message: errorMessage,
                    autoHideDuration: 6000,
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    variant: 'error'
                }));

                console.error('Error during the process:', error);

                throw error; // Répétez l'erreur pour la gestion supérieure si nécessaire
            });
    };
} */



/* export function addTeam(newTeam, newUser, id) {
    const teamData = {
        ...newTeam,
        avatar: newTeam.avatar ? newTeam.avatar['@id'] : null
    };

    const userData = {
        ...newUser,
        avatar: newUser.avatar ? newUser.avatar['@id'] : null
    };

    return async (dispatch, getState) => {
        try {
            const teamResponse = await axios.post('/api/teams', teamData);
            const userResponse = await axios.post('/api/currentUser', userData);

            await Promise.all([
                dispatch({ type: ADD_TEAM, payload: teamResponse.data }),
                dispatch(showMessage({
                    message: 'Acheteur / Master bien ajouté!',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    variant: 'success'
                }))
            ]);

            dispatch(getTeams(id));
        } catch (error) {
            dispatch({ type: SAVE_ERROR });
            dispatch(showMessage({
                message: _.map(FuseUtils.parseApiErrors(error), (value, key) => `${key}: ${value}`).join(', '),
                autoHideDuration: 6000,
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                variant: 'error'
            }));
        }
    };
}
 */

/* export function addTeam(newTeam, id) {

    const data = {
        ...newTeam,
        avatar: newTeam.avatar ? newTeam.avatar['@id'] : null
    }

    return (dispatch, getState) => {


        const request = agent.post('/api/teams', data);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: ADD_TEAM
                }),
                dispatch(showMessage({
                    message: 'Acheteur / Master bien ajouté!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getTeams(id)))
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,

            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return key + ': ' + value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        });
    };
}
 */
export function updateTeam(team, id) {

    const data = {
        ...team,
        avatar: team.avatar ? team.avatar['@id'] : null
    }
    return (dispatch, getState) => {


        const request = agent.put(team['@id'], data);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: UPDATE_TEAM
                }),
                dispatch(showMessage({
                    message: 'Acheteur / Master bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getTeams(id)))
        )
            .catch((error) => {
                dispatch({
                    type: SAVE_ERROR,
                });
                dispatch(
                    showMessage({
                        message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                            return key + ': ' + value;
                        }),//text or html
                        autoHideDuration: 6000,//ms
                        anchorOrigin: {
                            vertical: 'top',//top bottom
                            horizontal: 'right'//left center right
                        },
                        variant: 'error'//success error info warning null
                    }))
            });
    };
}

export function removeTeam(team, id) {
    let UpdateTeam = { del: true }

    return (dispatch, getState) => {

        const request = agent.put(team['@id'], UpdateTeam);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_TEAM
                }),
                dispatch(showMessage({
                    message: 'Acheteur / Master bien supprimé!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getTeams(id)))
        );
    };
}



export function uploadImage(file) {

    return (dispatch, getState) => {

        const formData = new FormData();
        formData.append("file", file);

        const request = agent.post('/api/avatars', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({
            type: UPLOAD_REQUEST
        });
        return request.then((response) =>

            Promise.all([
                (response),
                dispatch({
                    type: UPLOAD_IMAGE,
                    payload: response.data

                }),
                dispatch(showMessage({
                    message: 'Image téléchargée!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        ).catch((error) => {
            dispatch({
                type: UPLOAD_ERROR,
            });
            dispatch(
                showMessage({
                    message: _.map(FuseUtils.parseApiErrors(error), function (value, key) {
                        return key + ': ' + value;
                    }),//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        }

        );
    };
}


