import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './style.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as traileractionCreators from '../../../Components/trucker/common-actions/truckTypeAction';

class CarrierUnApprovedLeftBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            requests:localStorage.getItem('requests'),
            showrequest: false,
            mcSearch:'',
            truckType:'',
            pickupLocation:'',
            deliveryLocation:''
        }
    }

    componentDidMount() {
        this.props.actions.truckType.getAllTruckType();
    }

    search(e) {
        let self = this;
           const value = e.target.value;
           const name = e.target.name;
           self.setState({
           [name]: value
           }, () => {
           self.props.search(self.state)
           });
    }

    getRequestCount(requests) {
        console.log(requests)
    }
    componentWillReceiveProps(nextProps) {
        this.setState({requests:nextProps.requests})
    }

    getrequested(event){
        this.setState({
            showrequest:event.target.checked,
        })
     
        this.props.getrequested(this.state.showrequest);
    }
    clearAll (){
         let self = this;
        self.setState({
            mcSearch:'',
            truckType:'',
            pickupLocation:'',
            deliveryLocation:''
        });
        setTimeout(function () {
                   self.props.search(self.state);
                }, 100); 
    }
    render() {

        const textCenter = {
            textAlign: 'center',
        };

        return (
            <div className="row box-border-right">

                <div className="col-xs-12 col-sm-12">

                    {/*<!-- Carrier SideBar Header -->*/}
                    <div className="row">
                        <div className="col-xs-6 header">
                            <Link to="/carrier-approved" activeClassName="active">
                                <span className="float-left carrier_sidebar_header_text">
                                    Approved
                          </span>
                            </Link>
                        </div>
                        <div className="col-xs-6 header active-header">
                            <Link to="/carrier-unapproved" activeClassName="active">
                                <span className="float-right carrier_sidebar_header_text">
                                    Unapproved({this.state.requests})
                                </span>
                            </Link>
                        </div>
                    </div>
                    {/*<!-- End Header -->*/}


                    <div>

                        <div className="row approved_header">
                            <div className="col-xs-12 col-sm-12">
                                <span className="approved_header_filter">Filter</span>
                                <span className="carrier_unapproved_clear_all" onClick={this.clearAll.bind(this)}>Clear all</span>
                            </div>
                        </div>


                        <div className="row carrier_sidebar_carrier_form_padding box-border-bottom">
                            <div className="col-xs-12 col-sm-12 no-padding">

                                <form>
                                    <div className="form-group">
                                        <label>Carrier</label>
                                        <input type="text" className="form-control rounded-0" placeholder="MC#" name='mcSearch' onChange={this.search.bind(this)} value={this.state.mcSearch} />
                                    </div>

                                    <div className="form-group">
                                        <label>Trailer Type</label>
                                        <select className="form-control rounded-0" onChange={this.search.bind(this)} value={this.state.truckType} name="truckType">
                                            <option value="">--Select Truck type--</option>
                                            {this.props.AllTruckTypes.truckTypes.length > 0 ? this.props.AllTruckTypes.truckTypes.map((truckType, key) => {
                                                return (
                                                    <option key={key} value={truckType.name}>{truckType.name}</option>
                                                )
                                            })
                                                : null}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Preffered Lane</label>
                                        <div className="preffered_lane_container">
                                            <div className="row">
                                                <div className="col-xs-2 no-padding" style={ textCenter }>
                                                    <img src="/img/Dot_Fill_White.svg" />
                                                    <br />
                                                    <img src="/img/Dotted_Line.svg" />
                                                </div>
                                                <div className="col-xs-10">
                                                    <input type="text" value={this.state.pickupLocation} onChange={this.search.bind(this)} name="pickupLocation" className="form-control rounded-0 border-left-0 border-right-0 border-top-0" placeholder="Pickup" />
                                                </div>
                                            </div>
                                            
                                  <div className="row">
                                                <div className="col-xs-2 no-padding" style={ textCenter }>
                                                    <img src="/img/Pin_Map.svg" />
                                                </div>
                                                <div className="col-xs-10">
                                                    <input type="text" value={this.state.deliveryLocation} onChange={this.search.bind(this)} name="deliveryLocation" className="form-control rounded-0 border-left-0 border-right-0 border-top-0" placeholder="Drop off(Optional)" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
    
                                <div className="form_grp custom_checkbox">
                                    <label><input name="showrequest" type="checkbox"  className="ios-switch green tinyswitch"  onChange={this.getrequested.bind(this)} value={this.state.showrequest}/><div><div></div></div> Show requests</label>
                                </div>
                                
                                </form>

                            </div>
                        </div>

                    </div>

                </div>

            </div>


        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            truckType: bindActionCreators(traileractionCreators, dispatch)
        }
    }
}

function mapStateToProps(state) {
    return {
        AllTruckTypes: state.truckTypesReducers
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CarrierUnApprovedLeftBar);
