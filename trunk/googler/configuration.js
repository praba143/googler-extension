
/**********************************************
*                Configuration                *
***********************************************/

search_engines = [];
delay = 1;

function loadConfiguration (configuration) {
    // Load Google Info
    search_engines.push ( loadGoogleInfo() );
    search_engines.push ( loadBingInfo() );

}

/**
 * Load Google Info
 */
function loadGoogleInfo () {
    // http://www.googleguide.com/advanced_operators.html
    var info = [];

    info["Name"] = "Google";
    info["URL"] = "http://www.google.com";
    info["Prefix"] = "/search?hl=en&num=100&filter=0&q=";
    info["Start"] = "&start=";
    info["Operators"] = ["allinanchor", "allintext", "allintitle", "allinurl", "cache", "define", "filetype", "id", "inanchor", "info", "intext", "intitle", "inurl", "link", "phonebook", "related", "site"];

    info["Regexp"] = '<div class=vsc sig=[^>]*?><span class=tl><h3 class="r"><a href="[^"]*?" class=l onmousedown="[^"]*?">.*?</a></h3><button class=ws title=""></button><button class=vspib></button>.*?</span><div class="s">.*?<span class=f><cite>.*?</cite> - <span class=gl><a href="[^"]*?" onmousedown="[^"]*?">';

    info["RegexpURL"] = '<a href="[^"]*?" class=l';
    info["ExtractURL"] = function (data) {
        var pattern = new RegExp ('<a href="[^"]*?" class=l', "gi");
        var res = data.match(pattern);
        if ( res )
            return res[0].split('"')[1]
        else
            return "";
    };

    info["RegexpTitle"] = '<a href="[^"]*" class=l onmousedown="[^"]*">.*?</a></h3>';
    info["ExtractTitle"] = function (data) {
        var pattern = new RegExp ('onmousedown="[^"]*">.*?</a></h3>', "gi");
        var res = data.match(pattern);
        if ( res )
            return res[0].substring ( res[0].indexOf('>')+1, res[0].length-9 );
        else
            return "";
    };

    //info["RegexpDesc"] = 'class="s">.*?<br><span';
    info["RegexpDesc"] = '</span><div class="s">.*?<br><span';
    info["ExtractDesc"] = function (data) {
        var pattern = new RegExp ('</span><div class="s">.*?<br><span', "gi");
        var res = data.match(pattern);
        if ( res )
            return res[0].substring (22, res[0].length-9);
        else
            return "";
    }

    info["DescLimits"] = [10, 9];
    //info[""] = "";

    return info;
}

/**
 * Load Bing Info
 */
function loadBingInfo () {
    // http://www.googleguide.com/advanced_operators.html
    var info = [];

    info["Name"] = "Bing";
    info["URL"] = "http://www.bing.com";
    info["Prefix"] = "/search?q=";
    info["Start"] = "&first=";
    info["Operators"] = ["contains", "filetype", "inanchor", "inbody", "intitle", "ip", "language", "location", "prefer", "site", "feed", "hasfeed"];

    info["Regexp"] = '<div class="sa_cc"><div class="sb_tlst"><h3><a href="[^"]*?" onmousedown="[^"]*?">.*?</a></h3></div>.*?<div class="sb_meta"><cite>';

    info["RegexpURL"] = '<h3><a href="[^"]*?" onmousedown';
    info["ExtractURL"] = function (data) {
        var pattern = new RegExp ('<h3><a href="[^"]*?" onmousedown', "gi");
        var res = data.match(pattern);
        if ( res )
            return res[0].split('"')[1]
        else
            return "";
    };

    info["RegexpTitle"] = 'onmousedown="[^"]*">.*?</a></h3>';
    info["ExtractTitle"] = function (data) {
        var pattern = new RegExp ('onmousedown="[^"]*">.*?</a></h3>', "gi");
        var res = data.match(pattern);
        if ( res )
            return res[0].substring ( res[0].indexOf('>')+1, res[0].length-9 );
        else
            return "";
    };

    info["RegexpDesc"] = '<p>.*?</p><div';
    info["ExtractDesc"] = function (data) {
        var pattern = new RegExp ('<p>.*?</p><div', "gi");
        var res = data.match(pattern);
        if ( res )
            return res[0].substring (3, res[0].length-8);
        else
            return "";
    }
    
    info["DescLimits"] = [7, 8];
    info["Help"] = "http://msdn.microsoft.com/en-us/library/ff795667.aspx";
    //info[""] = "";

    return info;
}


/**
 * Load Yahoo Info
 */
function loadYahooInfo () {
    // http://www.googleguide.com/advanced_operators.html
    var info = [];

    info["Name"] = "Yahoo";
    info["URL"] = "http://www.google.com";
    info["Prefix"] = "/search?hl=en&num=100&filter=0&q=";
    info["Start"] = "&start=";
    info["Operators"] = ["allinanchor", "allintext", "allintitle", "allinurl", "cache", "define", "filetype", "id", "inanchor", "info", "intext", "intitle", "inurl", "link", "phonebook", "related", "site"];
    info["Regexp"] = '<a class="yschttl spt" href="[^"]*"';
    //info[""] = "";

    return info;
}


/*
 *        

<searchEngineSignature>
<searchEngine>
	<Name>Bing</Name>
	<Prefix>L3Jlc3VsdHMuYXNweD9xPQ==</Prefix>
	<Server>http://search.msn.com</Server>
	<Matchstring>V2ViIHJlc3VsdHNccy4qXHNvZlxzKC4qPyk8XC9zcGFuPg==</Matchstring>
	<ResultsMatchstring>PGxpPjxoMz48YSBocmVmPSJbXiJdKj8i</ResultsMatchstring>
	<NextMatchstring>Lio8YVxzK2NsYXNzPVwiblBcIiBocmVmPVwiKC4qPylcIj5OZXh0PFwvYT48XC9kaXY+</NextMatchstring>
	<CacheMatchstring>PGxpXHNjbGFzcz1cImNhY2hlZFwiPjxiPiZcIzAxODM7PFwvYj5cczxhIGhyZWY9XCIoLio/KVwiPkNhY2hlZCBwYWdlPFwvYT4=</CacheMatchstring>
	<Site>IHNpdGUlM0E=</Site>
	<Ip>IGlwJTNB</Ip>
	<Intitle>IGludGl0bGUlM0E=</Intitle>
	<Inurl>IGludXJsJTNB</Inurl>
	<Filetype>IGZpbGV0eXBlJTNB</Filetype>
</searchEngine>


<searchEngine>
	<Name>Yahoo</Name>
	<Prefix>L3NlYXJjaD9wPQ==</Prefix>
	<Server>search.yahoo.com</Server>
	<Matchstring>PHNwYW4gaWQ9XCJpbmZvdG90YWxcIj4oLio/KVs8L3NwYW4+XHN8XHNmcm9tXQ==</Matchstring>
	<ResultsMatchstring>eXNjaHR0bFxzaHJlZj1cIiguKj8pXCJccz4=</ResultsMatchstring>
	<NextMatchstring>PGEgaWQ9InBnLW5leHQiIGNsYXNzPSJwZyIgaHJlZj1cIiguKj8pXCI+TmV4dA==</NextMatchstring>
	<CacheMatchstring>PGEgaHJlZj1cIiguKj8pXCI+Q2FjaGVkPFwvYT4=</CacheMatchstring>
	<Site>IHNpdGUlM0E=</Site>
	<Ip>IHNpdGUlM0E=</Ip>
	<Intitle>IGludGl0bGUlM0E=</Intitle>
	<Inurl>IGludXJsJTNB</Inurl>
	<Filetype>JnZmPQ==</Filetype>
</searchEngine>
</searchEngineSignature>
*/