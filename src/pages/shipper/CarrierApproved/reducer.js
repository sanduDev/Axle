import { asyncActionNames} from '../../../Components/Common/GlobalActionCreators';
const getAllPastShipmentActionNames = asyncActionNames('GET_APPROVED_CARRIER');

const INITIAL_STATE = { errors: null, authenticated: false, admin_privileges: false, shipments: null, progress: false};

export default function(state = INITIAL_STATE, action) {
	// filter action for ongoing shipment details
	switch(action.type) {
       case getAllPastShipmentActionNames.success:
        return { ...state, errors: null, authenticated: true, carriers:action.payload, progress: false };
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