import React, { Component } from 'react';
import styles from './style.css';
import { beautifyDate, getDistanceFromLatLonInMile } from '../../../Components/Common/functions'
import { SHIPMENTS_STATUS } from '../../../Components/Common/shipmentStatus'
import * as $ from 'jquery';

class TrackRightBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveShipmentCurrentStatus:'',
      shipmentProgress:0
    }
  }

  componentDidMount() {
    $('.shipment-detail-scroll').css('height',window.innerHeight-$('nav').height()-5)
  }

  componentWillReceiveProps(nextProps) {
    debugger;
    let deadhead = 0;
      let currentDistance = 0;
      let progressValue = 0;
    if(nextProps.shipmentDetails){
      let shipmentDetails = nextProps.shipmentDetails;
      
      if(shipmentDetails.currentStatus == "ENROUTE_TO_PICKUP" || shipmentDetails.currentStatus == "ACCEPTED"){
        deadhead = getDistanceFromLatLonInMile(shipmentDetails.driver.driver.currentDriverLocation.coordinates[1], shipmentDetails.driver.driver.currentDriverLocation.coordinates[0], shipmentDetails.pickupLocationLat, shipmentDetails.pickupLocationLong);
        currentDistance = (shipmentDetails.distance+deadhead) - getDistanceFromLatLonInMile(shipmentDetails.driver.driver.currentDriverLocation.coordinates[1], shipmentDetails.driver.driver.currentDriverLocation.coordinates[0], shipmentDetails.pickupLocationLat, shipmentDetails.pickupLocationLong);
        progressValue = ((100*currentDistance) / (shipmentDetails.distance+deadhead)) + "%";
      }
      else{
        currentDistance = (shipmentDetails.distance) - getDistanceFromLatLonInMile(shipmentDetails.driver.driver.currentDriverLocation.coordinates[1], shipmentDetails.driver.driver.currentDriverLocation.coordinates[0], shipmentDetails.deliveryLocationLat, shipmentDetails.deliveryLocationLong);
        progressValue = ((100*currentDistance) / (shipmentDetails.distance)) + "%";
      }
          
           this.setState({
            liveShipmentCurrentStatus: shipmentDetails.currentStatus,
            shipmentProgress: progressValue
        })
        $("#bar").css('width', progressValue)
    }
    if(nextProps.shipmentDetails && nextProps.shipmentStatus.shipment){
      if(nextProps.shipmentDetails._id == nextProps.shipmentStatus.shipment._id){
       
         let shipmentDetails = nextProps.shipmentDetails;
      if(nextProps.shipmentStatus.shipment.currentStatus == "ENROUTE_TO_PICKUP" || nextProps.shipmentStatus.shipment.currentStatus == "ACCEPTED"){
        deadhead = getDistanceFromLatLonInMile(nextProps.shipmentStatus.latlng[0], nextProps.shipmentStatus.latlng[1], shipmentDetails.pickupLocationLat, shipmentDetails.pickupLocationLong);
         currentDistance = (nextProps.shipmentDetails.distance+deadhead) - getDistanceFromLatLonInMile(nextProps.shipmentStatus.latlng[0], nextProps.shipmentStatus.latlng[1], shipmentDetails.pickupLocationLat, shipmentDetails.pickupLocationLong);
         progressValue = ((100*currentDistance) / (nextProps.shipmentDetails.distance+deadhead)) + "%";
      }
      else{
        currentDistance = (nextProps.shipmentDetails.distance) - getDistanceFromLatLonInMile(nextProps.shipmentStatus.latlng[0], nextProps.shipmentStatus.latlng[1], shipmentDetails.deliveryLocationLat, shipmentDetails.deliveryLocationLong);
         progressValue = ((100*currentDistance) / (nextProps.shipmentDetails.distance)) + "%";
      }
         
           this.setState({
            liveShipmentCurrentStatus: nextProps.shipmentStatus.shipment.currentStatus,
            shipmentProgress: progressValue
        })
        $("#bar").css('width', progressValue)
      }
    }
  }



  render() {
    let self = this;
    let shipment = self.props.shipmentDetails
    return (
      <div>
      {shipment ?
        <div className="shipment-detail shipment-detail-scroll col-md-3 no-padding no-border">
          <div id="progress" className="col-sm-12 track-progress-bar no-padding">
          <div id="percent">{SHIPMENTS_STATUS[this.state.liveShipmentCurrentStatus]}</div>
            <div id="bar">
            </div>
            
          </div>

          <div className="col-sm-12 mg-tp-20 border-btm">
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
            
          </div>

          <div className="col-sm-12 track-progress-details">

            <div className="col-sm-6">
              <h5>PRICE</h5>
              <span>${shipment.lowPrice}</span>
            </div>
            <div className="col-sm-6">
              <h5>DISTANCE</h5>
              <span>{shipment.distance}mi</span>
            </div>
          </div>

          <div className="col-sm-12 track-progress-details">
            <div className="col-sm-6">
              <h5>COMMODITY</h5>
              <span>{shipment.loadingDetails.commodity}</span>
            </div>
            <div className="col-sm-6">
              <h5>REFERENCE #</h5>
              <span>{shipment.customId}</span>
            </div>
          </div>

          <div className="col-sm-12 track-progress-details pd-bt-27 border-btm">
            <div className="col-sm-4">
              <h5>WEIGHT</h5>
              <span>{shipment.loadingDetails.weight} lb</span>
            </div>
            <div className="col-sm-4">
              <h5>PALLETS</h5>
              <span>{shipment.loadingDetails.pallets}</span>
            </div>
            <div className="col-sm-4">
              <h5>TRAILER</h5>
              <span>{shipment.truckType}</span>
              {shipment.truckType === 'REEFER' ? <div> {shipment.loadingDetails.temperature}{shipment.loadingDetails.temperature ? <sup>0</sup> : null }</div> : null}
            </div>
          </div>

          <div className="col-sm-12 track-progress-message">
            <h5>MESSAGES:</h5>
            <div className="message-detail">
              Speacial Comment: {shipment.specialComment}
            </div>
            {['EXPIRED', 'CANCELLED_BY_ADMIN', 'TIMEOUT', 'CANCELLED_BY_SHIPPER', 'CANCELLED_BY_CARRIER', 'CANCELLED_BY_DRIVER', 'PENDING'].indexOf(shipment.currentStatus) === -1 ?
          <div className="message-detail">
              Pickup #: {shipment.pickupNumber} <br />
              Delivery #: {shipment.deliveryNumber} <br />
              BOL #: {shipment.bolNumber} <br />
              PO #: {shipment.poNumber} <br />
            </div>
          : null }
          </div>
          <div className="col-sm-12 track-progress-message">
            <h5>CUSTOMER CONTACT INFO:</h5>
            <div className="message-detail">
                    company name: {shipment.shipper && shipment.shipper.shipper && shipment.shipper.shipper.company_name ? shipment.shipper.shipper.company_name : 'N/A'} <br />
                    phone number: {shipment.shipper && shipment.shipper.shipper ? shipment.shipper.shipper.mobile : ''} <br />
                    email address: {shipment.shipper ? shipment.shipper.email : ''} <br />
                    Policy:{shipment.shipper && shipment.shipper.policy}
                  </div>
          </div>
        </div>
        : <div className="shipment-detail col-md-3 no-padding no-border">
          <div className="col-sm-12 track-progress-bar no-padding">
            <div className="col-sm-4">
            </div>
            <div className="col-sm-8">No Active Shipment</div>
          </div>
        </div>
      }
</div>
      );
  }
}



TrackRightBar.propTypes = {

};

export default TrackRightBar;
