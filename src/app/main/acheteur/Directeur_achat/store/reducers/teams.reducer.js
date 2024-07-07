import * as Actions from '../actions';

const initialState = {
    entities: null,
    searchText: '',
    selectedTeamsIds: [],
    routeParams: {},
    teamsDialog: {
        type: 'new',
        props: {
            open: false
        },
        data: null
    },
    avatar: null,
    imageReqInProgress: false
};

const teamsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.GET_TEAMS:
            return {
                ...state,
                entities: action.payload
            };
        case Actions.SET_SEARCH_TEXT:
            return {
                ...state,
                searchText: action.searchText
            };
        case Actions.OPEN_NEW_TEAMS_DIALOG:
            return {
                ...state,
                teamsDialog: {
                    type: 'new',
                    props: {
                        open: true
                    },
                    data: null
                }
            };
        case Actions.CLOSE_NEW_TEAMS_DIALOG:
            return {
                ...state,
                teamsDialog: {
                    type: 'new',
                    props: {
                        open: false
                    },
                    data: null
                }
            };
        case Actions.OPEN_EDIT_TEAMS_DIALOG:
            return {
                ...state,
                teamsDialog: {
                    type: 'edit',
                    props: {
                        open: true
                    },
                    data: action.data
                }
            };
        case Actions.CLOSE_EDIT_TEAMS_DIALOG:
            return {
                ...state,
                teamsDialog: {
                    type: 'edit',
                    props: {
                        open: false
                    },
                    data: null
                }
            };
        case Actions.UPLOAD_REQUEST:
            return {
                ...state,
                imageReqInProgress: true
            };
        case Actions.UPLOAD_IMAGE:
            return {
                ...state,
                avatar: action.payload,
                imageReqInProgress: false
            };
        case Actions.UPLOAD_ERROR:
            return {
                ...state,
                imageReqInProgress: false
            };
            case Actions.REQUEST_SAVE:
      return {
        ...state,
        loading: true,
      };
    case Actions.SAVE_DATA:
      return {
        ...state,
        loading: false,
      };
        default:
            return state;
    }
};

export default teamsReducer;
