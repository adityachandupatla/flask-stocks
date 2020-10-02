var tickerbox = ""; // global variable representing current value of ticker box
var current_tab = "";
var tickerbox_error_msg = "Please enter an alphanumeric character as a ticker symbol";

function clearTickerBox() {
	document.getElementById("ticker").value = "";
	hide_all();
	tickerbox = "";
	current_tab = "";
	return false;
}

function register_handlers() {
	var tab_list = document.getElementById("tab_list");
	var colorChangeOnMouseOver = function () {
		if (this.id != current_tab) {
			this.style.backgroundColor = "#E8E6E6";
		}
	}
	var colorChangeOnMouseOut = function () {
		if (this.id != current_tab) {
			this.style.backgroundColor = "#F3F3F3";
		}
	}
	var li_elems = tab_list.children;
	for (var i = 0;i < li_elems.length;++i) {
		li_elems[i].onmouseover = colorChangeOnMouseOver;
		li_elems[i].onmouseout = colorChangeOnMouseOut;
	}
}

function showData() {
	new_tickerbox = document.getElementById("ticker").value;
	if (tickerbox == new_tickerbox) {
		if (current_tab == "companyOutlookElem") {
			return false;
		}
	}
	else {
		tickerbox = new_tickerbox
	}

	register_handlers();
	
	// by default we render company outlook data
	return companyOutlook(true);
}

function companyOutlook(initial) {
	if (tickerbox != "") {
		if (initial == false && current_tab == "companyOutlookElem") {
			// the user clicked on the same tab again - don't make extra call
			return false;
		}
		current_tab = "companyOutlookElem";
		var xhr = new XMLHttpRequest();

		endpoint = "/stock/api/v1.0/outlook/" + tickerbox;
		xhr.open("GET", endpoint, true);

		var data_area = document.getElementById("data_area");
		var tab_area = document.getElementById("tab_area");
		var tab_list = document.getElementById("tab_list");

		if (non_alpha_numeric(tickerbox)) {
			hide_all();
			display_error(data_area, tickerbox_error_msg);
			return false;
		}

		xhr.onload = function() {
			hide_all();
			if (xhr.status == 200 || xhr.status == 202) {
				tab_area.style.display = "block";
				tab_list.style.display = "block";
				highlight_tab(tab_list, "companyOutlookElem");
				
				if (xhr.status == 202) {
					display_error(data_area, JSON.parse(xhr.response).message);
				}
				else {
					data_area.style.display = "block";
					var outlook_table = document.getElementById("outlook_table");
					outlook_table.style.display = "block";
					
					var jsonResponse = JSON.parse(xhr.response);
					for (var i = 0 ; i < outlook_table.rows.length; i++) {
						outlook_table.rows[i].cells[1].innerHTML = jsonResponse[outlook_table.rows[i].cells[0].innerHTML];
					}
				}
			}
			else if (xhr.status == 404) {
				display_error(data_area, JSON.parse(xhr.response).message);
			}
			else {
				alert("Unexpected status code: " + xhr.status + " see console for more info");
				console.log(xhr.response);
			}
		};

		xhr.onerror = function() {
			alert("Network Error");
		};

		xhr.send();
	}
	return false;
}

function stockSummary() {
	if (tickerbox != "") {
		if (current_tab === "stockSummaryElem") {
			// the user clicked on the same tab again - don't make extra call
			return false;
		}
		current_tab = "stockSummaryElem";
		var xhr = new XMLHttpRequest();

		endpoint = "/stock/api/v1.0/summary/" + tickerbox;
		xhr.open("GET", endpoint, true);

		var data_area = document.getElementById("data_area");
		var tab_area = document.getElementById("tab_area");
		var tab_list = document.getElementById("tab_list");

		if (non_alpha_numeric(tickerbox)) {
			hide_all();
			display_error(data_area, tickerbox_error_msg);
			return false;
		}

		xhr.onload = function() {
			hide_all();
			if (xhr.status == 200 || xhr.status == 202) {
				tab_area.style.display = "block";
				tab_list.style.display = "block";
				highlight_tab(tab_list, "stockSummaryElem");
				
				if (xhr.status == 202) {
					display_error(data_area, JSON.parse(xhr.response).message);
				}
				else {
					data_area.style.display = "block";
					var summary_table = document.getElementById("summary_table");
					summary_table.style.display = "block";
					
					var jsonResponse = JSON.parse(xhr.response);
					for (var i = 0 ; i < summary_table.rows.length; i++) {
						if (summary_table.rows[i].id == "change_percentage_row") {
							change_percentage_val = jsonResponse[summary_table.rows[i].cells[0].innerHTML];
							document.getElementById("change_percentage_text").innerHTML = change_percentage_val.toString() + "%";
							update_text_and_image(change_percentage_val, "positive_change_percentage", "negative_change_percentage");

						}
						else if (summary_table.rows[i].id == "change_row") {
							change_val = jsonResponse[summary_table.rows[i].cells[0].innerHTML];
							document.getElementById("change_text").innerHTML = change_val;
							update_text_and_image(change_val, "positive_change", "negative_change");
						}
						else {
							summary_table.rows[i].cells[1].innerHTML = jsonResponse[summary_table.rows[i].cells[0].innerHTML];
						}
					}
				}
			}
			else if (xhr.status == 404) {
				display_error(data_area, JSON.parse(xhr.response).message);
			}
			else {
				alert("Unexpected status code: " + xhr.status + " see console for more info");
				console.log(xhr.response);
			}
		};

		xhr.onerror = function() {
			alert("Network Error");
		};

		xhr.send();
	}
	return false;
}

function charts() {
	if (tickerbox != "") {
		if (current_tab === "chartsElem") {
			// the user clicked on the same tab again - don't make extra call
			return false;
		}
		current_tab = "chartsElem";
		var xhr = new XMLHttpRequest();

		endpoint = "/stock/api/v1.0/chart/" + tickerbox;
		xhr.open("GET", endpoint, true);

		var data_area = document.getElementById("data_area");
		var tab_area = document.getElementById("tab_area");
		var tab_list = document.getElementById("tab_list");

		if (non_alpha_numeric(tickerbox)) {
			hide_all();
			display_error(data_area, tickerbox_error_msg);
			return false;
		}

		xhr.onload = function() {
			hide_all();
			if (xhr.status == 200 || xhr.status == 202) {
				tab_area.style.display = "block";
				tab_list.style.display = "block";
				highlight_tab(tab_list, "chartsElem");
				
				if (xhr.status == 202) {
					display_error(data_area, JSON.parse(xhr.response).message);
				}
				else {
					data_area.style.display = "block";
					var chart_area = document.getElementById("chart_area");
					chart_area.style.display = "block";
					
					var jsonResponse = JSON.parse(xhr.response);
					createChart(jsonResponse.chartdata, tickerbox);
				}
			}
			else if (xhr.status == 404) {
				display_error(data_area, JSON.parse(xhr.response).message);
			}
			else {
				alert("Unexpected status code: " + xhr.status + " see console for more info");
				console.log(xhr.response);
			}
		};

		xhr.onerror = function() {
			alert("Network Error");
		};

		xhr.send();
	}
	return false;
}

function latestNews() {
	if (tickerbox != "") {
		if (current_tab === "latestNewsElem") {
			// the user clicked on the same tab again - don't make extra call
			return false;
		}
		current_tab = "latestNewsElem";
		var xhr = new XMLHttpRequest();

		endpoint = "/stock/api/v1.0/news/" + tickerbox;
		xhr.open("GET", endpoint, true);

		var data_area = document.getElementById("data_area");
		var tab_area = document.getElementById("tab_area");
		var tab_list = document.getElementById("tab_list");

		if (non_alpha_numeric(tickerbox)) {
			hide_all();
			display_error(data_area, tickerbox_error_msg);
			return false;
		}

		xhr.onload = function() {
			hide_all();
			if (xhr.status == 200 || xhr.status == 202) {
				tab_area.style.display = "block";
				tab_list.style.display = "block";
				highlight_tab(tab_list, "latestNewsElem");

				if (xhr.status == 202) {
					display_error(data_area, JSON.parse(xhr.response).message);
				}
				else {
					data_area.style.display = "block";
					var news_list_area = document.getElementById("news_list_area");
					news_list_area.style.display = "block";

					var jsonResponse = JSON.parse(xhr.response).articles;
					var news_section = document.getElementById("news_section");
						
					// remove any old li elements
					while (news_section.children.length > 1) {
						news_section.children[1].remove();
					}

					var li_element = news_section.children[0];
					build_news_article(li_element, jsonResponse[0]);
					for (var i = 1;i < jsonResponse.length;++i) {
						var article = jsonResponse[i];
						var cloned_li_element = li_element.cloneNode(true);
						build_news_article(cloned_li_element, article);
						news_section.appendChild(cloned_li_element);
					}
				}
			}
			else if (xhr.status == 404) {
				display_error(data_area, JSON.parse(xhr.response).message);
			}
			else {
				alert("Unexpected status code: " + xhr.status + " see console for more info");
				console.log(xhr.response);
			}
		};

		xhr.onerror = function() {
			alert("Network Error");
		};

		xhr.send();
	}
	return false;
}