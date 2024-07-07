import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';
import { showMessage } from 'app/store/actions/fuse';
import _ from '@lodash';

export const REQUEST_ACHETEUR = '[PROFILE ACHETEUR APP] REQUEST ACHETEUR';
export const GET_ACHETEUR = '[PROFILE ACHETEUR APP] GET ACHETEUR';
export const GET_PAYS = '[PROFILE ACHETEUR APP] GET PAYS';
export const GET_VILLES = '[PROFILE ACHETEUR APP] GET VILLES';
export const REQUEST_PAYS = '[PROFILE ACHETEUR APP] REQUEST PAYS';
export const REQUEST_VILLES = '[PROFILE ACHETEUR APP] REQUEST VILLES';
export const SAVE_ERROR = '[PROFILE ACHETEUR APP] SAVE ERROR';
export const GET_SECTEURS = '[PROFILE ACHETEUR APP] GET SECTEURS';
export const UPDATE_ACHETEUR = '[PROFILE ACHETEUR APP] UPDATE ACHETEUR';
export const REQUEST_UPDATE_ACHETEUR = '[PROFILE ACHETEUR APP] REQUEST UPDATE_ACHETEUR';

export const UPLOAD_AVATAR = '[PROFILE ACHETEUR APP] UPLOAD AVATAR';
export const UPLOAD_REQUEST = '[PROFILE ACHETEUR APP] UPLOAD REQUEST';
export const UPLOAD_ERROR = '[PROFILE ACHETEUR APP] UPLOAD ERROR';

export function getProfile(id_acheteur) {
    const request = agent.get(`/api/acheteurs/${id_acheteur}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ACHETEUR,
        });
        return request.then((response) => {

            dispatch({
                type: GET_ACHETEUR,
                payload: response.data
            })
        });

    }

}
export function getPays() {
    const request = agent.get('/api/pays?pagination=false&props[]=id&props[]=name');

    return (dispatch) => {
        dispatch({
            type: REQUEST_PAYS,
        });
        return request.then((response) => {

            dispatch({
                type: GET_PAYS,
                payload: response.data['hydra:member']
            })
        });

    }

}

export function getVilles(pays_id) {
    const request = agent.get(`${pays_id}/villes?pagination=false&props[]=id&props[]=name`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_VILLES,
        });
        return request.then((response) => {

            dispatch({
                type: GET_VILLES,
                payload: response.data['hydra:member']
            })
        });

    }

}

export function getSecteurs() {
    const request = agent.get('/api/secteurs?pagination=false&props[]=id&props[]=name');

    return (dispatch) => {

        return request.then((response) => {

            dispatch({
                type: GET_SECTEURS,
                payload: response.data['hydra:member']
            })
        });

    }

}



export function updateSocieteInfo(data, id_acheteur) {


    if (data.pays.label !== 'Maroc') {
        data.ice = null;
    }
    data.pays = data.pays.value;
    data.ville =data.ville.value;
    data.secteur = data.secteur.value;

    if (data.codepostal === null) {
        delete data.codepostal;
    } else {
        data.codepostal = parseInt(data.codepostal);
    }



    return (dispatch, getState) => {

        const request = agent.put(`/api/acheteurs/${id_acheteur}`, data);
        dispatch({
            type: REQUEST_UPDATE_ACHETEUR,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: UPDATE_ACHETEUR,
                    payload: response.data
                }),
                dispatch(showMessage({
                    message: 'Bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        ).then(() => dispatch(getProfile(id_acheteur)))
            .catch((error) => {
                dispatch({
                    type: SAVE_ERROR,
                    payload: FuseUtils.parseApiErrors(error)
                });
            });
    };

}


export function updateUserInfo(data, id_acheteur) {



    return (dispatch, getState) => {

        const request = agent.put(`/api/acheteurs/${id_acheteur}`, data);
        dispatch({
            type: REQUEST_UPDATE_ACHETEUR,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: UPDATE_ACHETEUR,
                    payload: response.data
                }),
                dispatch(showMessage({
                    message: 'Bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        ).then(() => dispatch(getProfile(id_acheteur)))
            .catch((error) => {
                dispatch({
                    type: SAVE_ERROR,
                    payload: FuseUtils.parseApiErrors(error)
                });
            });
    };

}

export function updatePassword(data, id_acheteur) {



    return (dispatch, getState) => {

        const request = agent.put(`/api/users/${id_acheteur}/reset-password`, data);
        dispatch({
            type: REQUEST_UPDATE_ACHETEUR,
        });
        return request.then((response) => {

            if (response.data.user) {
                this.setSession(response.data.token);
            }
            Promise.all([
                dispatch({
                    type: UPDATE_ACHETEUR,
                    payload: response.data
                }),

                dispatch(showMessage({
                    message: 'Bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        }
        ).then(() => dispatch(getProfile(id_acheteur)))
            .catch((error) => {
                dispatch({
                    type: SAVE_ERROR,
                    payload: FuseUtils.parseApiErrors(error)
                });
            });
    };

}
export function setSession(access_token) {
    if (access_token) {
        localStorage.setItem('jwt_access_token', access_token);
        agent.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;

    }
    else {
        localStorage.removeItem('jwt_access_token');
        delete agent.defaults.headers.common['Authorization'];
    }
};


export function uploadAvatar(file, id_acheteur) {

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
                    type: UPLOAD_AVATAR,
                    payload: response.data

                }),
                dispatch(updateUserAvatar({ avatar: response.data['@id'] }, id_acheteur))
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

export function updateUserAvatar(data, id_acheteur) {



    return (dispatch, getState) => {

        const request = agent.put(`/api/acheteurs/${id_acheteur}`, data);
        dispatch({
            type: REQUEST_UPDATE_ACHETEUR,
        });
        return request.then((response) =>

            Promise.all([
                dispatch({
                    type: UPDATE_ACHETEUR,
                    payload: response.data
                }),
                dispatch(showMessage({
                    message: 'Bien modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ])
        ).catch((error) => {
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    };

}

