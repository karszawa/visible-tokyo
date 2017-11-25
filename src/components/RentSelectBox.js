import * as React from "react";
import {SelectBoxColumn, SelectBoxLabel, SelectBoxLineBadge, SelectBoxWrapper} from "./App.components";
import {lineToColorMap} from "../lib/data";

class RentSelectBoxBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: [ 15, 20, 'JR山手線' ]
        };
    }

    onChange(keyword) {
        let checked = [];

        if (this.state.checked.some(v => v === keyword)) {
            checked = this.state.checked;
            this.state.checked.some((v, i) => v === keyword && checked.splice(i, 1));
            this.setState({ checked: checked });
        } else {
            checked = this.state.checked.concat(keyword);
            this.setState({ checked: checked });
        }

        this.props.onSelect(checked);
    }

    render() {
        const columns = this.props.keywords.map((keyword, i) => {
            return (
                <SelectBoxColumn key={ keyword }>
                    <input
                        type="checkbox"
                        id={`${keyword}`}
                        onChange={ this.onChange.bind(this, keyword) }
                        checked={ this.state.checked.some(v => v === keyword) }
                        style={{ marginRight: '10px' }}
                    />
                    <SelectBoxLabel>
                        <label htmlFor={`${keyword}`}>
                            { this.props.names[i] }
                        </label>

                        { this.props.notations &&
                        <SelectBoxLineBadge color={ lineToColorMap[keyword] }>
                            { this.props.notations[i] }
                        </SelectBoxLineBadge>
                        }
                    </SelectBoxLabel>
                </SelectBoxColumn>
            );
        });

        return (
            <SelectBoxWrapper>
                { columns }
            </SelectBoxWrapper>
        );
    }
}

const RentSelectBox = (props) => {
    const numbers = Array.apply(null, { length: 8 }).map(Number.call, Number);

    return (
        <RentSelectBoxBase
            names={ numbers.map(i => `${10+5*(i+1)}~${10+5*(i+2)}㎡`) }
            keywords={ numbers.map(i => 10 + 5 * (i + 1)) }
            onSelect={ props.onSelect }
        />
    );
};

export default RentSelectBox;