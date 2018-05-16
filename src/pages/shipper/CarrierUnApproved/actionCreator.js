import {
    HTTP,getStorage
} from '../../../services';
import jsonToQueryParams from '../../../Components/Common/jsonToQueryParams';
import {
    asyncActionNames,
    buildAsyncActions
} from '../../../Components/Common/GlobalActionCreators';
import PubNub from 'pubnub';

let pubnub = new PubNub({
  publishKey: 'pub-c-aaf6786d-526e-454a-8cb5-582e085f67a6',
  subscribeKey: 'sub-c-3c3d483c-75b2-11e7-8ce4-0619f8945a4f'
});
// creating action names and action creator
const getAllPastShipmentActionNames = asyncActionNames('GET_UNAPPROVED_CARRIER');
const getAllPastShipmentActionCreators = buildAsyncActions(getAllPastShipmentActionNames);

const approveCarrierName = asyncActionNames('SAVE_APPROVED_CARRIER');
const approveCarrierNameActionCreators = buildAsyncActions(approveCarrierName);

export function getUnApprovedCarrier(params) {
    let url = 'approved/false';
  url = params ? url + "?" + jsonToQueryParams(params) : url;
 //console.log(getStorage('token'));
    return function (dispatch) {
        HTTP('get', url, null, {
            'authorization': getStorage('token')
        })
            .then((result) => {
                dispatch(getAllPastShipmentActionCreators.success(result.data.data));
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
}

export function setApprove(id) {

    let url = 'approve/'+id+'/true';

    return function (dispatch) {
        HTTP('put', url, null, {
            'authorization': getStorage('token')
        })
            .then((result) => {
                debugger;
                pubnub.publish({
                channel: 'carrierRequest-' + id,
                message: {
                    shipperID: getStorage('currentUserID'),
                    shipperCompanyName:getStorage('shipperCompanyName'),
                }
              });
                dispatch(approveCarrierNameActionCreators.success(result.data.data));
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
}

const requestCarrierName = asyncActionNames('GET_REQUESTED_CARRIER');
const requestCarrierNameActionCreators = buildAsyncActions(requestCarrierName);

export function getRequestedCarrier() {
    let url = 'carrierRequest';
 console.log(getStorage('token'));
    return function (dispatch) {
        HTTP('get', url, null, {
            'authorization': getStorage('token')
        })
            .then((result) => {
                dispatch(requestCarrierNameActionCreators.success(result.data.data));
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
}
