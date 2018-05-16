import React, { Component } from 'react';
import moment from 'moment'
import './style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as $ from 'jquery';
import * as actionDriverPlaceCreators from '../../../Components/trucker/common-actions/autoSuggestPlaces';
import * as actionCreators from './actionCreators';
class TrackLeftBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      activeDriver: undefined,
      driverPlaces: {}
    }
  }
  componentWillMount() {

    this.props.actions.allDriver.listAllDriver()
  }
  componentDidMount() {
    $('.driver-list').css('height', window.innerHeight - $('nav').height() - 25 - $('.shipment-filter').height() - $('.search').height())
  }
  componentWillReceiveProps(nextProps) {
    const self = this;
    if (nextProps.driverList.drivers.data) {
      nextProps.driverList.drivers.data.forEach((data) => {
        if (data.driver.currentDriverLocation.coordinates[0] != 0 && data.driver.currentDriverLocation.coordinates[1] != 0) {
          self.props.actions.driverPlace.getPlace(data.driver.currentDriverLocation.coordinates, data._id).then((result) => {
            debugger;
            let objDriverPlaces = self.state.driverPlaces;
            let city = '';
            let state = '';
            result.data.features.forEach((feature)=>{
              if(feature.id.indexOf('place')==0){
                city = feature.text;
              }
              if(feature.id.indexOf('region')==0){
                state = feature.text;
              }
            })
            objDriverPlaces[result.data.driverID] = city + ', ' + state;

            self.setState({
              driverPlaces: objDriverPlaces
            })
          })
        }
      })

    }
  }
  clearFilter() {
    let self = this;
    this.setState({
      name: '',
      activeDriver: undefined
    }, () => {
      self.props.actions.allDriver.listAllDriver();
      self.props.selectDriver();
    })
  }
  handleDriverSearch(e) {
    let self = this;
    const value = e.target.value;
    self.setState({
      name: value
    }, () => {

      let objFilter = {};
      if (self.state.name !== '') {
        objFilter.name = self.state.name;
      }
      this.props.actions.allDriver.listAllDriver(objFilter)

    });
  }
  activeDriver(driverID) {
    return (this.state.activeDriver === driverID) ? "active" : "test"
  }

  fromNow(date) {
    return moment(date).fromNow();
  }

  render() {
    let allDrivers = this.props;
    let self = this;
    return (
      <div className="shipment-search col-md-2">
        <div className="row">
          <div className="shipment-filter col-sm-12 no-padding">
            <div className="col-sm-12">
              { /* <span className="pull-left">10 loads in progress</span> */}
              <span className="pull-right" onClick={() => {
                self.clearFilter()
              } }>clear all</span>

            </div>
          </div>

          <div className="search col-sm-12 mg-tp-21">
            <label>Search</label>
            <input type="text" placeholder="Driver" value={this.state.name} name="name" autocomplete="off" onChange={(event) => this.handleDriverSearch(event)} />
          </div>
          <div className="drivercol-sm-12 col-xs-12 driver-list">
            {allDrivers.driverList.drivers.data ?
              allDrivers.driverList.drivers.data.map((driver, i) => {
                return (
                  <div className={['track-user-details ' + self.activeDriver(driver._id)]} key={driver._id} onClick={() => {
                    self.setState({
                      activeDriver: driver._id
                    })
                    self.props.selectDriver(driver._id)
                  } }>
                    { /* <div className="col-sm-3  col-xs-3 no-padding">
                      <img src={driver.driver.image ? driver.driver.image : "/img/driver.jpg"} alt={driver.name} className="user-profile-shipments"/>
                    </div> */ }
                    <div className="">
                      <div className="track-user-name">
                        {driver.name}
                      </div>
                      
                      {driver.driver.currentDriverLocation.coordinates[0] != 0 && driver.driver.currentDriverLocation.coordinates[1] != 0 &&
                        <div className="track-time">
                          {self.state.driverPlaces[driver._id] ? self.state.driverPlaces[driver._id] : ''}
                        </div>
                      }
                      <div className="track-time">
                        {self.fromNow(driver.driver.updatedAt)}
                      </div>
                    </div>
                  </div>)
              })
              : null
            }
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    driverList: state.AllDriverReducer
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      allDriver: bindActionCreators(actionCreators, dispatch),
      driverPlace: bindActionCreators(actionDriverPlaceCreators, dispatch),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackLeftBar);
