import {HTTP,getStorage} from '../../../services';

import {
    asyncActionNames,
    buildAsyncActions
} from '../../../Components/Common/GlobalActionCreators';
// creating action names and action creator
const getAllPastShipmentActionNames = asyncActionNames('GET_APPROVED_CARRIER');
const getAllPastShipmentActionCreators = buildAsyncActions(getAllPastShipmentActionNames);

const unapproveCarrierName = asyncActionNames('SAVE_UNAPPROVED_CARRIER');
const unapproveCarrierNameActionCreators = buildAsyncActions(unapproveCarrierName);

export function getApprovedCarrier(params) {
    let url = 'approved/true';
const token = getStorage('token');
    return function(dispatch) {
        HTTP('get', url, null, {
                'authorization': token
            })
            .then((result) => {
                console.log(result);
                dispatch(getAllPastShipmentActionCreators.success(result.data.data));
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
}

export function setUnApprove(id) {

    let url = 'approve/'+id+'/false';

    return function (dispatch) {
        HTTP('put', url, null, {
            'authorization': getStorage('token')
        })
            .then((result) => {
                dispatch(unapproveCarrierNameActionCreators.success(result.data.data));
            })
            .catch((error) => {
                console.log(error.message);
            });
    }
}
