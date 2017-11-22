// main_frame,sub_frame, beacon,xmlhttprequest,csp_report,font,other,image
// in cache responseDetails.fromCache NO IP

function addIPtoTitle(responseDetails) {
	
	var tabId = responseDetails.tabId ;
	if (responseDetails.type == "image"){
		return ;
	}

	parser = document.createElement('a');
	parser.href = responseDetails.url;

	if (tabId){		
		if (! ipData[tabId])  ipData[tabId] = {} ;
		if (! currentDomainIP[tabId] ) currentDomainIP[tabId] = {} ;
		if (! asn[tabId])  asn[tabId] = {} ;
		if (! prefix[tabId]) prefix[tabId] = {};

		if ((responseDetails.ip != '2a01:4f8:130:8285::2' || responseDetails.ip != '213.239.205.247') && (!(responseDetails.ip in asn[tabId])) && responseDetails.ip != null && responseDetails.ip != undefined) { 
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
						"prefix" : json.prefix
					};
					if (! prefix[tabId][json.asn]) {
						prefix[tabId][json.asn] = [json.prefix]
					}
					else {
						if (! prefix[tabId][json.asn].includes(json.prefix))
						prefix[tabId][json.asn].push(json.prefix)
					}
				});
		}

		if(responseDetails.type == "main_frame" && !responseDetails.documentUrl ){
			if (currentDomainIP[tabId].hasOwnProperty(parser.pathname)){
				return;
			}
			currentDomainIP[tabId][parser.pathname]  = {				
						"pathname" : parser.pathname 
						, "hostname" : parser.hostname 
						, "url" : responseDetails.url
						,"origin":responseDetails.originUrl 
						,"ip" : responseDetails.ip
				
			};
		}
			
		
		if ( responseDetails.ip){ // not from cache 
			ipData[tabId][responseDetails.ip] = {
				"type" : responseDetails.type
			,"url":responseDetails.url ,"hostname":parser.hostname } ;
		}
  }
}

// define variables
var currentDomainIP = {}; var ipData ={}; var asn ={}; var prefix = {};

//browser.tabs.onCreated.addListener((tab) => {  initArrays(tab.tabId);});
//browser.tabs.onRemoved.addListener((tabId, removeInfo) => {  initArrays(tabId);});
//browser.tabs.onActivated.addListener((activeInfo) => {  if (!newReq[activeInfo.tabId]) {    initArrays(activeInfo.tabId);  }});
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	
  if (changeInfo.status == "complete") {	  
	browser.pageAction.setTitle({
		tabId: tabId,title:"Show ASN"
	});	
    browser.pageAction.show(tabId);
	var popup = browser.pageAction.setPopup({tabId: tabId,popup:"popup.html#"+tabId}); 
  }
});


// for every webRequest get the hostname and ip
browser.webRequest.onCompleted.addListener(  addIPtoTitle,  { urls: ["<all_urls>"] });
