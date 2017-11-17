
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
		if (! css[tabId])  css[tabId] = {} ;
		if (! js[tabId])  js[tabId] = {} ;
		if (! currentDomainIP[tabId] ) currentDomainIP[tabId] = {} ;
		
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
			
		if(responseDetails.type == "script"){			
			js[tabId][parser.pathname]  = {				
						"pathname" : parser.pathname 
						, "url" : responseDetails.url
						,"origin":responseDetails.originUrl 
				
			};
		}
		if (responseDetails.type=="stylesheet"){
			css[tabId][parser.pathname]  = {				
						"pathname" : parser.pathname 
						, "url" : responseDetails.url
						,"origin":responseDetails.originUrl 
				
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
var currentDomainIP = {}; var ipData ={} ; var css ={} ; var js = {} ;

//browser.tabs.onCreated.addListener((tab) => {  initArrays(tab.tabId);});
//browser.tabs.onRemoved.addListener((tabId, removeInfo) => {  initArrays(tabId);});
//browser.tabs.onActivated.addListener((activeInfo) => {  if (!newReq[activeInfo.tabId]) {    initArrays(activeInfo.tabId);  }});
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	
  if (changeInfo.status == "complete") {	  
	browser.pageAction.setTitle({
		tabId: tabId,title:"Show IP's - Loaded Css/Js"
	});	
    browser.pageAction.show(tabId);
	var popup = browser.pageAction.setPopup({tabId: tabId,popup:"popup.html#"+tabId}); 
  }
});

// for every webRequest get the hostname and ip
browser.webRequest.onCompleted.addListener(  addIPtoTitle,  { urls: ["<all_urls>"] });