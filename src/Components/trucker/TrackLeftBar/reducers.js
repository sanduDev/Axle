import { asyncActionNames } from '../../../Components/Common/GlobalActionCreators';
import { LIST_ALL_DRIVER } from './constants';

const listAllDriverActionNames = asyncActionNames(LIST_ALL_DRIVER);

const INITIAL_STATE = { errors: null, authenticated: false, admin_privileges: false, drivers: [], progress: false};

export default function(state = INITIAL_STATE, action) {
	// filter action for ongoing shipment details
	switch(action.type) {
       case listAllDriverActionNames.success:
        return { ...state, errors: null, authenticated: true, drivers:action.payload, progress: false };
      case listAllDriverActionNames.failure:
        return { ...state, errors: action.errors, progress: false };
      case listAllDriverActionNames.unauth:
        return { ...state, errors: null, authenticated: false, drivers: [], progress: false}
      case listAllDriverActionNames.progress:
        return { ...state, progress: true}
      case listAllDriverActionNames.privileges:
        return { ...state, admin_privileges: true };
	}

	return state;
};
