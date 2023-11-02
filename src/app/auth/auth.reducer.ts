import { createReducer, on } from '@ngrx/store';
import { Usuario } from '../models/usuario.model';
import * as auth from './auth.actions';


export interface State {
    user: Usuario;
}

export const initialState: State = {
  user: new Usuario('','',''),
}

export const authReducer = createReducer(initialState,
    on(auth.setUser, (state, {user}) => ({ ...state, user: {...user}})),
    on(auth.unSetUser, state => ({ ...state, user: new Usuario('','','')})),
);
