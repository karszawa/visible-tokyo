import * as React from "react";
import ApiService from "./api-service";
import {InformationContainer} from "./App.components";
import CustomSearchBox from "./CustomSearchBox";

const apiService = new ApiService();

export default class InformationPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            originFormattedAddress: "",
            destinationFormattedAddress: "",
            durations: {},
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.destination) {
            apiService.getGeocode(nextProps.destination).then(result => {
                this.setState({ destinationFormattedAddress: result });
            });
        }

        if (nextProps.origin) {
            apiService.getGeocode(nextProps.origin).then(result => {
                this.setState({ originFormattedAddress: result });
            });
        }

        if (!nextProps.origin || !nextProps.destination) {
            return
        }

        this.setDistances(nextProps.origin, nextProps.destination);
    }

    setDistances(origin, destination) {
        const service = new window.google.maps.DistanceMatrixService();

        service.getDistanceMatrix({
            origins: [ origin ],
            destinations: [ destination ],
            travelMode: 'TRANSIT',
            transitOptions: { modes: [ 'RAIL' ] },
        }, (response, status) => {
            if (response.rows[0].elements[0].duration) {
                this.setState({
                    durations: Object.assign(this.state.durations, {
                        Transit: response.rows[0].elements[0].duration.text
                    })
                });
            }
        });

        service.getDistanceMatrix({
            origins: [ origin ],
            destinations: [ destination ],
            travelMode: 'WALKING',
        }, (response, status) => {
            if (response.rows[0].elements[0].duration) {
                this.setState({
                    durations: Object.assign(this.state.durations, {
                        Walking: response.rows[0].elements[0].duration.text
                    })
                });
            }
        });

        service.getDistanceMatrix({
            origins: [ origin ],
            destinations: [ destination ],
            travelMode: 'DRIVING',
        }, (response, status) => {
            if (response.rows[0].elements[0].duration) {
                this.setState({
                    durations: Object.assign(this.state.durations, {
                        Driving: response.rows[0].elements[0].duration.text
                    })
                });
            }
        });
    }

    render() {
        const duration = Object.keys(this.state.durations).map(key =>
            <div className="duration-line" key={ key }>
                <div>{ key }</div>
                <div>{ this.state.durations[key] }</div>
            </div>
        );

        return (
            <InformationContainer>
                <CustomSearchBox
                    onPlacesChanged={ this.props.onPlacesChanged }
                />

                <dl>
                    <dt>Destination</dt>
                    <dd>
                        { this.state.destinationFormattedAddress ?
                            this.state.destinationFormattedAddress.replace(/.+\d\d\d-\d\d\d\d /, '')
                            :
                            <div className="placeholder">Search from text box</div>
                        }
                    </dd>
                    <dt>Departure place</dt>
                    <dd>
                        { this.state.originFormattedAddress ?
                            this.state.originFormattedAddress.replace(/.+\d\d\d-\d\d\d\d /, '')
                            :
                            <div className="placeholder">Click a location</div>
                        }
                    </dd>
                    { Object.keys(this.state.durations).length !== 0 && <dt>Duration</dt> }
                    { Object.keys(this.state.durations).length !== 0 && <dd>{ duration }</dd> }
                </dl>
            </InformationContainer>
        );
    }
}