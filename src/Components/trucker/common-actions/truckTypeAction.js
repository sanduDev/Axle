import { GET_TRUCK_TYPES } from './constants';
import { HTTP } from '../../../services';

import { asyncActionNames, buildAsyncActions } from '../../../Components/Common/GlobalActionCreators';
// creating action names and action creator
const getTruckTypesActionNames = asyncActionNames(GET_TRUCK_TYPES);
const getTruckTypesActionCreators = buildAsyncActions(getTruckTypesActionNames);

export function getAllTruckType(params) {
  let url = 'getAllTruckType';

  return function(dispatch) {
    HTTP('get', url, null)
      .then((result) => {
        dispatch(getTruckTypesActionCreators.success(result.data.data));
      })
      .catch((error) => {
      });
  }
}
