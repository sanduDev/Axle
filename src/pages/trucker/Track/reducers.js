import { asyncActionNames, buildAsyncActions } from '../../../Components/Common/GlobalActionCreators';
import { GET_ACTIVE_LOADS } from './constants';

const getActiveLoadsActionNames = asyncActionNames(GET_ACTIVE_LOADS);

const INITIAL_STATE = { errors: null, authenticated: false, admin_privileges: false, shipments: [], progress: false };

export default function (state = INITIAL_STATE, action) {
  // filter action for ongoing shipment details
  switch (action.type) {
    case getActiveLoadsActionNames.success:
      return { ...state, errors: null, authenticated: true, shipments: action.payload, progress: false };
    case getActiveLoadsActionNames.failure:
      return { ...state, errors: action.errors, progress: false };
    case getActiveLoadsActionNames.unauth:
      return { ...state, errors: null, authenticated: false, shipments: null, progress: false }
    case getActiveLoadsActionNames.progress:
      return { ...state, progress: true }
    case getActiveLoadsActionNames.privileges:
      return { ...state, admin_privileges: true };
  }

  return state;
};
