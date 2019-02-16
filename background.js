// main_frame,sub_frame, beacon,xmlhttprequest,csp_report,font,other,image
// in cache responseDetails.fromCache NO IP

function addIPtoTitle(responseDetails) {
	
	var tabId = responseDetails.tabId ;
	if (responseDetails.type == "image"){
		return ;
	}


	if (tabId){		
		if (! ipData[tabId])  ipData[tabId] = {} ;
		if (! asn[tabId])  asn[tabId] = {} ;
		if (! prefix[tabId]) prefix[tabId] = {};
		if (! processedIps[tabId]) processedIps[tabId] = {};

		if(responseDetails.type == "main_frame"){
			asn[tabId] = {} ;
			ipData[tabId] = {};
			prefix[tabId] = {};
			ipData[tabId] = {} ;
			processedIps[tabId] = {} ;
		}

		if (!(tabId == -1) && (!(responseDetails.ip in processedIps[tabId])) && responseDetails.ip) { 
		      processedIps[tabId][responseDetails.ip] = true;
			  const requestURL = "https://asnumber.tuxli.ch/asnumber/asnum?ip=" + responseDetails.ip;
			  const driveRequest = new Request(requestURL, {
				method: "GET"
			  });
			  fetch(driveRequest)
				.then(function(response) { return response.json(); })
				.then(function(json) {
					asn[tabId][json.asn] = {
						"asn" : json.asn,
						"prefixes" : json.prefixes,
						"asname" : json.asname,
						"asdesc" : json.asdesc,
						"country" : json.country,
						"rir" : json.rir,
					};
					if (! prefix[tabId][json.asn]) {
						prefix[tabId][json.asn] = [json.prefix]
					}
					else {
						if (! prefix[tabId][json.asn].includes(json.prefix))
						prefix[tabId][json.asn].push(json.prefix)
					}
					processedIps[tabId][responseDetails.ip] = json.asn;
					add_ips(responseDetails, processedIps, tabId);
				});
		}
		else if (tabId != -1 && responseDetails.ip) {
			add_ips(responseDetails, processedIps, tabId);
		}

  }
}
function add_ips(responseDetails, processedIps, tabId) {
	if ( responseDetails.ip){ // not from cache 
		var reqAsn = processedIps[tabId][responseDetails.ip];
        parser = document.createElement('a');
        parser.href = responseDetails.url;
		hostname = parser.hostname
		if (! ipData[tabId][reqAsn])  ipData[tabId][reqAsn] = {} ;
		if (! ipData[tabId][reqAsn][responseDetails.ip]) {
			console.log("adding " + responseDetails.ip + " with hostname: " + hostname + " to asn: " + reqAsn + " and tabId" + tabId)
			ipData[tabId][reqAsn][responseDetails.ip] = {
				"type": [responseDetails.type],
				"hostname": hostname
			}
		}
		else {
			if (! ipData[tabId][reqAsn][responseDetails.ip]['type'].includes(responseDetails.type)) {
				console.log("adding " + responseDetails.ip + " with hostname: " + hostname + " to asn: " + reqAsn + " and type " + responseDetails.type)
				ipData[tabId][reqAsn][responseDetails.ip]['type'].push(responseDetails.type)
			}
		}
	}
}

// define variables
var ipData ={}; var asn ={}; var prefix = {}; var processedIps = {};

//browser.tabs.onCreated.addListener((tab) => {  initArrays(tab.tabId);});
//browser.tabs.onRemoved.addListener((tabId, removeInfo) => {  initArrays(tabId);});
//browser.tabs.onActivated.addListener((activeInfo) => {  if (!newReq[activeInfo.tabId]) {    initArrays(activeInfo.tabId);  }});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	
  if (changeInfo.status == "complete") {	  
	chrome.pageAction.setTitle({
		tabId: tabId,title:"Show ASN"
	});	
    chrome.pageAction.show(tabId);
	var popup = chrome.pageAction.setPopup({tabId: tabId,popup:"popup.html#"+tabId}); 
  }
});


// for every webRequest get the hostname and ip
chrome.webRequest.onCompleted.addListener(  addIPtoTitle,  { urls: ["<all_urls>"] });
