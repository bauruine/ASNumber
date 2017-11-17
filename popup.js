

function nsGhipUtil_load(){
	
	document.querySelector('#version').innerHTML = browser.runtime.getManifest().version ;
	
	var tabId = parseInt(window.location.hash.replace('#','')) ;
	
	var ip = chrome.extension.getBackgroundPage().currentDomainIP[tabId] ;
	for (var i in ip ){
		var a = document.createElement('a');
		a.href = 'https://who.is/whois-ip/ip-address/'+ip[i].ip;
		a.text = ip[i].hostname + ' ' + ip[i].ip;
		var im = document.createElement('img');
		im.src = "icons/clipboard.png";
		im.data = {ip : ip[i].ip};
		im.className="copy";
		im.onclick = copyToClipboard ;
		document.querySelector('#ip').appendChild(im);
		document.querySelector('#ip').appendChild(a);
	}
	var ips = chrome.extension.getBackgroundPage().ipData[tabId]  ;
	for (var i in ips ){
		var a = document.createElement('div');
		a.title = ips[i].url;
		a.innerHTML = ips[i].hostname + ' ('+ips[i].type+') :' + i;
		document.querySelector('#ips').appendChild(a);
	}
	
	
	var css = chrome.extension.getBackgroundPage().css[tabId]  ;
	for (var i in css ){
		var a = document.createElement('a');
		a.href = css[i].url;
		a.title = css[i].url;
		a.text = css[i].url; //i.substring(i.lastIndexOf('/')+1);
		document.querySelector('#css').appendChild(a);
	}
	
	var js = chrome.extension.getBackgroundPage().js[tabId]  ;
	for (var i in js ){
		var a = document.createElement('a');
		a.href = js[i].url;
		a.title = js[i].url;
		a.text = js[i].url; //i.substring(i.lastIndexOf('/')+1)
		document.querySelector('#js').appendChild(a);
	}
	
}
window.addEventListener("load", nsGhipUtil_load ,false);

function copyToClipboard(){
	var copyFrom = document.createElement("textarea");
	  copyFrom.textContent = this.data.ip;
	  var body = document.getElementsByTagName('body')[0];
	  body.appendChild(copyFrom);
	  copyFrom.select();
	  document.execCommand('copy');
	  body.removeChild(copyFrom);  
	  this.style.border= "1px solid red";
	  var that  = this;
	  setTimeout(function(){
		  that.style.border = 'none';
	  },1000);
}