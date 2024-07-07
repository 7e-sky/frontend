import agent from "agent";
import FuseUtils from '@fuse/FuseUtils';
import {showMessage} from 'app/store/actions/fuse';
import _ from '@lodash';

export const GET_VILLES = '[VILLES APP] GET VILLES';
export const GET_COMMERCIALS = '[COMMERCIALS APP] GET COMMERCIALS';
export const SET_SEARCH_TEXT = '[COMMERCIALS APP] SET SEARCH TEXT';
export const TOGGLE_IN_SELECTED_COMMERCIALS = '[COMMERCIALS APP] TOGGLE IN SELECTED COMMERCIALS';
export const SELECT_ALL_COMMERCIALS = '[COMMERCIALS APP] SELECT ALL COMMERCIALS';
export const DESELECT_ALL_COMMERCIALS = '[COMMERCIALS APP] DESELECT ALL COMMERCIALS';
export const OPEN_NEW_COMMERCIALS_DIALOG = '[COMMERCIALS APP] OPEN_NEW_COMMERCIALS_DIALOG'; // Modifiez le nom ici
export const CLOSE_NEW_COMMERCIALS_DIALOG = '[COMMERCIALS APP] CLOSE NEW COMMERCIALS DIALOG';
export const OPEN_EDIT_COMMERCIALS_DIALOG = '[COMMERCIALS APP] OPEN EDIT COMMERCIALS DIALOG';
export const CLOSE_EDIT_COMMERCIALS_DIALOG = '[COMMERCIALS APP] CLOSE EDIT COMMERCIALS DIALOG';
export const ADD_COMMERCIAL = '[COMMERCIALS APP] ADD COMMERCIAL';
export const SAVE_ERROR = '[COMMERCIALS APP] SAVE ERROR';
export const UPDATE_COMMERCIAL = '[COMMERCIALS APP] UPDATE COMMERCIAL';
export const REMOVE_COMMERCIAL = '[COMMERCIALS APP] REMOVE COMMERCIAL';
export const STATUT_COMMERCIAL = '[COMMERCIALS APP] STATUT COMMERCIAL';
export const UPLOAD_IMAGE = '[COMMERCIALS APP] UPLOAD IMAGE';
export const UPLOAD_REQUEST = '[COMMERCIALS APP] UPLOAD REQUEST';
export const UPLOAD_ERROR = '[COMMERCIALS APP] UPLOAD ERROR';
export const REQUEST_SAVE = '[COMMERCIALS APP] REQUEST SAVE';
export const REQUEST_COMMERCIALS = '[COMMERCIALS APP] REQUEST_COMMERCIALS';

export function openNewCommercialsDialog() {
    return {
        type: OPEN_NEW_COMMERCIALS_DIALOG
    };
}

export function getVilles()
{
    const request = agent.get('/api/villes');

    return (dispatch) =>
        request.then((response) =>{
            
            dispatch({
                type   : GET_VILLES,
                payload: response.data['hydra:member']
            })
        });
}


export function getCommercials()
{
    const request = agent.get('/api/commercials');

    return (dispatch) => {
        dispatch({
            type   : REQUEST_COMMERCIALS,
        })
        return  request.then((response) =>{
            dispatch({
                type   : GET_COMMERCIALS,
                payload: response.data['hydra:member']
            })
        });
    }
       
}

export function setSearchText(event)
{
    return {
        type      : SET_SEARCH_TEXT,
        searchText: event.target.value
    }
}



export function openEditCommercialsDialog(data)
{
    return {
        type: OPEN_EDIT_COMMERCIALS_DIALOG,
        data
    }
}

export function closeEditCommercialsDialog()
{
    return {
        type: CLOSE_EDIT_COMMERCIALS_DIALOG
    }
}


export function updateCommercial(commercial)
{
   
    let arr = null;
    let avatar = null;
    if (commercial.villes) {
        arr = commercial.villes.map((item => { return item.value }));
    }
    if (commercial.avatar && commercial.avatar.url) {
        avatar = commercial.avatar['@id'];
    }

    const data = {
        ...commercial,
        villes: arr,
        avatar: avatar
    }

    return (dispatch) => {

        dispatch({
            type: REQUEST_SAVE,
        });
     
        const request = agent.put(commercial['@id'],data);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: UPDATE_COMMERCIAL
                }),
                dispatch(showMessage({message: 'Commercial bien modifié!',anchorOrigin: {
                    vertical  : 'top',//top bottom
                    horizontal: 'right'//left center right
                },
                variant: 'success'})),
                dispatch(closeEditCommercialsDialog())
            ]).then(() => dispatch(getCommercials()))
        )
        .catch((error)=>{
            dispatch({
                type: SAVE_ERROR,
                payload: FuseUtils.parseApiErrors(error)
            });
        });
    };
}

export function removeCommercial(commercial)
{
    
    let UpdateCommercial = {del :true,username : commercial.username+'_deleted-'+commercial.id,email : commercial.email+'_deleted-'+commercial.id}
    
    return (dispatch, getState) => {

        
        const request = agent.put(commercial['@id'],UpdateCommercial);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: REMOVE_COMMERCIAL
                }),
                dispatch(showMessage({message: 'Commercial bien supprimé!',anchorOrigin: {
                    vertical  : 'top',//top bottom
                    horizontal: 'right'//left center right
                },
                variant: 'success'}))
            ]).then(() => dispatch(getCommercials()))
        );
    };
}

export function activeAccount(commercial,active)
{
    
    let UpdateCommercial = {isactif : active}
    return (dispatch, getState) => {

        
        const request = agent.put(commercial['@id'],UpdateCommercial);

        return request.then((response) =>
            Promise.all([
                dispatch({
                    type: STATUT_COMMERCIAL
                }),
                dispatch(showMessage({message: 'Statut modifié!',anchorOrigin: {
                    vertical  : 'top',//top bottom
                    horizontal: 'right'//left center right
                },
                variant: 'success'}))
            ]).then(() => dispatch(getCommercials()))
        );
    };
}

export function uploadImage(file)
{
    
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
                dispatch(showMessage({message: 'Image uploaded!',anchorOrigin: {
                    vertical  : 'top',//top bottom
                    horizontal: 'right'//left center right
                },
                variant: 'success'}))
            ])
        ).catch((error)=>{
            dispatch({
                type: UPLOAD_ERROR,
            });
            dispatch(
                showMessage({
                    message     : _.map(FuseUtils.parseApiErrors(error), function(value, key) {
                        return key+': '+value;
                      }) ,//text or html
                    autoHideDuration: 6000,//ms
                    anchorOrigin: {
                        vertical  : 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'error'//success error info warning null
                }))
        }

        );
    };
}


