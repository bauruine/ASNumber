function nsGhipUtil_load() {
    console.log("Loading Window...");

    var tabId = parseInt(window.location.hash.replace('#', ''));

    var asn = chrome.extension.getBackgroundPage().asn[tabId];
	var ips = chrome.extension.getBackgroundPage().ipData[tabId];
	var prefix = chrome.extension.getBackgroundPage().prefix[tabId];

    for (var i in asn) {
        if (i === "undefined") {
            continue;
        }

        // Create Buttons
        var li = document.createElement('li');
        var a = document.createElement('a');
        var span = document.createElement('span');
        a.classList.add("img-link");
        a.href = 'https://bgp.he.net/AS' + asn[i].asn;
        a.target = "_blank";
        span.innerText = "AS" + asn[i].asn + ' ' + asn[i].asname;
        a.appendChild(span)
        li.appendChild(a);
        document.querySelector('ul#asn').appendChild(li);


        // Create Table
		var tbody = document.createElement('tbody');
		var as_id = createRow("AS", asn[i].asn);
		var prefixes = createRow("Prefixes", asn[i].prefixes);
		var as_name = createRow("Name", asn[i].asname);
		var as_desc = createRow("Desc", asn[i].asdesc);
		var country = createRow("Country", asn[i].country);
		var rir = createRow("RIR", asn[i].rir);

		tbody.append(as_id, prefixes, as_name, as_desc, country, rir);

		// Add Prefixes to Table
		for (var p in prefix[asn[i].asn]) {
			var prefix_row = createRow("Prefix", prefix[asn[i].asn][p]);
			tbody.appendChild(prefix_row);
		}

		document.querySelector('table#asns').appendChild(tbody);


		// Create URL List
        var wrapper_li = document.createElement('li');
        var ul = document.createElement('ul')
		for (var count in ips[asn[i].asn]) {
			var li = document.createElement('li');
			var div = document.createElement('div');
			var span = document.createElement('span');
			var br = document.createElement("br");

			span.textContent = ips[asn[i].asn][count].hostname + ' (' + ips[asn[i].asn][count]['type'].join(", ") + '): ';
			span.classList.add("asn-hostname");
			div.appendChild(span);
			div.appendChild(br);

			var text = document.createTextNode(count);
			div.appendChild(text);
			li.appendChild(div);
            ul.appendChild(li);
		}
		wrapper_li.appendChild(ul);
        document.querySelector('ul#ips').appendChild(wrapper_li);
    }

    const highlighting = '#eee';
    const scrollers = document.getElementsByClassName("synced");
    const connector = document.getElementsByClassName("connector")[0];
    new SyncScroller(scrollers[0], scrollers[1], connector, highlighting);
}

function createRow(name, value) {
    var row = document.createElement('tr');
    var col_name = document.createElement('td');
    var col_value = document.createElement('td');

    col_name.classList.add("col-name");
    col_value.classList.add("col-value");

    col_name.innerText = name;
    col_value.innerText = value;

    row.append(col_name, col_value);
    return row;
}

function copyToClipboard() {
    var copyFrom = document.createElement("textarea");
    copyFrom.textContent = this.data.asn;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand('copy');
    body.removeChild(copyFrom);
    this.style.border = "1px solid red";
    var that = this;
    setTimeout(function () {
        that.style.border = 'none';
    }, 1000);
}

/*--------------------
  -----SyncScroller---
  --------------------*/

class SyncScroller {
    constructor(scroller1, scroller2, connector_canvas, highlightingColor) {
        this.scroller1 = scroller1;
        this.scroller2 = scroller2;
        this.nodeList1 = scroller1.children[0].children;
        this.nodeList2 = scroller2.children[0].children;
        this.highlightingColor = highlightingColor;
        this.connector = new Connector(connector_canvas, this.nodeList1, this.nodeList2, highlightingColor)

        this.highlightNodes(this.nodeList1);
        this.highlightNodes(this.nodeList2);

        this.connector.drawConnectors();

        this.initialise();
    }

    initialise() {
        let scrolling = false;
        let ticking = false;

        const onScrollerScroll = (event) => {
            if (scrolling) {
                scrolling = false;
                return;
            }
            scrolling = true;

            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(() => {
                    const otherScroller = event.target == this.scroller1 ? this.scroller2 : this.scroller1;
                    this.synchroniseScrollers(event.target, otherScroller);
                    ticking = false;
                });
            }
        };

        this.scroller1.onscroll = onScrollerScroll;
        this.scroller2.onscroll = onScrollerScroll;
    }

    highlightNodes(nodeList) {
        for (let i = 1; i < nodeList.length; i += 2)
            nodeList[i].style.backgroundColor = this.highlightingColor;
    }

    synchroniseScrollers(scroller1, scroller2) {
        const scrollPercent = scroller1.scrollTop / (scroller1.scrollHeight - scroller1.clientHeight);
        scroller2.scrollTop = (scroller2.scrollHeight - scroller2.clientHeight) * scrollPercent;
        // Update the connector canvas
        this.connector.drawConnectors();
    }
}

class Connector {
    constructor(canvas, nodeList1, nodeList2, highlighting_color) {
        this.canvas = canvas;
        this.nodeList1 = nodeList1;
        this.nodeList2 = nodeList2;
        this.highlighting_color = highlighting_color;
        this.ctx = canvas.getContext("2d")
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    }

    drawConnectors() {

        this.clearCanvas();

        for (let i = 0; i < this.nodeList1.length; i++) {

            if (i % 2 != 1)
                continue;
            if (!this.nodeList1[i] || !this.nodeList2[i])
                return;

            let point1 = {
                x: 0,
                y: this.nodeList1[i].getBoundingClientRect().top - this.canvas.parentElement.getBoundingClientRect().top
            };

            let point2 = {
                x: this.canvas.width,
                y: this.nodeList2[i].getBoundingClientRect().top - this.canvas.parentElement.getBoundingClientRect().top
            };

            let point3 = {
                x: this.canvas.width,
                y: this.nodeList2[i].getBoundingClientRect().top + this.nodeList2[i].clientHeight - this.canvas.parentElement.getBoundingClientRect().top
            }

            let point4 = {
                x: 0,
                y: this.nodeList1[i].getBoundingClientRect().top + this.nodeList1[i].clientHeight - this.canvas.parentElement.getBoundingClientRect().top
            };

            this.drawRectArc(point1, point2, point3, point4);
        }
    }

    drawRectArc(point1, point2, point3, point4) {
        this.ctx.beginPath();
        this.ctx.moveTo(point1.x, point1.y);
        this.ctx.bezierCurveTo(this.canvas.width / 2, point1.y, this.canvas.width / 2, point2.y, point2.x, point2.y);
        this.ctx.lineTo(point3.x, point3.y);
        this.ctx.bezierCurveTo(this.canvas.width / 2, point3.y, this.canvas.width / 2, point4.y, point4.x, point4.y);
        this.ctx.closePath();
        this.ctx.fillStyle = this.highlighting_color;
        this.ctx.fill();
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


window.addEventListener("load", nsGhipUtil_load, false);
