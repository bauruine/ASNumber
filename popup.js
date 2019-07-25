function nsGhipUtil_load(){
	
	var tabId = parseInt(window.location.hash.replace('#','')) ;
	
	var asn = chrome.extension.getBackgroundPage().asn[tabId]  ;

	for (var i in asn ){
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.href = 'https://bgp.he.net/AS'+asn[i].asn;
		a.text = "AS" + asn[i].asn + ' ' + asn[i].asname;
		var im = document.createElement('img');
		im.src = "icons/clipboard.png";
		im.data = {asn : asn[i].asn};
		im.className="copy";
		im.onclick = copyToClipboard ;
		a.insertBefore(im, a.firstChild);
		li.appendChild(a);
		document.querySelector('ul#asn').appendChild(li);
	}
	
	
	var ips = chrome.extension.getBackgroundPage().ipData[tabId]  ;
	var prefix = chrome.extension.getBackgroundPage().prefix[tabId]  ;
	for (var i in asn ){

		var li = document.createElement('li');
		var table = document.createElement('table');
		var tbody = document.createElement('tbody');

		var as_id = createRow("AS", asn[i].asn);
		var prefixes = createRow("Prefixes", asn[i].prefixes);
		var as_name = createRow("AS Name", asn[i].asname);
		var as_desc = createRow("AS Desc", asn[i].asdesc);
		var country = createRow("Country", asn[i].country);
		var rir = createRow("RIR", asn[i].rir);

		tbody.append(as_id, prefixes, as_name, as_desc, country, rir);
		table.appendChild(tbody);

		for (var p in prefix[asn[i].asn]){
			var prefix_row = createRow("Prefix", prefix[asn[i].asn][p]);
			tbody.appendChild(prefix_row);
		}

		li.appendChild(table);
		document.querySelector('ul#asns').appendChild(li);

		for (var count in ips[asn[i].asn] ){
			var li = document.createElement('li');
			var a = document.createElement('div');
			var text = document.createTextNode(ips[asn[i].asn][count].hostname + ' ('+ips[asn[i].asn][count]['type'].join(", ")+') : ' + count);
			a.appendChild(text);

			li.appendChild(a);
			document.querySelector('ul#ips').appendChild(li);
		}
	}
	
}
window.addEventListener("load", nsGhipUtil_load ,false);

function createRow(name, value) {
	var row = document.createElement('tr');
	var col_name = document.createElement('td');
	var col_value = document.createElement('td');

	col_name.innerText = name;
	col_value.innerText = value;

	row.append(col_name, col_value);
	return row;
}

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

