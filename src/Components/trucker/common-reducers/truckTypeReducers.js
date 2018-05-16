import { asyncActionNames } from '../../../Components/Common/GlobalActionCreators';
import { GET_TRUCK_TYPES } from '../common-actions/constants';

const getActiveLoadsActionNames = asyncActionNames(GET_TRUCK_TYPES);

const INITIAL_STATE = {
  errors: null,
  authenticated: false,
  admin_privileges: false,
  truckTypes: [],
  progress: false
};

export default function (state = INITIAL_STATE, action) {
  // filter action for ongoing shipment details
  switch (action.type) {
    case getActiveLoadsActionNames.success:
      return {
        ...state,
        errors: null,
        authenticated: true,
        truckTypes: action.payload.data,
        progress: false
      };
    case getActiveLoadsActionNames.failure:
      return {
        ...state,
        errors: action.errors,
        progress: false
      };
    case getActiveLoadsActionNames.unauth:
      return {
        ...state,
        errors: null,
        authenticated: false,
        truckTypes: null,
        progress: false
      }
    case getActiveLoadsActionNames.progress:
      return {
        ...state,
        progress: true
      }
    case getActiveLoadsActionNames.privileges:
      return {
        ...state,
        admin_privileges: true
      };
  }

  return state;
}
;
