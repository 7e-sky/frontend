import * as Actions from '../actions';
import FuseUtils from '@fuse/FuseUtils';

const initialState = {
    data: [],
    pageCount: null,
    loading: false,
    searchText: '',
    loadingEdit: false,

};

const childsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.REQUEST_CHILDS:
            {
                return {
                    ...state,
                    loading: true

                };
            }
        case Actions.REQUEST_EDIT:
            {
                return {
                    ...state,
                    loadingEdit: true

                };
            }
        case Actions.EDITED_ACH:
            {
                return {
                    ...state,
                    loadingEdit: false

                };
            }
        case Actions.GET_CHILDS:
            {
                return {
                    ...state,
                    data: action.payload['hydra:member'],
                    pageCount: FuseUtils.hydraPageCount(action.payload),
                    loading: false
                };
            }

        default:
            {
                return state;
            }
    }
};

export default childsReducer;
