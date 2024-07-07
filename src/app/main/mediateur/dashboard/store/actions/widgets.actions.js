import agent from 'agent';

export const GET_WIDGETS = '[PROJECT DASHBOARD APP] GET WIDGETS';
export const REQUEST_WIDGETS = '[PROJECT DASHBOARD APP] REQUEST WIDGETS';

export const GET_CHARTS = '[PROJECT DASHBOARD APP] GET CHARTS';
export const REQUEST_CHARTS = '[PROJECT DASHBOARD APP] REQUEST CHARTS';

export const GET_BUDGETS = '[PROJECT DASHBOARD APP] GET BUDGETS';
export const REQUEST_BUDGETS = '[PROJECT DASHBOARD APP] REQUEST BUDGETS';

export function getWidgets() {
    const request = agent.get('/api/demandes/widgets');

    return (dispatch) => {
        dispatch({
            type: REQUEST_WIDGETS,
        })
        return request.then((response) =>
            dispatch({
                type: GET_WIDGETS,
                payload: response.data
            })
        );

    }

}

export function getCharts(data) {
    const request = agent.get(`/api/demandes/charts?startDate=${data.startDate}&endDate=${data.endDate}`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_CHARTS,
        })
        return request.then((response) =>
            dispatch({
                type: GET_CHARTS,
                payload: response.data
            })
        );

    }

}

export function getBudgets(data) {
    const request = agent.get(`/api/demandes/budgets?year=${data}`);
    return (dispatch) => {
        dispatch({
            type: REQUEST_BUDGETS,
        })
        return request.then((response) =>
            dispatch({
                type: GET_BUDGETS,
                payload: response.data
            })
        );

    }

}
