import {combineReducers} from 'redux';
import teams from './teams.reducer';
import dialog from './dialog.reducer';
const reducer = combineReducers({
    teams,
    dialog
});

export default reducer;
