import { asyncActionNames } from '../../../Components/Common/GlobalActionCreators';
import { GET_SHIPMENT_BY_DRIVER } from '../common-actions/constants';

const getShipmentByDriverActionNames = asyncActionNames(GET_SHIPMENT_BY_DRIVER);

const INITIAL_STATE = {
  errors: null,
  authenticated: false,
  admin_privileges: false,
  activeShipment: undefined,
  progress: false
};

export default function (state = INITIAL_STATE, action) {
  // filter action for ongoing shipment details
  switch (action.type) {
    case getShipmentByDriverActionNames.success:
      return {
        ...state,
        errors: null,
        authenticated: true,
        activeShipment: action.payload.data,
        progress: false
      };
    case getShipmentByDriverActionNames.failure:
      return {
        ...state,
        errors: action.errors,
        progress: false
      };
    case getShipmentByDriverActionNames.unauth:
      return {
        ...state,
        errors: null,
        authenticated: false,
        activeShipment: undefined,
        progress: false
      }
    case getShipmentByDriverActionNames.progress:
      return {
        ...state,
        progress: true
      }
    case getShipmentByDriverActionNames.privileges:
      return {
        ...state,
        admin_privileges: true
      };
  }

  return state;
}
;
