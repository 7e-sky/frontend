import * as Actions from '../actions';
import _ from '@lodash';

const initialState = {
    pays: null,
    secteurs: null,
    loading: false,
    requestAcheteur: false,
    loadingVille: false,
    villes: null,
    error: null,
    data: null,
    profileReqInProgress: false,
    avatar: null,
    profile_deleted: null,
};

const profileReducer = function (state = initialState, action) {
    switch (action.type) {
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
                    villes: null,
                    loadingVille: true,


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
                    secteurs: _.keyBy(action.payload, 'id'),

                };
            }
        case Actions.GET_PAYS:
            {
                return {
                    ...state,
                    pays: _.keyBy(action.payload, 'id'),
                    loading: false

                };
            }

        case Actions.GET_VILLES:
            {
                return {
                    ...state,
                    villes: _.keyBy(action.payload, 'id'),
                    loadingVille: false,
                };
            }
        case Actions.UPDATE_ACHETEUR:
            {
                return {
                    ...state,
                    loading: false,
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
                    profileReqInProgress: true

                };
            }

        case Actions.UPLOAD_AVATAR:
            {
                return {
                    ...state,
                    avatar: action.payload,
                    profileReqInProgress: false

                };
            }
        case Actions.UPLOAD_ERROR:
            {
                return {
                    ...state,
                    profileReqInProgress: false

                };
            }
        default:
            {
                return state;
            }
    }
};

export default profileReducer;
