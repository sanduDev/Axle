import { asyncActionNames, buildAsyncActions} from '../../../Components/Common/GlobalActionCreators';
const getAllPastShipmentActionNames = asyncActionNames('GET_COUNT_REQUESTED_CARRIER');

const INITIAL_STATE = { errors: null, authenticated: false, admin_privileges: false, countCarriers: null, progress: false};

export default function(state = INITIAL_STATE, action) {
	// filter action for ongoing shipment details
	switch(action.type) {
       case getAllPastShipmentActionNames.success:
        return { ...state, errors: null, authenticated: true, countCarriers:action.payload, progress: false };
      case getAllPastShipmentActionNames.failure:
        return { ...state, errors: action.errors, progress: false };
      case getAllPastShipmentActionNames.unauth:
        return { ...state, errors: null, authenticated: false, carriers: null, progress: false}
      case getAllPastShipmentActionNames.progress:
        return { ...state, progress: true}
      case getAllPastShipmentActionNames.privileges:
        return { ...state, admin_privileges: true };
	}

	return state;
};