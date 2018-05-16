import {
    HTTP,getStorage
} from '../../../services';
import {
    asyncActionNames,
    buildAsyncActions
} from '../../../Components/Common/GlobalActionCreators';
import jsonToQueryParams from '../../../Components/Common/jsonToQueryParams'
 const searchCarrierName = asyncActionNames('GET_SEARCH');
 const searchActionCreators = buildAsyncActions(searchCarrierName);

export function getUnassignedShipmentList(params) {

  let url = 'approved/'+false;
  url = params ? url + "?" + jsonToQueryParams(params) : url;

  return function (dispatch) {
    HTTP('get', url, null, {
      'authorization': getStorage('token')
    })
      .then((result) => {
        dispatch(searchActionCreators.success(result.data.data));
      })
      .catch((error) => {
        if (error.response) {
            console.log(error)
         // notify.show(error.response.data.message, 'error');
        } else {
             console.log(error)
         // notify.show('something went wrong, please try again', 'error');
        }
      });
  }
}
