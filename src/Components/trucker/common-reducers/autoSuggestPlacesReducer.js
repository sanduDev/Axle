import { asyncActionNames } from '../../../Components/Common/GlobalActionCreators';
import { AUTO_SUGGEST_PLACES } from '../common-actions/constants';

const autoSuggestPlacesActionNames = asyncActionNames(AUTO_SUGGEST_PLACES);

const INITIAL_STATE = {
  errors: null,
  authenticated: false,
  admin_privileges: false,
  places: [],
  progress: false
};

export default function (state = INITIAL_STATE, action) {
  // filter action for ongoing shipment details
  switch (action.type) {
    case autoSuggestPlacesActionNames.success:
      return {
        ...state,
        errors: null,
        authenticated: true,
        places: action.payload,
        progress: false
      };
    case autoSuggestPlacesActionNames.failure:
      return {
        ...state,
        errors: action.errors,
        progress: false
      };
    case autoSuggestPlacesActionNames.unauth:
      return {
        ...state,
        errors: null,
        authenticated: false,
        places: null,
        progress: false
      }
    case autoSuggestPlacesActionNames.progress:
      return {
        ...state,
        progress: true
      }
    case autoSuggestPlacesActionNames.privileges:
      return {
        ...state,
        admin_privileges: true
      };
  }

  return state;
}
;
