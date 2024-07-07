import * as Actions from '../actions';
import FuseUtils from '@fuse/FuseUtils';

const initialState = {
    pays: null,
    secteurs: null,
    loading: false,
    requestAcheteur: false,
    villes: null,
    error: null,
    data: null,


    acheteurReqInProgress: false,
    avatar: null,
    acheteur_deleted: null,
    loadingAddVille: false,
    villeAdded: false,
    //DEMANDE D'ACHAT ACHETEUR
    demandes: [],
    totalItems: 0,
    pageCount: null,
    loadingDmd: false,
    parametres: {
        page: 1,
        search: [],
        description: '',
        filter: {
            id: 'created',
            direction: 'desc'
        }
    },
    //BLACK LISTE ACHETEUR
    blacklistes: [],
    totalItemsBl: 0,
    loadingBL: false,
};

const acheteurReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.REQUEST_ACHETEUR_BL:
            {
                return {
                    ...state,
                    loadingBL: true
                };
            }
        case Actions.GET_ACHETEUR_BL:
            {
                return {
                    ...state,
                    totalItemsBl: action.payload['hydra:totalItems'],
                    blacklistes: action.payload['hydra:member'],
                    loadingBL: false
                };
            }
        case Actions.REQUEST_ACHETEUR_DEMANDES:
            {
                return {
                    ...state,
                    loadingDmd: true
                };
            }
        case Actions.GET_ACHETEUR_DEMANDES:
            {
                return {
                    ...state,
                    demandes: action.payload['hydra:member'],
                    totalItems: action.payload['hydra:totalItems'],
                    pageCount: FuseUtils.hydraPageCount(action.payload),
                    loadingDmd: false
                };
            }
        case Actions.REQUEST_ADD_VILLE:
            {
                return {
                    ...state,
                    loadingAddVille: true,
                }
            }
        case Actions.SAVE_ADD_VILLE:
            {
                return {
                    ...state,
                    loadingAddVille: false,
                    villeAdded: true,
                }
            }
        case Actions.SAVE_ERROR_ADD_VILLE:
            {
                return {
                    ...state,
                    loadingAddVille: false,
                }
            }
        case Actions.CLEAN_UP_VILLE:
            {
                return {
                    ...state,
                    villeAdded: false,
                }
            }

        case Actions.CLEAN_UP_ACHETEUR:
            {
                return {
                    ...state,
                    pays: null,
                    secteurs: null,
                    loading: false,
                    requestAcheteur: false,
                    villes: null,
                    error: null,
                    data: null,
                    acheteurReqInProgress: false,
                    avatar: null,
                    acheteur_deleted: null,
                }
            }
        case Actions.REQUEST_UPDATE_ACHETEUR:
        case Actions.REQUEST_PAYS:
            {
                return {
                    ...state,
                    loading: true,
                };
            }
        case Actions.REQUEST_ACHETEUR:
            {
                return {
                    ...state,
                    requestAcheteur: true,
                };
            }
        case Actions.REQUEST_VILLES:
            {
                return {
                    ...state,
                    villes: null

                };
            }
        case Actions.GET_ACHETEUR:
            {
                return {
                    ...state,
                    data: action.payload,
                    requestAcheteur: false,
                    error: null


                };
            }
        case Actions.GET_SECTEURS:
            {
                return {
                    ...state,
                    secteurs: action.payload
                };
            }
        case Actions.GET_PAYS:
            {
                return {
                    ...state,
                    pays: action.payload,
                    loading: false

                };
            }

        case Actions.GET_VILLES:
            {
                return {
                    ...state,
                    villes: [...action.payload, { '@id': '/api/villes/113', name: 'Autre' }],
                };
            }
        case Actions.UPDATE_ACHETEUR:
            {
                return {
                    ...state,
                    loading: false,
                    data: action.payload,
                    error: null

                };
            }
        case Actions.SAVE_ERROR:
            {
                return {
                    ...state,
                    loading: false,
                    error: action.payload,
                    success: false,
                    redirect_success: ''
                };
            }
        case Actions.UPLOAD_REQUEST:
            {
                return {
                    ...state,
                    acheteurReqInProgress: true

                };
            }

        case Actions.UPLOAD_AVATAR:
            {
                return {
                    ...state,
                    avatar: action.payload,
                    acheteurReqInProgress: false

                };
            }
        case Actions.UPLOAD_ERROR:
            {
                return {
                    ...state,
                    acheteurReqInProgress: false

                };
            }
           
         
        case Actions.SET_PARAMETRES_DETAIL:
            {
                return {
                    ...state,
                    parametres: {
                        page: action.parametres.page,
                        search: action.parametres.search,
                        description: action.parametres.description,
                        filter: {
                            id: action.parametres.filter.id,
                            direction: action.parametres.filter.direction
                        }
                    }

                };
            }
        default:
            {
                return state;
            }
    }
};

export default acheteurReducer;
