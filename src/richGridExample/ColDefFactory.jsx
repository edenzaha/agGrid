import SkillsCellRenderer from './SkillsCellRenderer.jsx';
import NameCellEditor from './NameCellEditor.jsx';
import MyCellEditor from './MyTextEditor.jsx';
import ProficiencyCellRenderer from './ProficiencyCellRenderer.jsx';
import RefData from './RefData';
import SkillsFilter from './SkillsFilter.jsx';
import ProficiencyFilter from './ProficiencyFilter.jsx';
import HeaderGroupComponent from './HeaderGroupComponent.jsx';

export default class ColDefFactory {

    createColDefs() {
        return [
            {
                headerName: '#',
                width: 30,
                checkboxSelection: true,
                suppressSorting: true,
                suppressMenu: true,
                suppressFilter: true,
                pinned: true
            },
            {
                headerName: 'Employee',
    
                headerGroupComponentFramework: HeaderGroupComponent,
                children: [
                    {
                        headerName: "Name",
                        field: "name",
                        enableRowGroup: true,
                        enablePivot: true,
                        //width: 250,
                        
                        pinned: true,
                        editable: true,
                        resizeable:true,
                        rowGroup: true,
                        cellClass :"long-column",
                        hide: true,                      
                        cellRenderer: function(params){
                            if (params.node.group)
                                return '<div class="long-column">' + params.value +'</div>';
                            else 
                                return params.value;
                        },                     
                        // use a React cellEditor
                        cellEditorFramework: NameCellEditor
                    },
                    {
                        headerName: "Country",
                        field: "country",
                        //width: 150,
                        enableRowGroup: true,
                        enablePivot: true,
                        // an example of using a non-React cell renderer
                        cellRenderer: countryCellRenderer,
                        pinned: false,
                        filterParams: {
                            cellRenderer: countryCellRenderer,
                            cellHeight: 20
                        }
                    },
                    {
                        headerName: "DOB",
                        field: "dob",
                       // width: 110,
                        enableRowGroup: true,
                        enablePivot: true,
                        filter: 'date',
                        pinned: true,
                        cellRenderer: function (params) {
                            return pad(params.value.getDate(), 2) + '/' +
                                pad(params.value.getMonth() + 1, 2) + '/' +
                                params.value.getFullYear();
                        },
                        columnGroupShow: 'open'
                    }
                ]
            },
            {
                headerName: 'IT Skills',
                children: [
                    {
                        headerName: "Skills",
                        //width: 125,
                        suppressSorting: true,
                        field: 'skills',
                        enableRowGroup: true,
                        enablePivot: true,
                        // supply a React component
                        cellRendererFramework: SkillsCellRenderer,
                        // supply a React component
                        filterFramework: SkillsFilter
                    },
                    {
                        headerName: "Proficiency",
                        field: "proficiency",
                        //width: 135,
                        enableValue: true,
                        // supply a React component
                        cellRendererFramework: ProficiencyCellRenderer,
                        // supply a React component
                        filterFramework: ProficiencyFilter
                    }
                ]
            },
            {
                headerName: 'Contact',
                children: [
                    {headerName: "Mobile",cellEditorFramework: MyCellEditor, resizeable:true,  editable: true, field: "mobile", filter: 'text'},
                    {headerName: "Land-line",cellEditorFramework: NameCellEditor, resizeable:true, editable: true, field: "landline",  filter: 'text'},
                    {headerName: "Address", field: "address", filter: 'text'}
                ]
            }
        ];
    }
}

// this is a simple cell renderer, putting together static html, no
// need to use React for it.
function countryCellRenderer(params) {
    if (params.value) {
        const flag = "<img border='0' width='15' height='10' " +
            "style='margin-bottom: 2px' src='http://flags.fmcdn.net/data/flags/mini/"
            + RefData.COUNTRY_CODES[params.value] + ".png'>";
        return flag + " " + params.value;
    } else {
        return null;
    }
}

//Utility function used to pad the date formatting.
function pad(num, totalStringSize) {
    let asString = num + "";
    while (asString.length < totalStringSize) asString = "0" + asString;
    return asString;
}
