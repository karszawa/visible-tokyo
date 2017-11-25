import * as React from "react";
import {SelectBoxColumn, SelectBoxWrapper} from "./App.components";
import {lineData, lineToColorMap} from "../lib/data";

class AccessSelectBoxBase extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.targets
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.targets !== this.state.checked) {
            this.setState({ checked: nextProps.targets });
        }
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '200px' }}>
                        <label htmlFor={`${keyword}`}>{ this.props.names[i] }</label>
                        { this.props.notations && <div style={{ backgroundColor: lineToColorMap[keyword], width: '20px', height: '20px', borderRadius: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '11px' }}>{ this.props.notations[i] }</div>}
                    </div>
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

const AccessSelectBox = (props) => {
    const lines = lineData.map(line => line.name);
    const keywords = lineData.map(line => line.name);
    const notations = lineData.map(line => line.notation);

    return (
        <AccessSelectBoxBase
            names={ lines }
            keywords={ keywords }
            notations={ notations }
            targets={ props.targets }
            onSelect={ props.onSelect }
        />
    );
};

export default AccessSelectBox;