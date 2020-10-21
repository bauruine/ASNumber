// main_frame,sub_frame, beacon,xmlhttprequest,csp_report,font,other,image
// in cache responseDetails.fromCache NO IP

function addIPtoTitle(responseDetails) {
	
	const tabId = responseDetails.tabId ;
	if (responseDetails.type === "image"){
		return ;
	}


	if (tabId){		
		if (! ipData[tabId])  ipData[tabId] = {} ;

		if(responseDetails.type === "main_frame"){
			ipData[tabId] = {};
		}

		if (tabId !== -1 && responseDetails.ip) {
					add_ips(responseDetails, tabId);
				}

		  }
		}
function add_ips(responseDetails, tabId) {
	let parser;
	if (responseDetails.ip) { // not from cache
		parser = document.createElement('a');
		parser.href = responseDetails.url;
		let hostname = parser.hostname
		let ip = responseDetails.ip;
		//if (!ipData[tabId][ip]) ipData[tabId][ip] = {};
		if (!ipData[tabId][ip]) {
			ipData[tabId][ip] = {
				"type": [responseDetails.type],
				"hostname": hostname
			}
		} else {
			if (!ipData[tabId][ip]['type'].includes(responseDetails.type)) {
				ipData[tabId][ip]['type'].push(responseDetails.type)
			}
		}
	}
}

// define variables
var ipData = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
	
  if (changeInfo.status === "complete") {
	chrome.pageAction.setTitle({
		tabId: tabId,title:"Show ASN"
	});	
    chrome.pageAction.show(tabId);
	var popup = chrome.pageAction.setPopup({tabId: tabId,popup:"popup.html#"+tabId}); 
  }
});


// for every webRequest get the hostname and ip
chrome.webRequest.onCompleted.addListener(  addIPtoTitle,  { urls: ["<all_urls>"] });
