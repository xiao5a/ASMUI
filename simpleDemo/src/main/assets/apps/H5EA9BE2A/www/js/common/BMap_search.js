//class ZoomControl
function ZoomControl() {
	this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
	this.defaultOffset = new BMap.Size(5, -5);
}
//extends Control
ZoomControl.prototype = new BMap.Control();

//override
ZoomControl.prototype.initialize = function(map) {
	var div = document.createElement("div");
	div.innerHTML =
		'<div id="r-result"  class="mui-input-row mui-search"><input type="text" id="suggestId"  class="mui-input-clear" style="background-color: #FFFFFF;border:1px solid #FFFFFF" /></div>';
	map.getContainer().appendChild(div);
	return div;
}
