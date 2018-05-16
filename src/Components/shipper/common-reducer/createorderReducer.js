import { asyncActionNames} from '../../Common/GlobalActionCreators';
import { CREATE_ORDER } from '../CreateOrder/constants';
const actionNames = asyncActionNames(CREATE_ORDER);

const INITIAL_STATE = { errors: null, authenticated: false, admin_privileges: false, profile: null, progress: false};

export default function (state = INITIAL_STATE, action) {
	switch(action.type) {
       case actionNames.success:
        return { ...state, errors: null, authenticated: true, CreateOrderData:action.payload, progress: false };
      case actionNames.failure:
        return { ...state, errors: action.errors, progress: false };
      case actionNames.unauth:
        return { ...state, errors: null, authenticated: false, CreateOrderData: null, progress: false}
      case actionNames.progress:
        return { ...state, progress: true}
      case actionNames.privileges:
        return { ...state, admin_privileges: true };
	}
	return state;
};