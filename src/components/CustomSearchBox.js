import React from "react";
import { SearchBox } from 'react-google-maps/lib/components/places/SearchBox';
import {SearchInput} from "./App.components";

export default class CustomSearchBox extends React.Component {
    onPlacesChanged() {
        const places = this.searchBox.getPlaces();

        if (!places[0]) {
            return null;
        }

        this.props.onPlacesChanged({
            lat: places[0].geometry.location.lat(),
            lng: places[0].geometry.location.lng()
        });
    }

    render() {
        return (
            <SearchBox
                ref={ e => this.searchBox = e }
                controlPosition={ window.google.maps.ControlPosition.TOP_RIGHT }
                onPlacesChanged={ ::this.onPlacesChanged }
            >
                <SearchInput
                    type="text"
                    placeholder="Search your destination"
                />
            </SearchBox>
        );
    }
}
