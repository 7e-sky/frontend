import { showMessage } from 'app/store/actions/fuse';
import agent from "agent";

export const REQUEST_ACHETEURS = '[ACHETEURS ADMIN APP] REQUEST ACHETEURS';
export const SET_PARAMETRES_DATA = '[ACHETEURS ADMIN APP] SET PARAMETRES DATA';
export const GET_ACHETEURS = '[ACHETEURS ADMIN APP] GET ACHETEURS';
export const OPEN_NEW_ACHETEURS_DIALOG = '[ACHETEURS ADMIN APP] OPEN NEW ACHETEURS DIALOG';
export const SET_ACHETEURS_SEARCH_TEXT = '[ACHETEURS ADMIN APP] SET ACHETEURS SEARCH TEXT';


export function openNewAcheteursDialog() {
    return {
        type: OPEN_NEW_ACHETEURS_DIALOG
    }
}
export function getAcheteurs(parametres) {
    var search = '';
    if (parametres.search.length > 0) {
        parametres.search.map((item) => (
            item.value && (
                item.id === 'created' ? (search += '&' + item.id + '[after]=' + item.value) :(search += '&' + item.id + '=' + item.value))
        ));
    }
    const request = agent.get(`/api/acheteurs?page=${parametres.page}${search}&order[${parametres.filter.id}]=${parametres.filter.direction}`);

    return (dispatch) => {
        dispatch({
            type: REQUEST_ACHETEURS,
        });
        return request.then((response) =>
            dispatch({
                type: GET_ACHETEURS,
                payload: response.data
            })
        );
    }

}
export function activeAccount(acheteur, active, parametres) {

    let Updateacheteur = { isactif: active }
    return (dispatch) => {
        dispatch({
            type: REQUEST_ACHETEURS,
        });
        const request = agent.put(acheteur['@id'], Updateacheteur);
        return request.then((response) =>
            Promise.all([
                dispatch(showMessage({
                    message: 'Statut modifié!', anchorOrigin: {
                        vertical: 'top',//top bottom
                        horizontal: 'right'//left center right
                    },
                    variant: 'success'
                }))
            ]).then(() => dispatch(getAcheteurs(parametres)))
        );
    };
}

export function setParametresData(parametres) {
    return {
        type: SET_PARAMETRES_DATA,
        parametres
    }
}

export function setAcheteursSearchText(event) {
    return {
        type: SET_ACHETEURS_SEARCH_TEXT,
        searchText: event.target.value
    }
}



