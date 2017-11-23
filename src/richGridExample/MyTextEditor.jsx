import React from 'react';
import * as PropTypes from 'prop-types';
import NameCellEditor from './NameCellEditor.jsx';


export default class MyCellEditor extends NameCellEditor {
    constructor(props) {
        super(props); 
    
    }

   render() {
        return (
            <textarea  ref="textField" rows="6"  onChange={this.onChangeListener.bind(this)}>{this.state.value}</textarea>
        );
    }
}