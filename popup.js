function nsGhipUtil_load(){
	
	var tabId = parseInt(window.location.hash.replace('#','')) ;
	
	var asn = chrome.extension.getBackgroundPage().asn[tabId]  ;
	for (var i in asn ){
		var a = document.createElement('a');
		var br = document.createElement('br');
		a.href = 'https://bgp.he.net/AS'+asn[i].asn;
		a.text = "AS" + asn[i].asn + ' ' + asn[i].asname;
		var im = document.createElement('img');
		im.src = "icons/clipboard.png";
		im.data = {asn : asn[i].asn};
		im.className="copy";
		im.onclick = copyToClipboard ;
		document.querySelector('#asn').appendChild(im);
		document.querySelector('#asn').appendChild(a);
		document.querySelector('#asn').appendChild(br);
	}
	var ips = chrome.extension.getBackgroundPage().ipData[tabId]  ;
	for (var i in ips ){
		var a = document.createElement('div');
		a.title = ips[i].url;
		a.innerHTML = ips[i].hostname + ' ('+ips[i].type+') : ' + i;
		document.querySelector('#ips').appendChild(a);
	}
	
	
	for (var i in asn ){
		var a = document.createElement('a');
		var listItem = document.createElement('div');
		listItem.innerHTML = 'AS' + asn[i].asn + '</br>';
		listItem.innerHTML += 'AS name: ' + asn[i].asname + '</br>';
		listItem.innerHTML += 'AS desc: ' +asn[i].asdesc + '</br>';
		listItem.innerHTML += 'Country: ' + asn[i].country + '</br>';
		listItem.innerHTML += 'RIR: ' + asn[i].rir + '</br>';
		listItem.innerHTML += 'Prefix: ' + asn[i].prefix + '</br></br>';

		document.querySelector('#asns').appendChild(listItem);
	}
	
}
window.addEventListener("load", nsGhipUtil_load ,false);

function copyToClipboard(){
	var copyFrom = document.createElement("textarea");
	  copyFrom.textContent = this.data.asn;
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

