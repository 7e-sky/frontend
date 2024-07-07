import * as Actions from '../actions';

const initialState = {
    data: [],
    charts: [],
    budgets: [],
    loading: false,
    loadingCharts: false,
    loadingBudgets: false,
    loadingTeams: false,
    teamPotentiels: false,
    loadingTeamPotentiels: false,
};

const widgetsReducer = function (state = initialState, action) {
    switch (action.type) {
        case Actions.REQUEST_WIDGETS:
            return {
                ...state,
                data: [],
                loading: true
            };
        case Actions.GET_WIDGETS:
            return {
                ...state,
                data: action.payload,
                loading: false
            };
        case Actions.REQUEST_CHARTS:
            return {
                ...state,
                charts: [],
                loadingCharts: true
            };
        case Actions.GET_CHARTS:
            return {
                ...state,
                charts: action.payload,
                loadingCharts: false
            };
        case Actions.REQUEST_BUDGETS:
            return {
                ...state,
                budgets: [],
                loadingBudgets: true
            };
        case Actions.GET_BUDGETS:
            return {
                ...state,
                budgets: action.payload,
                loadingBudgets: false
            };
            case Actions.REQUEST_POTENTIEL:
                return {
                    ...state,
                    teams: [],
                    loadingTeams: true
                };
            case Actions.GET_POTENTIEL:
                return {
                    ...state,
                    teams: action.payload,
                    loadingTeams: false
                };
            case Actions.REQUEST_TEAM_POTENTIEL:
                return {
                    ...state,
                    teamPotentiels: [],
                    loadingTeamPotentiels: true
                };
            case Actions.GET_TEAM_POTENTIEL:
                return {
                    ...state,
                    teamPotentiels: action.payload,
                    loadingTeamPotentiels: false
                };
        default:
            return state;
    }
};

export default widgetsReducer;
