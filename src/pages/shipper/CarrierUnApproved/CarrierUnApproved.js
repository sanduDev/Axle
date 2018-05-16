import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { CarrierUnApprovedLeftBar, CarrierReview } from '../../../Components/shipper/';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from './actionCreator';
import * as requestActionCreators from './actionCreatorRequest';
import * as requestActionCountCreators from './countRequestAction';
import './style.css';
import { notify } from 'react-notify-toast';

var Loader = require('react-loader');


class CarrierUnApproved extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showReview: false,
      carriers: {},
      selectedCarrier: {},
      allCarriers: {},
      requests: {},
      countRequests: localStorage.getItem('requests'),
      loaded: false,
      filterCarriers: {},
      searchRequested: {}
    };

    this.onReviewClick = this.onReviewClick.bind(this);
    this.close = this.close.bind(this);
  }

  close() {
    this.setState({ showReview: false })
  }

  componentDidMount() {
    this.props.actions.requested.getRequestedCarrier();
    this.props.actions.carriers.getUnApprovedCarrier();

  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    this.setState({
      carriers: nextProps.carriers,
      allCarriers: nextProps.carriers,
      requests: nextProps.requests[0].notifyBy,
      loaded: true,
      filterCarriers : nextProps.carriers,
      countRequests: nextProps.requests[0].notifyBy.length,
      searchRequested : nextProps.requests[0].notifyBy
    })

  }
   

  onReviewClick(carrier) {
    this.setState({ showReview: true, selectedCarrier: carrier });
    console.log(this.state.selectedCarrier)
  }

  approveCarrier(cid) {
    let unapprovearr = [];
    let requestsarr = [];
    this.props.actions.carriers.setApprove(cid);
    this.setState({ showReview: false });
    //this.props.actions.getUnApprovedCarrier();
    this.state.carriers.forEach(function (carrier) {
      if (typeof carrier._id !== "undefined" && carrier._id.indexOf(cid) === -1) {
        unapprovearr.push(carrier);
      }
    });

    this.state.requests[0].notifyBy.forEach(function (carrier) {
      if (typeof carrier._id !== "undefined" && carrier._id.indexOf(cid) === -1) {
        requestsarr.push(carrier);
      }
    });

    this.setState({ carriers: unapprovearr, requests: requestsarr });
    notify.show('Carrier Approve successfully', 'success');
  }

  unapprove(cid) {
        this.setState({ showReview: false })
        notify.show('Carrier Already UnApproved', 'success');
    }

  searchCarrier(filter) {
       let filterParams = {};
   if (filter.mcSearch !== "") {
     filterParams['MCNumber'] = filter.mcSearch
   }
   if (filter.truckType !== "") {
     filterParams['truckType'] = filter.truckType
   }
   if (filter.pickupLocation !== "") {
     filterParams['pickup_prefferred'] = filter.pickupLocation
   }
   if (filter.deliveryLocation !== "") {
     filterParams['delivery_prefferred'] = filter.deliveryLocation
   }
    this.props.actions.carriers.getUnApprovedCarrier(filterParams);
    this.props.actions.requested.getRequestedCarrier(filterParams);
 
  }

  requested(data) {
    if (!data) {
      this.setState({ carriers: '' });
      if (this.state.requests.length === 0) {
        notify.show('No requests', 'warning');
      }
    } else {
      this.setState({ carriers: this.state.allCarriers });
    }
  }

  render() {
    var requestCarriers = this.state.requests && Object.keys(this.state.requests).map(function (carrier, id) {
      let carrierData = this.state.requests[carrier];
      return <tr key={id}>
        <td>
          <div>
            {/*<span className="ship_user_img">
              <img alt="img" src="/img/user.jpg" />
            </span>*/}
            <span className="carrier_user_img_left">
              <div className="carrier_user_img_name">{typeof carrierData.carrier !== 'undefined' ? (
                                carrierData.carrier.company_name
                            ) : typeof carrierData.driver !== 'undefined' ? (
                                carrierData.driver.company_name
                            ):''}{<span>(Requested)</span>}</div>
              <div className="carrier_mc">MC#: {typeof carrierData.carrier !== 'undefined' ? (
                carrierData.carrier.MCNumber
              ) :typeof carrierData.driver !== 'undefined' ? (
                                carrierData.driver.MCNumber
                            )  :''
              }</div>
            </span>
          </div>
        </td>
        <td className="carrier_mail_text">{carrierData.email}</td>
        <td className="carrier_mail_text">{typeof carrierData.carrier !== 'undefined' ? (
          carrierData.carrier.mobile
        ) : typeof carrierData.driver !== 'undefined' ? (
                                carrierData.driver.mobile
                            )  :''}</td>
        {/*<td className="carrier_mail_text">{typeof carrierData.carrier !== 'undefined' ? (
            carrierData.carrier.truckType.map(function (type, key) {
              if (typeof carrierData.carrier.truckType[key + 1] !== 'undefined') {
                return type + ' ,'
              } else {
                return type
              }
            })
          ) : (
              <div>No Type</div>
            )}</td>*/}
        <td className="carrier_mail_text carrier_review_text_decoration" onClick={this.onReviewClick.bind(this, carrierData)}>Review</td>
      </tr>
    }.bind(this))
    var allcarriers = this.state.carriers && Object.keys(this.state.carriers).map(function (carrier, id) {
      let carrierData = this.state.carriers[carrier];
      if (typeof carrierData.carrier !== 'undefined' || typeof carrierData.driver !== 'undefined') {
        return <tr key={id}>
          <td>
            <div>
              {/*<span className="ship_user_img"><img alt="img" src="/img/user.jpg" /></span>*/}
              <span className="carrier_user_img_left">
                <div className="carrier_user_img_name">{typeof carrierData.carrier !== 'undefined' ? (
                               carrierData.carrier.company_name
                            ) : typeof carrierData.driver !== 'undefined' ? carrierData.driver.company_name :''}</div>
                <div className="carrier_mc">MC#: {typeof carrierData.carrier !== 'undefined' ? (
                  carrierData.carrier.MCNumber
                ) : typeof carrierData.driver !== 'undefined' ? carrierData.driver.MCNumber :''}</div>
              </span>
            </div>
          </td>
          <td className="carrier_mail_text">{carrierData.email}</td>
          <td className="carrier_mail_text">{typeof carrierData.carrier !== 'undefined' ? (
            carrierData.carrier.mobile
          ) : (
              carrierData.driver.mobile
            )}</td>
          {/*<td className="carrier_mail_text">{typeof carrierData.carrier !== 'undefined' ? (
            carrierData.carrier.truckType.map(function (type, key) {
              if (typeof carrierData.carrier.truckType[key + 1] !== 'undefined') {
                return type + ' ,'
              } else {
                return type
              }
            })
          ) : (
              <div>No Type</div>
            )}</td>*/}
          <td className="carrier_mail_text carrier_review_text_decoration" onClick={this.onReviewClick.bind(this, carrierData)}>Review</td>
        </tr>
      }

    }.bind(this))
    //console.log(JSON.stringify(this.state.selectedCarrier));
    return (

      <div className="row">

        {/*<!-- Left Side Bar -->*/}
        <div className="col-xs-12 col-sm-12 col-md-2 carrier-approved sidebar-left">
          <CarrierUnApprovedLeftBar search={this.searchCarrier.bind(this)} requests={this.state.countRequests} getrequested={this.requested.bind(this)} />
        </div>
        {/*<!-- End left side bar -->*/}

        {/*<!-- Content -->*/}
        <Loader loaded={this.state.loaded}>
          <div className="col-xs-12 col-sm-12 col-md-9 content mt-27">

            <div className="table-responsive">

              <table className="table table-bordered">

                <tbody>
                  {requestCarriers}
                  {allcarriers}
                </tbody>

              </table>

            </div>

          </div>
        </Loader>
        {/*<!-- End Content -->*/}


        {/*<!-- Modal Definition -->*/}
        <Modal show={this.state.showReview} className="modal right" onHide={this.close} id="submit-rating">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body no-padding">
                {/*<!-- sidenav content -->*/}
                <CarrierReview close={this.close} detail={this.state.selectedCarrier} onApprove={this.approveCarrier.bind(this)} onUnapprove={this.unapprove.bind(this)}/>
              </div>

            </div>
          </div>

        </Modal>
          {/* <!-- End Modal Definition --> */}

        </div>

    )
  }
}

function mapStateToProps(state) {
  return {
    carriers: state.CarrierUnApprovedReducer.carriers,
    requests: state.CarrierUnApprovedRequestReducer.requestedCarriers,
    countrequested: state.CarrierRequestCountReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      carriers: bindActionCreators(actionCreators, dispatch),
      requested: bindActionCreators(requestActionCreators, dispatch),
      countrequested: bindActionCreators(requestActionCountCreators, dispatch)
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarrierUnApproved);
