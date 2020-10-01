function hide_all() {
	document.getElementById("data_area").style.display = "none";
	document.getElementById("tab_area").style.display = "none";
	document.getElementById("tab_list").style.display = "none";
	document.getElementById("outlook_table").style.display = "none";
	document.getElementById("summary_table").style.display = "none";
	document.getElementById("chart_area").style.display = "none";
	document.getElementById("news_list_area").style.display = "none";
	document.getElementById("error_msg_area").style.display = "none";
	document.getElementById("error_msg").style.display = "none";
}

function non_alpha_numeric(mystr) {
	for (var i = 0;i < mystr.length;++i) {
		var ch = mystr.charCodeAt(i);
		if ((ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122) || (ch >= 48 && ch <= 57)) {
			continue;
		}
		else {
			return true;
		}
	}
	return false;
}

function highlight_tab(tab_list, tab_elem_id) {
	var li_elems = tab_list.children;
	for (var i = 0;i < li_elems.length;++i) {
		li_elems[i].style.backgroundColor = "#F3F3F3";
	}
	var specific_li_elem = document.getElementById(tab_elem_id);
	specific_li_elem.style.backgroundColor = "#DEDEDE";
}

function display_error(data_area, server_error_message) {
	data_area.style.display = "block";
				
	var error_msg_area = document.getElementById("error_msg_area");
	error_msg_area.style.display = "block";

	var error_msg = document.getElementById("error_msg");
	error_msg.style.display = "block";
	error_msg.innerHTML = server_error_message;
}

function update_text_and_image(val, pos_id, neg_id) {
	if (val > 0) {
		document.getElementById(pos_id).style.display = "inline-block";
		document.getElementById(neg_id).style.display = "none";
	}
	else if (val < 0) {
		document.getElementById(pos_id).style.display = "none";
		document.getElementById(neg_id).style.display = "inline-block";
	}
	else {
		document.getElementById(pos_id).style.display = "none";
		document.getElementById(neg_id).style.display = "none";
	}
}

function build_news_article(li_element, article) {
	var first_image = li_element.children[0];
	first_image.src = article["Image"];
	var text_area = li_element.children[1];
	if (article["Title"].length > 94) {
		article["Title"] = article["Title"].substring(0, 94);
		article["Title"] += "...";
	}
	text_area.children[0].innerHTML = article["Title"];
	text_area.children[1].innerHTML = "Published Date: " + article["Date"];
	text_area.children[2].children[0].href = article["Link to Original Post"];
}