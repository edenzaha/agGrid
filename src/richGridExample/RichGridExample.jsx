import React, {Component} from "react";
import {AgGridReact} from "ag-grid-react";
import RowDataFactory from "./RowDataFactory";
import ColDefFactory from "./ColDefFactory.jsx";
import DateComponent from "./DateComponent.jsx";
import SortableHeaderComponent from "./SortableHeaderComponent";

import "./RichGridExample.css";
// take this line out if you do not want to use ag-Grid-Enterprise
import "ag-grid-enterprise";

export default class RichGridExample extends Component {

    constructor() {
        super();

        this.state = {
            quickFilterText: null,
            showToolPanel: false,
            columnDefs: new ColDefFactory().createColDefs(),
            rowData: new RowDataFactory().createRowData(),
            icons: {
                columnRemoveFromGroup: '<i class="fa fa-remove"/>',
                filter: '<i class="fa fa-filter"/>',
                sortAscending: '<i class="fa fa-long-arrow-down"/>',
                sortDescending: '<i class="fa fa-long-arrow-up"/>',
                groupExpanded: '<i class="fa fa-minus-square-o"/>',
                groupContracted: '<i class="fa fa-plus-square-o"/>',
                columnGroupOpened: '<i class="fa fa-minus-square-o"/>',
                columnGroupClosed: '<i class="fa fa-plus-square-o"/>'
            }
        };

        // the grid options are optional, because you can provide every property
        // to the grid via standard React properties. however, the react interface
        // doesn't block you from using the standard JavaScript interface if you
        // wish. Maybe you have the gridOptions stored as JSON on your server? If
        // you do, the providing the gridOptions as a standalone object is just
        // what you want!
        this.gridOptions = {
            //We register the react date component that ag-grid will use to render
            dateComponentFramework: DateComponent,
            // this is how you listen for events using gridOptions
            onModelUpdated: function () {
                console.log('event onModelUpdated received');
            },
            defaultColDef: {
                headerComponentFramework: SortableHeaderComponent,
                headerComponentParams: {
                    menuIcon: 'fa-bars'
                }
            },
            // this is a simple property
            rowBuffer: 10, // no need to set this, the default is fine for almost all scenarios,
            floatingFilter: true
        };

        this.onGridReady = this.onGridReady.bind(this);
        this.onRowSelected = this.onRowSelected.bind(this);
        this.onCellClicked = this.onCellClicked.bind(this);
        this.getRowHeight = this.getRowHeight.bind(this);
        this.onCellValueChanged = this.onCellValueChanged.bind(this);
        this.cellEditingStopped = this.cellEditingStopped.bind(this);
        this.getWidth = this.getWidth.bind(this);
        this.rowGroupOpened = this.rowGroupOpened.bind(this);
    }
    cellEditingStopped(params){
        let x = 10;
        let y =5;
    }
    onToggleToolPanel(event) {
        this.setState({showToolPanel: event.target.checked});
    }
    onCellValueChanged(params){
        if (params.colDef.resizeable){
            
            const height = 28 * (Math.floor(params.newValue.length / 45) + 1) + 10;
            //check previous column height with new calculated height, if its the same, then do nothing
            if (height!=params.node.columnsHeights[params.colDef.field])
            {                           
                //update height array with new column height
                params.node.columnsHeights[params.colDef.field] = height;

                //iterate array of heights and find the max height
                let max = 0;
                let arr = params.node.columnsHeights;
                for(var key in arr)
                {
                    if (arr.hasOwnProperty(key)) {
                        var val = arr[key];
                        if (val>max)
                        {
                            max = val;
                        }
                    }
                }
                 
                params.node.setRowHeight(max);
                params.api.onRowHeightChanged();
                 
            }
        }        
    }
 
    getRowHeight (params){
        let columns = this.gridOptions.columnApi.getAllColumns();
        var maxHeight = 0;

        let columnsHeights = [];
        for(var i=0;i<columns.length;i++){
            //get column name
            let colName = columns[i].colDef.field;
          
            //check if column needs to be resized to fit text (the 'resizeable' was added by me to ColDefFactory.jsx)
            let isResizeable = columns[i].colDef.resizeable;

            if (isResizeable)
            {
                //get cell value
                let value = params.api.getValue(colName, params.node);

                //check if we are in "grouped" mode, if the row is a group, then we take the node.key, the node.key
                //should fold the value by which we are grouping
                let isGroupRow = params.node.group;
                if (isGroupRow){
                    value = params.node.key; //set the value we use to calculate height to the group key
                }

                //check if if we are in the column by which we are doing grouping, in this case, the value of the column will be empty, 
                //in case the column value is empty we will not want to calculate the height , we will just want to set this column height to the default 
                //height, in our case its 25 
                let groupedColumns = this.gridOptions.columnApi.getRowGroupColumns();
                let isGroupedColumn = false;
                if (groupedColumns.length>0)
                {
                    let groupedCol = this.gridOptions.columnApi.getRowGroupColumns()[0].colDef.field;
                    isGroupedColumn = groupedCol==colName;
                }
               

                if (isGroupedColumn){
                    //the value should be empty ,set default height
                    columnsHeights[colName]= 25;
                }
                else if (value!=null){
                    //get text height
                    let textHeight = 28 * (Math.floor(value.length / 45) + 1) + 10;
                    if (textHeight>maxHeight){ //if text height is bigger then the current max, then set it to be the current max
                        maxHeight = textHeight;
                    }

                    columnsHeights[colName]= textHeight;
                }   

            }         
        }
        //return the maxHeight, if its lower then then 25 , then return 25

        params.node.columnsHeights = columnsHeights;
        return Math.max(maxHeight,25);
    } 
    onGridReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
    }

    deselectAll() {
        this.api.deselectAll();
    }

    setCountryVisible(visible) {
        this.columnApi.setColumnVisible('country', visible);
    }

    onQuickFilterText(event) {
        this.setState({quickFilterText: event.target.value});
    }

    onCellClicked(event) {
        console.log('onCellClicked: ' + event.data.name + ', col ' + event.colIndex);
    }

    onRowSelected(event) {
        console.log('onRowSelected: ' + event.node.data.name);
    }

    onRefreshData() {
        let newRowData = new RowDataFactory().createRowData();
        this.setState({
            rowData: newRowData
        });
    }
    getWidth(){
        let width = document.getElementsByClassName("ag-fresh")[0].offsetWidth;
        alert(width);
    }
    invokeSkillsFilterMethod() {
        let skillsFilter = this.api.getFilterInstance('skills');
        let componentInstance = skillsFilter.getFrameworkComponentInstance();
        componentInstance.helloFromSkillsFilter();
    }  
    rowGroupOpened(params){
        params.api.onRowHeightChanged();
    }
    dobFilter() {
        let dateFilterComponent = this.gridOptions.api.getFilterInstance('dob');
        dateFilterComponent.setFilterType('equals');
        dateFilterComponent.setDateFrom('2000-01-01');

        // as the date filter is a React component, and its using setState internally, we need
        // to allow time for the state to be set (as setState is an async operation)
        // simply wait for the next tick
        setTimeout(() => {
            this.gridOptions.api.onFilterChanged();
        }, 0)
    }
    unGroup(){
        this.columnApi.setRowGroupColumns([]);
        this.api.resetRowHeights();
    }
    render() {
        return (
            <div style={{width: '900px'}}>
                <h1>Rich Grid Example</h1>
                <div style={{display: "inline-block", width: "100%"}}>
                    <div style={{float: "left"}}>
                        <b>Employees Skills and Contact Details</b><span id="rowCount"/>
                    </div>
                </div>
                <div style={{marginTop: 10}}>
                    <div>
                        <span>
                            Grid API:

                            <button onClick={() => {
                                this.input.api.resetRowHeights()
                            }} className="btn btn-primary">Redraw</button>

                            <button onClick={this.unGroup.bind(this)} className="btn btn-primary">Ungroup</button>

                            <button onClick={() => {
                                this.input.api.selectAll()
                            }} className="btn btn-primary">Select All</button>

                            <button onClick={() => {this.getWidth()}} className="btn btn-primary">Get Width</button>

                            <button onClick={this.deselectAll.bind(this)}
                                    className="btn btn-primary">Clear Selection</button>
                        </span>
                        <span style={{float: "right"}}>
                            Column API:
                            <button onClick={this.setCountryVisible.bind(this, false)} className="btn btn-primary">Hide Country Column</button>
                            <button onClick={this.setCountryVisible.bind(this, true)} className="btn btn-primary">Show Country Column</button>
                        </span>
                    </div>
                    <div style={{display: "inline-block", width: "100%", marginTop: 10, marginBottom: 10}}>
                        <div style={{float: "left"}}>
                            <label>
                                <input type="checkbox" onChange={this.onToggleToolPanel.bind(this)}
                                       style={{marginRight: 5}}/>
                                Show Tool Panel
                            </label>
                        </div>
                        <div style={{float: "left", marginLeft: 20}}>
                            <button onClick={this.onRefreshData.bind(this)} className="btn btn-primary">Refresh Data
                            </button>
                        </div>
                        <div style={{float: "left", marginLeft: 20}}>
                            <input type="text" onChange={this.onQuickFilterText.bind(this)}
                                   placeholder="Type text to filter..."/>
                        </div>
                        <div style={{float: "right"}}>
                            Filter API:
                            <button onClick={this.invokeSkillsFilterMethod.bind(this, false)}
                                    className="btn btn-primary">Invoke Skills Filter Method
                            </button>
                            <button onClick={this.dobFilter.bind(this)} className="btn btn-primary">DOB equals to
                                01/01/2000
                            </button>
                        </div>
                    </div>
                    <div style={{height: 400, width: 900}} className="ag-fresh">
                        <AgGridReact
                            ref={(x)=>this.input = x}
                            // gridOptions is optional - it's possible to provide
                            // all values as React props
                            gridOptions={this.gridOptions}
                            onCellValueChanged={this.onCellValueChanged}
                            // listening for events
                            onGridReady={this.onGridReady}
                            getRowHeight={this.getRowHeight}
                     
                            onRowGroupOpened={this.rowGroupOpened}
                            onRowSelected={this.onRowSelected}
                            onCellClicked={this.onCellClicked}
                            cellEditingStopped={this.cellEditingStopped}
                            // binding to simple properties
                            showToolPanel={this.state.showToolPanel}
                            quickFilterText={this.state.quickFilterText}

                            // binding to an object property
                            icons={this.state.icons}

                            // binding to array properties
                            columnDefs={this.state.columnDefs}
                            rowData={this.state.rowData}

                            // no binding, just providing hard coded strings for the properties
                            suppressRowClickSelection="true"
                            rowSelection="multiple"
                            enableColResize="true"
                            enableSorting="true"
                            enableFilter="true"
                            groupHeaders="true"
                            rowHeight="22"
                        />
                    </div>
                    <div>
                        <div className="row">
                            <div className="col-sm-12"><h1>Rich Grid Example</h1></div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <h5>This example demonstrates many features of ag-Grid.</h5>
                                <p><span style={{fontWeight: 500}}>Select All/Clear Selection</span>: Select or Deselect
                                    All
                                    Rows</p>
                                <p><span style={{fontWeight: 500}}>Hide/Show Country Column</span>: Select or Deselect
                                    All
                                    Rows
                                    (expand the Employee column to show the Country column first)</p>
                                <p><span style={{fontWeight: 500}}>Toggle The Tool Panel</span>: Let your users Pivot,
                                    Group
                                    and
                                    Aggregate using the Tool Panel</p>
                                <p><span style={{fontWeight: 500}}>Refresh Data</span>: Dynamically Update Grid Data</p>
                                <p><span style={{fontWeight: 500}}>Quick Filter</span>: Perform Quick Grid Wide
                                    Filtering
                                    with
                                    the Quick Filter</p>
                                <p><span style={{fontWeight: 500}}>DOB Filter</span>: Set the DOB filter to 01/01/2000
                                    using
                                    the
                                    Filter API (expand the Employee column to show the DOB column)</p>
                                <p><span style={{fontWeight: 500}}>Custom Headers</span>: Sort, Filter and Render
                                    Headers
                                    using
                                    Header Components</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Grid & Column API</h4>
                                        <p className="card-text">Utilise Grid Features Programmatically Using the APIs
                                            Available</p>
                                        <a target="_blank" href="https://www.ag-grid.com/javascript-grid-api/"
                                           className="btn btn-primary">Grid API</a>
                                        <a target="_blank" href="https://www.ag-grid.com//javascript-grid-column-api/"
                                           className="btn btn-primary">Column API</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Header Components</h4>
                                        <p className="card-text">Customer the Header with React Components</p>
                                        <a target="_blank"
                                           href="https://www.ag-grid.com//javascript-grid-header-rendering/#headerComponent"
                                           className="btn btn-primary">Header Component</a>
                                        <a target="_blank"
                                           href="https://www.ag-grid.com//javascript-grid-header-rendering/#headerGroupComponent"
                                           className="btn btn-primary">Header Group Component</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Filters</h4>
                                        <p className="card-text">Filter with Quick Filters, Floating Filters, Built In
                                            Filters
                                            or Using the
                                            Filter API</p>
                                        <a target="_blank" href="https://www.ag-grid.com//javascript-grid-filter-quick/"
                                           className="btn btn-primary">Quick
                                            Filter</a>
                                        <a target="_blank"
                                           href="https://www.ag-grid.com//javascript-grid-floating-filter-component/"
                                           className="btn btn-primary">Floating Filters</a>
                                        <a target="_blank" href="https://www.ag-grid.com//javascript-grid-filtering/"
                                           className="btn btn-primary">Built in
                                            Filters</a>
                                        <a target="_blank"
                                           href="https://www.ag-grid.com//javascript-grid-filtering/#accessing-filter-component-instances"
                                           className="btn btn-primary">Filter API</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Tool Panel</h4>
                                        <p className="card-text">Let your users Pivot, Group and Aggregate using the
                                            Tool
                                            Panel</p>
                                        <a target="_blank" href="https://www.ag-grid.com//javascript-grid-tool-panel/"
                                           className="btn btn-primary">Tool Panel</a>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-8">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">The Rest</h4>
                                        <p className="card-text">Pinned Columns, Checkbox Selection, Customer Renderers,
                                            Data
                                            Updates</p>
                                        <a target="_blank"
                                           href="https://www.ag-grid.com/best-react-data-grid/?framework=react"
                                           className="btn btn-primary">React with ag-Grid</a>
                                        <a target="_blank" href="https://www.ag-grid.com//javascript-grid-pinning/"
                                           className="btn btn-primary">Pinned Column</a>
                                        <a target="_blank"
                                           href="https://www.ag-grid.com//javascript-grid-selection/#checkboxSelection"
                                           className="btn btn-primary">Checkbox Selection</a>
                                        <a target="_blank"
                                           href="https://www.ag-grid.com//javascript-grid-cell-rendering/"
                                           className="btn btn-primary">Cell
                                            Renderers</a>
                                        <a target="_blank" href="https://www.ag-grid.com/javascript-grid-data-update/"
                                           className="btn btn-primary">Updating Data</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
