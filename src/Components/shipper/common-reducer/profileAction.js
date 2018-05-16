import { asyncActionNames, buildAsyncActions} from '../../../Components/Common/GlobalActionCreators';
import { HTTP } from '../../../services';

const actionNames = asyncActionNames('GET_PROFILE');
const actionCreators = buildAsyncActions(actionNames);


export function getProfile() {
  const url = 'getUser';
  return function(dispatch) {
    // we can dispatch progress
    HTTP('get', url, null,
    {'Authorization': })
      .then((result) => {
        dispatch(actionCreators.success(result.data.data));
      })
      .catch((error) => {
         dispatch(actionCreators.failure(error))
      });
  }
}