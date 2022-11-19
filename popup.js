const nsGhipUtil_load = async () => {

    const tabId = parseInt(window.location.hash.replace('#', ''));

	const getbgpurl = browser.storage.sync.get("bgpurl");

	function onError(error) {
		console.log(`Error: ${error}`);
	}

	async function getasn(item) {
		let bgpurl = "https://bgp.tools/as/";
		if (item.bgpurl) {
			bgpurl = item.bgpurl;
		}
		let ipData = chrome.extension.getBackgroundPage().ipData[tabId];
		let asn = await getAsnDetails(ipData);
		//console.log(asn);
		//console.log(Object.keys(asn))

		for (let i in asn) {
			let a = document.createElement('a');
			let br = document.createElement('br');
			a.href = bgpurl + asn[i].asn;
			a.text = "AS" + asn[i].asn + ' ' + asn[i].asname;
			let im = document.createElement('img');
			im.src = "icons/clipboard.png";
			im.data = {asn: asn[i].asn};
			im.className = "copy";
			im.onclick = copyToClipboard;
			document.querySelector('#asn').appendChild(im);
			document.querySelector('#asn').appendChild(a);
			document.querySelector('#asn').appendChild(br);
		}

		for (let i in asn) {
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
			asn[i].prefix.forEach(prefix => {
				console.log(`prefix ${asn[i].prefix}`)
				let text_5 = document.createTextNode("Prefix: " + prefix);
				docFragment.appendChild(text_5);
				let br_5 = document.createElement('BR');
				docFragment.appendChild(br_5);
			});
			let br_6 = document.createElement('BR');
			docFragment.appendChild(br_6);
			let br_7 = document.createElement('div')
			docFragment.appendChild(br_7);

			document.querySelector('#asns').appendChild(docFragment);

		}
		for (let count in ipData) {
			let a = document.createElement('div');
			let text_node = document.createTextNode(ipData[count].hostname + ' (' + ipData[count]['type'].join(", ") + ') : ' + count);
			a.appendChild(text_node)
			document.querySelector('#ips').appendChild(a);
		}
	}

	getbgpurl.then(getasn, onError);


}



async function getAsnDetails(ipData) {
    let asn = {};
    for (let ip in ipData) {
        const requestURL = "https://asnumber.tuxli.ch/asnumber/asnum?ip=" + ip;
        const response = await fetch(requestURL);
        const json = await response.json();
        if (!asn.hasOwnProperty(json.asn)) {
          asn[json.asn] = {
              "asn": json.asn,
              "prefixes": json.prefixes,
              "asname": json.asname,
              "asdesc": json.asdesc,
              "country": json.country,
              "rir": json.rir,
          };
        };

        if (!asn[json.asn]['prefix']) {
            asn[json.asn]['prefix'] = [json.prefix]
        } else {
            if (!asn[json.asn]['prefix'].includes(json.prefix))
                asn[json.asn]['prefix'].push(json.prefix)
        }
    }
    return asn;
}

window.addEventListener("load", nsGhipUtil_load, false);


function copyToClipboard() {
    let copyFrom = document.createElement("textarea");
    copyFrom.textContent = this.data.asn;
    let body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);
    this.style.border = "1px solid red";
    let that = this;
    setTimeout(function () {
        that.style.border = 'none';
    }, 1000);
}

