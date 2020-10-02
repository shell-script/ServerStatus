// serverstatus.js
var error = 0;
var d = 0;
var server_status = new Array();

function timeSince(date) {
	if(date == 0)
		return "never.";

	var seconds = Math.floor((new Date() - date) / 1000);
	var interval = Math.floor(seconds / 31536000);

	if (interval > 1)
		return interval + " years ago.";
	interval = Math.floor(seconds / 2592000);
	if (interval > 1)
		return interval + " months ago.";
	interval = Math.floor(seconds / 86400);
	if (interval > 1)
		return interval + " days ago.";
	interval = Math.floor(seconds / 3600);
	if (interval > 1)
		return interval + " hours ago.";
	interval = Math.floor(seconds / 60);
	if (interval > 1)
		return interval + " minutes ago.";
	/*if(Math.floor(seconds) >= 5)
		return Math.floor(seconds) + " seconds";*/
	else
		return "few seconds ago.";
}

function bytesToSize(bytes, precision, si)
{
	var ret;
	si = typeof si !== 'undefined' ? si : 0;
	if(si != 0) {
		var kilobyte = 1000;
		var megabyte = kilobyte * 1000;
		var gigabyte = megabyte * 1000;
		var terabyte = gigabyte * 1000;
	} else {
		var kilobyte = 1024;
		var megabyte = kilobyte * 1024;
		var gigabyte = megabyte * 1024;
		var terabyte = gigabyte * 1024;
	}

	if ((bytes >= 0) && (bytes < kilobyte)) {
		return bytes + ' B';

	} else if ((bytes >= kilobyte) && (bytes < megabyte)) {
		ret = (bytes / kilobyte).toFixed(precision) + ' K';

	} else if ((bytes >= megabyte) && (bytes < gigabyte)) {
		ret = (bytes / megabyte).toFixed(precision) + ' M';

	} else if ((bytes >= gigabyte) && (bytes < terabyte)) {
		ret = (bytes / gigabyte).toFixed(precision) + ' G';

	} else if (bytes >= terabyte) {
		ret = (bytes / terabyte).toFixed(precision) + ' T';

	} else {
		return bytes + ' B';
	}
	if(si != 0) {
		return ret + 'B';
	} else {
		return ret + 'iB';
	}
}

function uptime() {
	$.getJSON("json/stats.json", function(result) {
		$("#loading-notice").remove();
		if(result.reload)
			setTimeout(function() { location.reload(true) }, 1000);

		for (var i = 0, rlen=result.servers.length; i < rlen; i++) {
			var TableRow = $("#servers tr#r" + i);
			var ExpandRow = $("#servers #rt" + i);
			var hack; // fuck CSS for making me do this
			if(i%2) hack="odd"; else hack="even";
			if (!TableRow.length) {
				$("#servers").append(
					"<tr id=\"r" + i + "\" data-toggle=\"collapse\" data-target=\"#rt" + i + "\" class=\"accordion-toggle " + hack + "\">" +
						"<td id=\"online4\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"online6\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"ip_status\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"name\">Loading</td>" +
						"<td id=\"type\">Loading</td>" +
						"<td id=\"host\">Loading</td>" +
						"<td id=\"location\">Loading</td>" +
						"<td id=\"uptime\">Loading</td>" +
						"<td id=\"load\">Loading</td>" +
						"<td id=\"connections\">Loading</td>" +
						"<td id=\"loss\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"network\">Loading</td>" +
						"<td id=\"traffic\">Loading</td>" +
						"<td id=\"cpu\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"memory\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
						"<td id=\"hdd\"><div class=\"progress\"><div style=\"width: 100%;\" class=\"progress-bar progress-bar-warning\"><small>Loading</small></div></div></td>" +
					"</tr>" +
					"<tr class=\"expandRow " + hack + "\"><td colspan=\"16\", style=\"word-wrap:break-word;word-break:break-all;\"><div class=\"accordian-body collapse\" id=\"rt" + i + "\">" +
						"<div id=\"expand_mem\">Loading</div>" +
						"<div id=\"expand_swap\">Loading</div>" +
						"<div id=\"expand_hdd\">Loading</div>" +
						"<div id=\"expand_tupd\">Loading</div>" +
						"<div id=\"expand_ping\">Loading</div>" +
						"<div id=\"expand_custom\">Loading</div>" +
					"</div></td></tr>"
				);
				TableRow = $("#servers tr#r" + i);
				ExpandRow = $("#servers #rt" + i);
				server_status[i] = true;
			}
			TableRow = TableRow[0];
			if(error) {
				TableRow.setAttribute("data-target", "#rt" + i);
				server_status[i] = true;
			}

			// Online4
			if (result.servers[i].online4) {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>Up</small>";
			} else {
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-danger";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>Down</small>";
			}

			// Online6
			if (result.servers[i].online6) {
				TableRow.children["online6"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["online6"].children[0].children[0].innerHTML = "<small>Up</small>";
			} else {
				TableRow.children["online6"].children[0].children[0].className = "progress-bar progress-bar-danger";
				TableRow.children["online6"].children[0].children[0].innerHTML = "<small>Down</small>";
			}

			// Ipstatus
			if (result.servers[i].ip_status) {
				TableRow.children["ip_status"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["ip_status"].children[0].children[0].innerHTML = "<small>Up</small>";
			} else {
				TableRow.children["ip_status"].children[0].children[0].className = "progress-bar progress-bar-danger";
				TableRow.children["ip_status"].children[0].children[0].innerHTML = "<small>Down</small>";
			}

			// Name
			TableRow.children["name"].innerHTML = result.servers[i].name;

			// Type
			TableRow.children["type"].innerHTML = result.servers[i].type;

			// Host
			TableRow.children["host"].innerHTML = result.servers[i].host;

			// Location
			TableRow.children["location"].innerHTML = result.servers[i].location;
			if (!result.servers[i].online4 && !result.servers[i].online6) {
				if (server_status[i]) {
					TableRow.children["uptime"].innerHTML = "–";
					TableRow.children["load"].innerHTML = "–";
					TableRow.children["connections"].innerHTML = "–";
					TableRow.children["loss"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["loss"].children[0].children[0].style.width = "100%";
					TableRow.children["loss"].children[0].children[0].innerHTML = "<small>Down</small>";
					TableRow.children["network"].innerHTML = "–";
					TableRow.children["traffic"].innerHTML = "–";
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["cpu"].children[0].children[0].style.width = "100%";
					TableRow.children["cpu"].children[0].children[0].innerHTML = "<small>Down</small>";
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["memory"].children[0].children[0].style.width = "100%";
					TableRow.children["memory"].children[0].children[0].innerHTML = "<small>Down</small>";
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-danger";
					TableRow.children["hdd"].children[0].children[0].style.width = "100%";
					TableRow.children["hdd"].children[0].children[0].innerHTML = "<small>Down</small>";
					if(ExpandRow.hasClass("in")) {
						ExpandRow.collapse("hide");
					}
					TableRow.setAttribute("data-target", "");
					server_status[i] = false;
				}
			} else {
				if (!server_status[i]) {
					TableRow.setAttribute("data-target", "#rt" + i);
					server_status[i] = true;
				}

				// Uptime
				TableRow.children["uptime"].innerHTML = result.servers[i].uptime;

				// Load
				if(result.servers[i].load == -1) {
					TableRow.children["load"].innerHTML = "–";
				} else {
					var loadstr = ""
					loadstr += result.servers[i].load_1.toFixed(2);
					loadstr += " | "
					loadstr += result.servers[i].load_5.toFixed(2);
					loadstr += " | "
					loadstr += result.servers[i].load_15.toFixed(2);
					TableRow.children["load"].innerHTML = loadstr
				}

				// Connections
				if(result.servers[i].connections == -1) {
					TableRow.children["connections"].innerHTML = "–";
				} else {
					TableRow.children["connections"].innerHTML = result.servers[i].connections;
				}

				// Network
				var netstr = "";
				if(result.servers[i].network_rx < 1024)
					netstr += result.servers[i].network_rx.toFixed(0) + "B";
				else if(result.servers[i].network_rx < 1024*1024)
					netstr += (result.servers[i].network_rx/1024).toFixed(0) + "K";
				else
					netstr += (result.servers[i].network_rx/1024/1024).toFixed(1) + "M";
				netstr += " | "
				if(result.servers[i].network_tx < 1024)
					netstr += result.servers[i].network_tx.toFixed(0) + "B";
				else if(result.servers[i].network_tx < 1024*1024)
					netstr += (result.servers[i].network_tx/1024).toFixed(0) + "K";
				else
					netstr += (result.servers[i].network_tx/1024/1024).toFixed(1) + "M";
				TableRow.children["network"].innerHTML = netstr;

				//Traffic
				var trafficstr = "";
				if(result.servers[i].network_in < 1024)
					trafficstr += result.servers[i].network_in.toFixed(0) + "B";
				else if(result.servers[i].network_in < 1024*1024)
					trafficstr += (result.servers[i].network_in/1024).toFixed(0) + "K";
				else if(result.servers[i].network_in < 1024*1024*1024)
					trafficstr += (result.servers[i].network_in/1024/1024).toFixed(1) + "M";
				else if(result.servers[i].network_in < 1024*1024*1024*1024)
					trafficstr += (result.servers[i].network_in/1024/1024/1024).toFixed(2) + "G";
				else
					trafficstr += (result.servers[i].network_in/1024/1024/1024/1024).toFixed(2) + "T";
				trafficstr += " | "
				if(result.servers[i].network_out < 1024)
					trafficstr += result.servers[i].network_out.toFixed(0) + "B";
				else if(result.servers[i].network_out < 1024*1024)
					trafficstr += (result.servers[i].network_out/1024).toFixed(0) + "K";
				else if(result.servers[i].network_out < 1024*1024*1024)
					trafficstr += (result.servers[i].network_out/1024/1024).toFixed(1) + "M";
				else if(result.servers[i].network_out < 1024*1024*1024*1024)
					trafficstr += (result.servers[i].network_out/1024/1024/1024).toFixed(2) + "G";
				else
					trafficstr += (result.servers[i].network_out/1024/1024/1024/1024).toFixed(2) + "T";
				TableRow.children["traffic"].innerHTML = trafficstr;

				// CPU
				if (result.servers[i].cpu >= 90)
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (result.servers[i].cpu >= 80)
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["cpu"].children[0].children[0].style.width = result.servers[i].cpu + "%";
				TableRow.children["cpu"].children[0].children[0].innerHTML = result.servers[i].cpu + "%";

				// Memory
				var Mem = ((result.servers[i].memory_used/result.servers[i].memory_total)*100.0).toFixed(0);
				if (Mem >= 90)
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (Mem >= 80)
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["memory"].children[0].children[0].style.width = Mem + "%";
				TableRow.children["memory"].children[0].children[0].innerHTML = Mem + "%";
				ExpandRow[0].children["expand_mem"].innerHTML = "Memory: " + bytesToSize(result.servers[i].memory_used*1024, 2) + " / " + bytesToSize(result.servers[i].memory_total*1024, 2);
				// Swap
				ExpandRow[0].children["expand_swap"].innerHTML = "Swap: " + bytesToSize(result.servers[i].swap_used*1024, 2) + " / " + bytesToSize(result.servers[i].swap_total*1024, 2);

				// HDD
				var HDD = ((result.servers[i].hdd_used/result.servers[i].hdd_total)*100.0).toFixed(0);
				if (HDD >= 90)
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (HDD >= 80)
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-success";
				TableRow.children["hdd"].children[0].children[0].style.width = HDD + "%";
				TableRow.children["hdd"].children[0].children[0].innerHTML = HDD + "%";
				ExpandRow[0].children["expand_hdd"].innerHTML = "Disk: " + bytesToSize(result.servers[i].hdd_used*1024*1024, 2) + " / " + bytesToSize(result.servers[i].hdd_total*1024*1024, 2);

				// delay time
				// tcp, udp, process, thread count
 				ExpandRow[0].children["expand_tupd"].innerHTML = "TCP/UDP/Process/Thread: " + result.servers[i].tcp_count + " / " + result.servers[i].udp_count + " / " + result.servers[i].process_count+ " / " + result.servers[i].thread_count;

				// ping
				ExpandRow[0].children["expand_ping"].innerHTML = "CU/CM/CT: " + result.servers[i].time_10010 + "ms / " + result.servers[i].time_10086 + "ms / " + result.servers[i].time_189 + "ms"

				// loss
				var PING_10010 = result.servers[i].ping_10010.toFixed(2);
				var PING_10086 = result.servers[i].ping_10086.toFixed(2);
				var PING_189 = result.servers[i].ping_189.toFixed(2);
				if (PING_10010 >= 30.0 || PING_10086 >= 30.0 || PING_189 >= 30.0)
					TableRow.children["loss"].children[0].children[0].className = "progress-bar progress-bar-danger";
				else if (PING_10010 >= 10.0 || PING_10086 >= 10.0 || PING_189 >= 10.0)
					TableRow.children["loss"].children[0].children[0].className = "progress-bar progress-bar-warning";
				else
					TableRow.children["loss"].children[0].children[0].className = "progress-bar progress-bar-success";
					TableRow.children["loss"].children[0].children[0].innerHTML = PING_10010 + "% | " + PING_10086 + "% | " + PING_189 + "%" ;

				// Custom
				if (result.servers[i].custom) {
					ExpandRow[0].children["expand_custom"].innerHTML = "<hr>Client message:<br>" + result.servers[i].custom
				} else {
					ExpandRow[0].children["expand_custom"].innerHTML = "<hr>Client message: no info."
				}
			}
		};

		d = new Date(result.updated*1000);
		error = 0;
	}).fail(function(update_error) {
		if (!error) {
			$("#servers > tr.accordion-toggle").each(function(i) {
				var TableRow = $("#servers tr#r" + i)[0];
				var ExpandRow = $("#servers #rt" + i);
				TableRow.children["online4"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["online4"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["online6"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["online6"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["ip_status"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["ip_status"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["name"].innerHTML = "<div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["type"].innerHTML = "<div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["host"].innerHTML = "<div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["location"].innerHTML = "<div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["uptime"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["uptime"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["load"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["load"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["connections"].innerHTML = "<div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["loss"].innerHTML = "<div style=\"width: 100%;\" class=\"progress-bar progress-bar-error\"><small>Error</small></div></div>";
				TableRow.children["network"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["network"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["traffic"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["traffic"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["cpu"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["cpu"].children[0].children[0].style.width = "100%";
				TableRow.children["cpu"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["memory"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["memory"].children[0].children[0].style.width = "100%";
				TableRow.children["memory"].children[0].children[0].innerHTML = "<small>Error</small>";
				TableRow.children["hdd"].children[0].children[0].className = "progress-bar progress-bar-error";
				TableRow.children["hdd"].children[0].children[0].style.width = "100%";
				TableRow.children["hdd"].children[0].children[0].innerHTML = "<small>Error</small>";
				if(ExpandRow.hasClass("in")) {
					ExpandRow.collapse("hide");
				}
				TableRow.setAttribute("data-target", "");
				server_status[i] = false;
			});
		}
		error = 1;
		$("#updated").html("Update error.");
	});
}

function updateTime() {
	if (!error)
		$("#updated").html("Last updated: " + timeSince(d));
}

uptime();
updateTime();
setInterval(uptime, 1000);
setInterval(updateTime, 500);


// styleswitcher.js
function setActiveStyleSheet(title) {
	var i, a, main;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title")) {
			a.disabled = true;
			if(a.getAttribute("title") == title) a.disabled = false;
		}
	}
}

function getActiveStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("title") && !a.disabled)
			return a.getAttribute("title");
	}
	return null;
}

function getPreferredStyleSheet() {
	var i, a;
	for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
		if(a.getAttribute("rel").indexOf("style") != -1	&& a.getAttribute("rel").indexOf("alt") == -1 && a.getAttribute("title"))
			return a.getAttribute("title");
	}
return null;
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ')
			c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length,c.length);
	}
	return null;
}

window.onload = function(e) {
	var cookie = readCookie("style");
	var title = cookie ? cookie : getPreferredStyleSheet();
	setActiveStyleSheet(title);
}

window.onunload = function(e) {
	var title = getActiveStyleSheet();
	createCookie("style", title, 365);
}

var cookie = readCookie("style");
var title = cookie ? cookie : getPreferredStyleSheet();
setActiveStyleSheet(title);
