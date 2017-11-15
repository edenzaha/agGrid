'use strict';

import React from "react";
import {render} from "react-dom";
import {BrowserRouter} from "react-router-dom";

import "ag-grid-root/dist/styles/ag-grid.css";
import "ag-grid-root/dist/styles/theme-fresh.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

import App from "./App";

// only required when using enterprise features
import {LicenseManager} from "ag-grid-enterprise/main";
LicenseManager.setLicenseKey("ag-Grid_Evaluation_License_Not_For_Production_1Devs20_January_2018__MTUxNjQwNjQwMDAwMA==4091ca44a0ac9c86778d044f42c5edc1");

document.addEventListener('DOMContentLoaded', () => {
    render(
        <BrowserRouter>
            <App/>
        </BrowserRouter>,
        document.querySelector('#app')
    );
});

