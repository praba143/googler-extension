/**
 * Update query_box 'value' attribute
 */
function updateQueryBox(value) {
    var space = "";
    if (document.search_form.query_tb.value != "")
        space = " ";
    document.search_form.query_tb.value = document.search_form.query_tb.value + space + value;
    document.search_form.query_tb.focus();
}

/**
 * Create results list
 */
function showResults (tmpresults) {

    // Clear ResultsList
    var rl_div = document.getElementById('ResultsList');
    rl_div.innerHTML = "";

    // Show URL and description
    if ( document.getElementById("InfoShowed_description").checked ) {

        var longline = '<input name="url_cb_NUMBER" id="url_cb_NUMBER" type="checkbox" /><a id="url_NUMBER" href="javascript:openLink(\'URL\')">TITLE</a><div class="ResultsEntryDesc">DESCRIPTION</div><div class="ResultsEntryLink">URL<label style="color: #4171DA;"> - [SEARCHENGINE]</label></div>';

        for ( var res1 in tmpresults ) {
            var newdiv = document.createElement('div');
            newdiv.setAttribute("name", "line_" + res1);
            newdiv.innerHTML = longline.replace(/NUMBER/g, res1).replace(/URL/g, tmpresults[res1].url).replace(/TITLE/g, tmpresults[res1].title).replace(/DESCRIPTION/g, tmpresults[res1].desc).replace(/SEARCHENGINE/g, tmpresults[res1].se);

            rl_div.appendChild(newdiv);
        }

    } // if

    // Show only URL
    else {

        var shortline = '<input name="url_cb_NUMBER" id="url_cb_NUMBER" type="checkbox" /><a id="url_NUMBER" href="javascript:openLink(\'URL\')">URL</a>';

        for ( var res2 in tmpresults ) {
            var newdiv = document.createElement('div');
            newdiv.setAttribute("name", "line_" + res2);
            newdiv.innerHTML = shortline.replace(/NUMBER/g, res2).replace(/URL/g, tmpresults[res2].url);

            rl_div.appendChild(newdiv);
        }

    } // else

    var total = 0;
    for ( var i in _results )
        total += _results[i].length;

    // Update Results number
    document.getElementById("ResultsHeader").innerHTML = tmpresults.length + " showed results from " + total;
}

/**
 * Open a link in a new tab
 */
function openLink (url_link) {
    chrome.tabs.create({url:url_link, selected:false});
}


/**
 * Open all selected links
 */
function openSelectedLinks () {

    //var rl_div = document.getElementById('ResultsList');
    // id="url_cb_NUMBER"

    for ( res in _results ) {

        if ( document.getElementById('url_cd_' + res).getAttribute ("selected") )
            openLink ( document.getElementById('url_' + res).getAttribute ("href") );
    }
}

/**********************************************
*                Filters                      *
***********************************************/

function changeState (id) {
    var cb = document.getElementById(id);
    alert (cb.checked);
    if ( cb.checked )
        cb.checked = false;
    else
        cb.checked = true;
}

/**
 * Show filters
 */
function printFilters () {
    // Parameter filter
    if ( _filters_parameters.length == 2 )
        // Show params filter
        document.getElementById("ParamsFilter").style.display = 'inline';
    else
        document.getElementById("ParamsFilter").style.display = 'none';

    // Protocol filter
    if ( _filters_protocol.length > 0 ) {
        // Show protocols filter
        document.getElementById("ProtocolFilter").style.display = 'inline';

        // Fill up protocols filter  ;changeState (\'protocol_FILTER\')
        var protocol_line = '<input name="protocol_FILTER" id="protocol_FILTER" type="checkbox" checked="true" onclick="applyFilters()">FILTER</input>';
        var protocol_div = document.getElementById('ProtocolFilterFilters');
        protocol_div.innerHTML = "";
        for ( var fp in _filters_protocol ) {
            var newdivp = document.createElement('div');
            newdivp.setAttribute("name", "protocol_filter_" + _filters_protocol[fp]);
            newdivp.innerHTML = protocol_line.replace(/FILTER/g, _filters_protocol[fp]);

//            var newdivp = document.createElement('input');
//            newdivp.setAttribute("name", "protocol_" + _filters_protocol[fp]);
//            newdivp.setAttribute("id", "protocol_" + _filters_protocol[fp]);
//            newdivp.setAttribute("type", "checkbox");
//            newdivp.setAttribute("checked", "true");
//            newdivp.setAttribute("onclick", "applyFilters()");
//            newdivp.innerHTML = _filters_protocol[fp];

            protocol_div.appendChild(newdivp);
        }
    }
    else
        document.getElementById("ProtocolFilter").style.display = 'none';

    // Protocol filter
    if ( _filters_extension.length > 0 ) {
        // Show protocols filter
        document.getElementById("ExtensionFilter").style.display = 'inline';

        // Fill up protocols filter
        var extension_line = '<input name="extension_FILTER" id="extension_FILTER" type="checkbox" checked="true" onclick="applyFilters()">FILTER</input>';
        var extension_div = document.getElementById('ExtensionFilterFilters');
        extension_div.innerHTML = "";
        for ( var fe in _filters_extension ) {
            var newdive = document.createElement('div');
            newdive.setAttribute("name", "protocol_filter_" + _filters_extension[fe]);
            newdive.innerHTML = extension_line.replace(/FILTER/g, _filters_extension[fe]);

            extension_div.appendChild(newdive);
        }
    }
    else
        document.getElementById("ExtensionFilter").style.display = 'none';
}


/**
 * Show/Hide filters panel
 */
function showHideLateralPanel(panelID, iconID) {
    var div = document.getElementById(panelID);
    if ( div.style.display == "none" ) { //&& (_filters_extension.length > 0 || _filters_protocol.length > 0 || _filters_parameters.length > 0) ) {
        div.style.display = "inline";
        document.getElementById(iconID).src = "collapse.png";
    }
    else {
        div.style.display = "none";
        document.getElementById(iconID).src = "expand.gif";
    }
}

/**
 * Show filters panel
 */
function showFilters() {
    document.poppedLayer = eval('document.getElementById("FiltersPanel")');
    document.poppedLayer.style.display = "inline";
}
