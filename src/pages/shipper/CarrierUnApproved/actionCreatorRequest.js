import {
    HTTP,getStorage
} from '../../../services';
import {
    asyncActionNames,
    buildAsyncActions
} from '../../../Components/Common/GlobalActionCreators';
import jsonToQueryParams from '../../../Components/Common/jsonToQueryParams';
const requestCarrierName = asyncActionNames('GET_REQUESTED_CARRIER');
const requestCarrierNameActionCreators = buildAsyncActions(requestCarrierName);

export function getRequestedCarrier(params) {
    let url = 'carrierRequest';
      url = params ? url + "?" + jsonToQueryParams(params) : url;
    return function (dispatch) {
        HTTP('get', url, null, {
            'Authorization':  getStorage('token')
        })
            .then((result) => {
                dispatch(requestCarrierNameActionCreators.success(result.data.data));
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
}


export function handleSubmitcarrierList(file) {
    let url = 'uploadCarrierList';
    let data = new FormData();
    data.append('bulkCarrier', file);
    return function (dispatch) {
        HTTP('post', url, data,
        { 'Authorization': getStorage('token'), 'Content-Type': `multipart/form-data; boundary=${data._boundary}` })
        .then((result) => {
            console.log(result.data.data)
            dispatch(requestCarrierNameActionCreators.success(result.data.data));
        })
        .catch((error) => {
            console.log(error)
            dispatch(requestCarrierNameActionCreators.failure(error))
        }); 
    }
}