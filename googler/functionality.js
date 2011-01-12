
/***************************************
 * Functionality code of the extension *
 ***************************************/


/***************************************
 *          Global Variables           *
 ***************************************/

/**
 * Results List
 */
//results = ["http://1.com", "https://2.es"];
_results = [];

_sortedResults = [];

/**
 * File filters
 */
//filters_extension = ['asp', 'html', 'txt'];
//_filters_protocol = ['http', 'https'];
//_filters_parameters = ['with', 'without'];
_filters_extension = [];
_filters_protocol = [];
_filters_parameters = [];

/**
 * List of User-Agents
 */
_user_agents = [];


/***************************************
 *              Constants              *
 ***************************************/
RANKING_ORDER = 1;
ALPHABETICAL_ORDER = 2;


/**
 * Read initial information from configuration file
 */
function on_load () {
    // Get engines information file
    //alert (chrome.extension.getURL('data/engines.xml'));
    //sendHTTPRequest (chrome.extension.getURL('data/engines.xml'), loadConfiguration);
    loadConfiguration();

    // Load an User-Agent list
    sendHTTPRequest (chrome.extension.getURL('data/UA.txt'), loadUserAgents, "");

    // Give focus to query textbox
    document.forms[0].query_tb.focus();
}


/**********************************************
*              User-Agent Tasks               *
***********************************************/

/**
 * Load an User-Agent list on memory
 */
function loadUserAgents (response, params) {
    _user_agents = response.split ("\n");
    _user_agents.pop();
}

/**
 * Return a random User-Agent
 */
function getUserAgent () {
    return _user_agents[Math.ceil(Math.random()*_user_agents.length)-1];
}

/**********************************************
*                Search Tasks                 *
***********************************************/

/**
 * Listener Search Button
 */
function startSearch () {
    // Initialize global variables
    _results = [];
    _filters_extension = [];
    _filters_protocol = [];
    _filters_parameters = [];
    printFilters ();

    // Show Bottom Panel
    document.getElementById("Bottom").style.display = "inline";

    // Search for each search engine configured
    for ( var se_idx in search_engines ) {
        var se = search_engines[se_idx];
        var se_results = [];

        getSearchEngineResults ( se, se_results, 0 );
    }

}

/**
 * Get all results of a search engine
 */
function getSearchEngineResults (se, se_results, se_start) {
    // Request is created
    var request = se["URL"] + se["Prefix"];
    if ( se_start == 0 )
        request = request + escape(document.search_form.query_tb.value);
    else
        request = request + escape(document.search_form.query_tb.value) + se["Start"] + se_start;

    request = request.replace("+", "%2B");

    // It is sent and processed
    sendHTTPRequest (request, extractResults, [se, se_results, se_start]);
}

/**
 * Extract results from a response
 */
function extractResults (response, params) {
    var se = params[0];
    var se_results = params[1];
    var se_start = params[2];

    // Extract all results
    var pattern = new RegExp (se["Regexp"], "gi");
    var items = response.match(pattern);

    // There is no results
    if (items == null) {
        var total = 0;
        for ( var j in _results )
            total += _results[j].length;
        alert ("total: " + total + "\ntotal orden: " + _sortedResults.length);
        
        _results[se["Name"]] = se_results; // TODO: PONER ANTES DE LA LLAMADA ANTERIOR
        updateShowedResults ();

        //updateShowedResults ();
//        mixResults (se_results);
//        showResults ( _results );
        //printFilters ();
        return;
    }

    // Preprocess results
    var mustcontinue = false;
    for ( var i=0 ; i<items.length ; i++ ) {
        var item = new Object;
        item.url = se["ExtractURL"] (items[i]);
        item.title = se["ExtractTitle"] (items[i]);
        item.desc = se["ExtractDesc"] (items[i]);
        item.se = se["Name"];

        if ( getIndexOf (se_results, item.url) < 0 ) {
            se_results.push(item);
            mustcontinue = true;

            // Get the differents filters
            var urlparts = getURLParts (item.url);
            if ( urlparts["extension"].length > 0 && _filters_extension.indexOf(urlparts["extension"]) < 0 ) {
                _filters_extension.push ( urlparts["extension"] );
                _filters_extension.sort();
            }
            if ( urlparts["protocol"].length > 0 && _filters_protocol.indexOf(urlparts["protocol"]) < 0 )
                _filters_protocol.push ( urlparts["protocol"] );
            if ( urlparts["params"].length > 0 && _filters_parameters.indexOf("with") < 0 )
                _filters_parameters.push ( "with" );
            if ( urlparts["params"].length == 0 && _filters_parameters.indexOf("without") < 0 )
                _filters_parameters.push ( "without" );
        }
    }

    // There were more results
    if (mustcontinue) {
        se_start += items.length;
        getSearchEngineResults (se, se_results, se_start);

        _results[se["Name"]] = se_results; // TODO: PONER ANTES DE LA LLAMADA ANTERIOR
        updateShowedResults ();
//        mixResults (se_results);
//        showResults ( _results );
        printFilters ();
    }
    // There wasn't any different result
    else {
        _results[se["Name"]] = se_results; // TODO: PONER ANTES DE LA LLAMADA ANTERIOR
        updateShowedResults ();

        //_results[se["Name"]] = se_results;
        //updateShowedResults ();

//        mixResults (se_results);
//        showResults ( _results );
        printFilters ();
    }
}

/**
 * Return index of 'url' in 'se_results' or -1 if it doesn't exist
 */
function getIndexOf (se_results, url) {
    for ( var r in se_results ) {
        if ( se_results[r].url == url )
            return r;
    }
    return -1;
}

/**
 * Merge results depending on chosen 'order by' option
 */
function mergeResults (mergeType) {
    _sortedResults = [];

    // Order by Ranking
    if ( mergeType == RANKING_ORDER ) {

        var cont = true;
        for ( var i=0 ; cont ; i++ ) {
            cont = false;
            for ( var se in _results ) {
                if ( i >= _results[se].length ) // This 'se' doesn't have more results
                    continue;

                cont = true;
                _sortedResults.push( _results[se][i] );
            }
        }
        
    }
    
    // Order Alphabetically
    else if ( mergeType == ALPHABETICAL_ORDER ) {
        for ( var se in _results ) {
            _sortedResults = _sortedResults.concat(_results[se]);
        }
        _sortedResults.sort(compareResults);
    }
}

/**
 * Function to compare two objects 'item' of _results vector
 */
function compareResults (a, b) {
    if ( a.url < b.url )
        return -1;
    if ( a.url == b.url)
        return 0;
    return 1;
}

/**
 * Update showed results list
 */
function updateShowedResults () {

    // Merge results depending on 'order by' option
    if ( document.getElementById("Orderby_ranking").checked ) {
        mergeResults (RANKING_ORDER);
    }
    else
        mergeResults (ALPHABETICAL_ORDER);

    // Print results
    showResults ( _sortedResults );
}


/**
 * Mix results
 *
function mixResults (se_results) {
    if ( _results.length == 0 )
        _results = se_results;
    else {
        for ( var i=0 ; i<se_results ; i++ ) {
            if ( _results.indexOf(se_results[i]) < 0 ) {
                _results.push(se_results[i]);
            }
        }
    }
    _results.sort();
}*/




/**********************************************
*                HTTP Requests                *
***********************************************/

/**
 * Send an HTTP Request
 */
function sendHTTPRequest (request, callback, params) {

    var xhr = new XMLHttpRequest ();
    xhr.onreadystatechange = function() {
        if ( this.readyState == 4 ) {
            if ( this.status == 200 ) { // Requesst was success
                callback (xhr.responseText, params);
            }
            else if ( request.indexOf("chrome-extension://") >= 0 ) { // It's an internal resource
                callback (xhr.responseText, params);
            }
            else // Other case
                alert ("It is possible that you are being filtered.\nPlease check following link manually:\n" + request);
        }
    }


    xhr.open("GET", request, true);
    xhr.setRequestHeader("User-Agent" , getUserAgent());
    //xhr.setRequestHeader('User-Agent','Mozilla/5.0 (X11; U; Linux x86_64; en-US) AppleWebKit/534.10 (KHTML, like Gecko) Chroma/8.0.552.224 Safari/534.10');
//    chrome.cookies.remove({"url": "http://www.google.com", "name": "SS"});
//    chrome.cookies.remove({"url": "http://www.google.com", "name": "SID"});
//    chrome.cookies.remove({"url": "http://www.google.com", "name": "NID"});
//    chrome.cookies.remove({"url": "http://www.google.com", "name": "PREF"});
//    chrome.cookies.remove({"url": "http://www.google.com", "name": "HSID"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "SRCHUID"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "SRCHUSR"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "MUID"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "ANON"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "NAP"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "SRCHD"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "_UR"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "_SS"});
//    chrome.cookies.remove({"url": "http://www.bing.com", "name": "RMS"});
    xhr.send();
 }


/**********************************************
*                URL Process                  *
***********************************************/
/**
 * Get the different parts of an URL
 */
function getURLParts (url) {
    var params = "";
    var urlbody = "";

    var params_idx = url.indexOf ('?');
    if ( params_idx > 0 && url.length > params_idx+1 ) {
        params = url.substring ( params_idx+1 );
        urlbody = url.substring ( 0, params_idx );
    }
    else
        urlbody = url;

    var parts = urlbody.split ('/');
    var nofile = false;
    if ( parts[parts.length-1].length == 0 ) {
        parts.pop();
        nofile = true;
    }

    var protocol = "";
    var domain = "";
    var file = "";
    var folders = [];
    var fileext = ""

    if ( parts.length > 2 ) {
        if ( parts[1].length == 0 ) {
            protocol = parts[0].substr(0, parts[0].length-1);
            domain = parts[2];
        }
    }

    if ( parts.length > 3) {
        file = parts[parts.length-1];
        var fileext_idx = file.lastIndexOf ('.');
        if ( fileext_idx > 0 && file.length > fileext_idx+1 ) {
            fileext = file.substring ( fileext_idx+1 );
            if ( fileext.length > 5 || nofile )
                fileext = ""
        }
        for ( var i=3 ; i<parts.length-1 ; i++)
            folders.push (parts[i]);
    }

    var returnvalue = [];
    returnvalue["protocol"] = protocol.toUpperCase();
    returnvalue["domain"] = domain;
    returnvalue["folders"] = folders;
    returnvalue["file"] = (nofile ? "" : file);
    returnvalue["extension"] = fileext.toUpperCase();
    returnvalue["params"] = params;
    returnvalue["urlbody"] = urlbody;
    return returnvalue;
}


/**********************************************
*                Filters                      *
***********************************************/

/**
 * Apply selected filter to results list
 */
function applyFilters () {
    var sr = [];

    // Apply filter
    for ( var res in _results ) {
        // Analyze the URL
        var urlparts = getURLParts (_results[res].url);
        var mustbeadded = false;

        // Apply PROTOCOL filter
        for ( var pf in _filters_protocol ) {
            if ( document.getElementById("protocol_" + _filters_protocol[pf]).checked &&
                urlparts["protocol"] == _filters_protocol[pf] ) {
                    mustbeadded = true;
                    break; // It's not possible 2 protocols in the same URL
                }
        }

        if ( mustbeadded ) {
            // Apply PARAMETERS filter
            if ( urlparts["params"].length > 0 ) {
                if ( document.getElementById("params_with").checked )
                    mustbeadded = true;
                else
                    mustbeadded = false;
            }
            else {
                if ( document.getElementById("params_without").checked )
                    mustbeadded = true;
                else
                    mustbeadded = false;
            }
        }

        if ( mustbeadded ) {
            // Apply EXTENSION filter
            for ( var ef in _filters_extension ) {
                if ( urlparts["extension"] == _filters_extension[ef] ) {
                    if ( document.getElementById("extension_" + _filters_extension[ef]).checked ) {
                        mustbeadded = true;
                        break; // It's not possible 2 extensions in the same URL
                    }
                    else
                        mustbeadded = false;
                }
            }
        }

        if ( mustbeadded )
            sr.push(_results[res]);
    }

    // Show results
    showResults (sr);
}
