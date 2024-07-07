import { combineReducers } from 'redux';
import childs from './childs.reducer';
import dialog from './dialog.reducer';

const reducer = combineReducers({
    childs,
    dialog,
});

export default reducer;
