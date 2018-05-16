import React, { Component } from 'react';
import { Link } from 'react-router';
import './style.css';
import { Modal } from 'react-bootstrap'
import TruckShipmentFilter from '../../../Components/trucker/TruckShipmentFilter'
import TruckShipmentTrackLoad from '../../../Components/trucker/TruckShipmentTrackLoad'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../Track/actionCreators';
import { beautifyDate } from '../../../Components/Common/functions'
import { SHIPMENTS_STATUS } from '../../../Components/Common/shipmentStatus'
import { getStorage, setStorage } from '../../../services';
import moment from 'moment';
let Loader = require('react-loader');
let self;
class TruckShipmentAssigned extends Component {
  constructor(props) {
    super(props);
    this.state = {
      NoOfrequestedLoads: 0,
      sideNavPickProgress: false,
      loaded:false
    }
    this.getFilterParams = this.getFilterParams.bind(this);

    self = this;
  }
  onTrackDriver(shipmentID) {
    const selectedLoad = this.props.assignedShipments.shipments.shipment.filter((shipment) => {
      return shipment._id == shipmentID;
    });

    this.setState({
      sideNavPickProgress: true,
      selectedLoad: selectedLoad[0]
    })
  }

  close() {
    this.setState({
      sideNavPickProgress: false
    })
  }
  componentDidMount() {
    let noOfRequestedLoads = getStorage('requestedLoads');
    this.setState({
      NoOfrequestedLoads: noOfRequestedLoads
    })
    this.props.actions.getActiveLoadList()
  }
  getFilterParams(filter) {
    this.setState({
        loaded: false
      })
    let filterParams = {};
    if (filter.cityState != "") {
      filterParams['cityState'] = filter.cityState
    }
    if (filter.dateFrom != "") {
      filterParams['dateFrom'] = filter.dateFrom
    }
    if (filter.dateTo != "") {
      filterParams['dateTo'] = filter.dateTo
    }
    if (filter.truckType != "") {
      filterParams['truckType'] = filter.truckType
    }

    this.props.actions.getActiveLoadList(filterParams)
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.assignedShipments.shipments.shipment){
      this.setState({
        loaded: true
      })
    }
  }

  render() {
    self = this;


    return (
      <div>
        <TruckShipmentFilter filter={(filter) => self.getFilterParams(filter)} NoOfrequestedLoads={this.state.NoOfrequestedLoads}/>
        <Loader loaded={this.state.loaded}>
        <div className="shipment-detail col-md-9">

          {self.props.assignedShipments.shipments.shipment && self.props.assignedShipments.shipments.shipment.length > 0 ? self.props.assignedShipments.shipments.shipment.map(function(shipment, i) {
        return (
          <div className="container-fluid no-padding" key={shipment._id} onClick={() => {
            self.onTrackDriver(shipment._id)
          }}>

                <div className="col-sm-12 box-border-bottom pickup-text mecca-padding">
                {shipment.shipper.shipper.company_name}{shipment.shipper.shipper.MCNumber ? ': MC ' + shipment.shipper.shipper.MCNumber : ''}

          </div>

                <div className="col-md-6 col-sm-12 col-xs-12 pd-rt-0 detail-one">
                  <div className="col-sm-5 col-xs-12 no-padding">
                    { /* <img src={shipment.driver.driver.image ? shipment.driver.driver.image : '/img/driver.jpg'} alt="user-profile" className="user-profile-shipments" /> */ }
                    <span className="col-sm-2 user-name user-name-padding">{shipment.driver.name}</span>
                    <button className="btn btn-default truck-driver-button truck-driver-button-margin" onClick={() => {
            self.onTrackDriver(shipment._id)
          }}>
                      <img src="/img/Location.svg" alt="location icon" />
                      <span>TRACK DRIVER</span>
                    </button>
                  </div>

                  <div className="col-sm-7 col-xs-12 no-padding">
                    { /* <div className="col-sm-2 col-xs-2">
                      <img src="/img/Dot.svg" alt="circular" /><br />
                      <img src="/img/Dotted_Line.svg" alt="dotted-lines" className="dotted-lines" /><br />
                      <img src="/img/Small_Pin.svg" alt="pin" />
                    </div> */ }
                    <div className="col-sm-12 col-xs-12 no-padding">
                      { /* <div className="pickup">
                        <div className="pickup-text">PICKUP</div>
                        <span className="pickup-details time-details">{shipment.pickupCompanyAddress}
                        <br />
                        <span className="pickup-details time-details">{shipment.pickupCompanyAddress}{shipment.pickupCompanyAddress}</span>
                        <br />
                        <span className="pickup-details time-details">{shipment.pickupCompanyAddress}</span>
                         </span>
                        <span className="pickup-details">
                          {beautifyDate(shipment.pickupDateTimeFrom, 'MM/DD/YYYY')}  •  {beautifyDate(shipment.pickupDateTimeFrom, 'hh:mm a')} - {beautifyDate(shipment.pickupDateTimeTo, 'hh:mm a')}
                          </span>
                      </div> */ }
                      <div className="shipments_loc shipments_loc_assigned">
        								<div className="order_loc">
        									<h5><img src="/img/Dot.svg" alt="circle" />Pickup - {shipment.pickupCompanyName}</h5>
        									<address>
        										{shipment.pickupCompanyAddress}<br />{shipment.pickupCity}, {shipment.pickupState}, {shipment.pickupZipcode}<br />
        										{beautifyDate(shipment.pickupDateTimeFrom, 'MM/DD/YYYY')} • {beautifyDate(shipment.pickupDateTimeFrom, 'hh:mm a')} - {beautifyDate(shipment.pickupDateTimeTo, 'hh:mm a')} <br />
        										Phone : {shipment.pickupMobile}</address>
        									<h5><img src="/img/Small Pin.svg" alt="circle" />Drop Off - {shipment.deliveryCompanyName}</h5>
        									<address>
        										{shipment.deliveryCompanyAddress}<br />{shipment.deliveryCity}, {shipment.deliveryState}, {shipment.deliveryZipcode}<br />
        										{beautifyDate(shipment.deliveryDateTimeFrom, 'MM/DD/YYYY')}  •  {beautifyDate(shipment.deliveryDateTimeFrom, 'hh:mm a')} - {beautifyDate(shipment.deliveryDateTimeTo, 'hh:mm a')} <br />
        										Phone : {shipment.deliveryMobile}
        									</address>
        								</div>
        							</div>
                      { /* <div className="drop-off mg-tp-5">
                        <div className="drop-off-text">DROP OFF</div>
                        <span className="drop-off-details time-details">{shipment.deliveryCompanyAddress} </span>
                        <span className="drop-off-details">
                          {beautifyDate(shipment.deliveryDateTimeFrom, 'MM/DD/YYYY')}  •  {beautifyDate(shipment.deliveryDateTimeFrom, 'hh:mm a')} - {beautifyDate(shipment.deliveryDateTimeTo, 'hh:mm a')}
                          </span>
                      </div> */ }
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-sm-12 col-xs-12 pd-lt-0 detail-two">
                  <div className="col-sm-12 inprogress-title">
                    {SHIPMENTS_STATUS[shipment.currentStatus]} {shipment.milesLeft > 0 ? <span>({shipment.milesLeft}mile remaining)</span> : null} 
              </div>

                  <div className="col-sm-12 col-xs-12 no-padding">

                    <div className="col-sm-3 col-xs-3">
                      <div className="price-text">PRICE</div>
                      <span className="price-details">${shipment.lowPrice}</span>
                    </div>
                    <div className="col-sm-3 col-xs-3 no-padding">
                      <div className="distance-text">DISTANCE</div>
                      <span className="distance-details">{shipment.distance}mi</span>
                    </div>
                    <div className="col-sm-3 col-xs-3 no-padding">
                      <div className="reference-text">REFERENCE #</div>
                      <span className="reference-details">{shipment.customId}</span>
                    </div>
                  </div>

                  <div className="col-sm-12 col-xs-12 no-padding mg-tp-10">
                    <div className="col-sm-3 col-xs-3">
                      <div className="commodity-text">COMMODITY</div>
                      <span className="commodity-details">{shipment.loadingDetails.commodity}</span>
                    </div>
                    <div className="col-sm-3 col-xs-3">
                      <div className="weight-text">WEIGHT</div>
                      <span className="weight-details">{shipment.loadingDetails.weight} lb</span>
                    </div>
                    <div className="col-sm-3 col-xs-3 no-padding">
                      <div className="pallets-text">PALLETS</div>
                      <span className="pallets-details">{shipment.loadingDetails.pallets}</span>
                    </div>
                    <div className="col-sm-3 col-xs-3 no-padding">
                      <div className="trailer-text">TRAILER</div>
                      <span className="trailer-details">{shipment.truckType}
                      {shipment.truckType === 'REEFER' ? <div> {shipment.loadingDetails.temperature}{shipment.loadingDetails.temperature ? <sup>0</sup> : null }</div> : null}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
        )

      }) : <div className="no_any_shipment">
					No Any Shipment yet.
			  </div>
      }
        </div>
        <Modal id="side-nav-pickup-prog" show={this.state.sideNavPickProgress} onHide={() => {
        this.close()
      }} className="right fade">
          <Modal.Body>
            <TruckShipmentTrackLoad loadDetails={this.state.selectedLoad} />
          </Modal.Body>
        </Modal>
        </Loader>
      </div>
      );
  }
}

function mapStateToProps(state) {
  return {
    assignedShipments: state.TrackReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actionCreators, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TruckShipmentAssigned);
