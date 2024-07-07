import * as Actions from '../actions';

const initialState = {
    data: [],
    charts: [],
    budgets: [],
    loading: false,
    loadingCharts: false,
    loadingBudgets: false,
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
        default:
            return state;
    }
};

export default widgetsReducer;
