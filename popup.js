function nsGhipUtil_load(){
	
	let tabId = parseInt(window.location.hash.replace('#','')) ;
	
	let asn = chrome.extension.getBackgroundPage().asn[tabId]  ;

	for (let i in asn ){
		let a = document.createElement('a');
		let br = document.createElement('br');
		a.href = 'https://bgp.he.net/AS'+asn[i].asn;
		a.text = "AS" + asn[i].asn + ' ' + asn[i].asname;
		let im = document.createElement('img');
		im.src = "icons/clipboard.png";
		im.data = {asn : asn[i].asn};
		im.className="copy";
		im.onclick = copyToClipboard ;
		document.querySelector('#asn').appendChild(im);
		document.querySelector('#asn').appendChild(a);
		document.querySelector('#asn').appendChild(br);
	}
	
	
	let ips = chrome.extension.getBackgroundPage().ipData[tabId]  ;
	let prefix = chrome.extension.getBackgroundPage().prefix[tabId]  ;
	for (let i in asn ){
		let docFragment = document.createDocumentFragment();
		let text = document.createTextNode("AS: " + asn[i].asn);
		docFragment.appendChild(text);

		let br = document.createElement('BR');
		docFragment.appendChild(br);
		let text_0 = document.createTextNode("Prefixes: " + asn[i].prefixes);
		docFragment.appendChild(text_0);

		let br_0 = document.createElement('BR');
		docFragment.appendChild(br_0);
		let text_1 = document.createTextNode("AS name: " + asn[i].asname);
		docFragment.appendChild(text_1);

		let br_1 = document.createElement('BR');
		docFragment.appendChild(br_1);
		let text_2 = document.createTextNode("AS desc: " + asn[i].asdesc);
		docFragment.appendChild(text_2);

		let br_2 = document.createElement('BR');
		docFragment.appendChild(br_2);
		let text_3 = document.createTextNode("Country: " + asn[i].country);
		docFragment.appendChild(text_3);

		let br_3 = document.createElement('BR');
		docFragment.appendChild(br_3);
		let text_4 = document.createTextNode("RIR: " + asn[i].rir);
		docFragment.appendChild(text_4);

		let br_4 = document.createElement('BR');
		docFragment.appendChild(br_4);
		for (let p in prefix[asn[i].asn]){
			let text_5 = document.createTextNode("Prefix: " + prefix[asn[i].asn][p]);
			docFragment.appendChild(text_5);
			let br_5 = document.createElement('BR');
			docFragment.appendChild(br_5);
		}
		let br_6 = document.createElement('BR');
		docFragment.appendChild(br_6);
		let br_7 = document.createElement('div')
		docFragment.appendChild(br_7);

		document.querySelector('#asns').appendChild(docFragment);
		for (let count in ips[asn[i].asn] ){
			let a = document.createElement('div');
			let text_node = document.createTextNode(ips[asn[i].asn][count].hostname + ' ('+ips[asn[i].asn][count]['type'].join(", ")+') : ' + count);
			a.appendChild(text_node)
			document.querySelector('#ips').appendChild(a);
		}
	}
	
}
window.addEventListener("load", nsGhipUtil_load ,false);

function copyToClipboard(){
	let copyFrom = document.createElement("textarea");
	  copyFrom.textContent = this.data.asn;
	  let body = document.getElementsByTagName('body')[0];
	  body.appendChild(copyFrom);
	  copyFrom.select();
	  document.execCommand('copy');
	  body.removeChild(copyFrom);  
	  this.style.border= "1px solid red";
	  let that  = this;
	  setTimeout(function(){
		  that.style.border = 'none';
	  },1000);
}

