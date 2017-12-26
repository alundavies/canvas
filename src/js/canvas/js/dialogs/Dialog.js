/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Constructs a new dialog.
 */
function Dialog(editorUi, elt, w, h, modal, closable, onClose)
{
	var dx = 0;
	
	if (mxClient.IS_VML && (document.documentMode == null || document.documentMode < 8))
	{
		// Adds padding as a workaround for box model in older IE versions
		// This needs to match the total padding of geDialog in CSS
		dx = 80;
	}

	w += dx;
	h += dx;
	
	var left = Math.max(0, Math.round((document.body.scrollWidth - w) / 2));
	var top = Math.max(0, Math.round((Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - h - editorUi.footerHeight) / 3));
	
	// Increments zIndex to put subdialogs and background over existing dialogs and background
	if (editorUi.dialogs.length > 0)
	{
		this.zIndex += editorUi.dialogs.length * 2;
	}
	
	var div = editorUi.createDiv('geDialog');
	div.style.width = w + 'px';
	div.style.height = h + 'px';
	div.style.left = left + 'px';
	div.style.top = top + 'px';
	div.style.zIndex = this.zIndex;
	
	if (this.bg == null)
	{
		this.bg = editorUi.createDiv('background');
		this.bg.style.position = 'absolute';
		this.bg.style.background = 'white';
		this.bg.style.left = '0px';
		this.bg.style.top = '0px';
		this.bg.style.bottom = '0px';
		this.bg.style.right = '0px';
		this.bg.style.zIndex = this.zIndex - 2;
		
		mxUtils.setOpacity(this.bg, this.bgOpacity);
		
		if (mxClient.IS_QUIRKS)
		{
			new mxDivResizer(this.bg);
		}
	}

	if (modal)
	{
		document.body.appendChild(this.bg);
	}
	
	div.appendChild(elt);
	document.body.appendChild(div);
	
	if (closable)
	{
		var img = document.createElement('img');

		img.setAttribute('src', Dialog.prototype.closeImage);
		img.setAttribute('title', mxResources.get('close'));
		img.className = 'geDialogClose';
		img.style.top = (top + 14) + 'px';
		img.style.left = (left + w + 38 - dx) + 'px';
		img.style.zIndex = this.zIndex;
		
		mxEvent.addListener(img, 'click', mxUtils.bind(this, function()
		{
			editorUi.hideDialog(true);
		}));
		
		document.body.appendChild(img);
		this.dialogImg = img;
		
		mxEvent.addListener(this.bg, 'click', mxUtils.bind(this, function()
		{
			editorUi.hideDialog(true);
		}));
	}
	
	this.onDialogClose = onClose;
	this.container = div;
	
	editorUi.editor.fireEvent(new mxEventObject('showDialog'));
};

/**
 * 
 */
Dialog.prototype.zIndex = mxPopupMenu.prototype.zIndex - 1;

/**
 * 
 */
Dialog.prototype.noColorImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/nocolor.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzRDlBMUUwODYxMTExRTFCMzA4RDdDMjJBMEMxRDM3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzRDlBMUUxODYxMTExRTFCMzA4RDdDMjJBMEMxRDM3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTNEOUExREU4NjExMTFFMUIzMDhEN0MyMkEwQzFEMzciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTNEOUExREY4NjExMTFFMUIzMDhEN0MyMkEwQzFEMzciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5xh3fmAAAABlBMVEX////MzMw46qqDAAAAGElEQVR42mJggAJGKGAYIIGBth8KAAIMAEUQAIElnLuQAAAAAElFTkSuQmCC';

/**
 * 
 */
Dialog.prototype.closeImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/close.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJAQMAAADaX5RTAAAABlBMVEV7mr3///+wksspAAAAAnRSTlP/AOW3MEoAAAAdSURBVAgdY9jXwCDDwNDRwHCwgeExmASygSL7GgB12QiqNHZZIwAAAABJRU5ErkJggg==';

/**
 * 
 */
Dialog.prototype.clearImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/clear.gif' : 'data:image/gif;base64,R0lGODlhDQAKAIABAMDAwP///yH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IFdpbmRvd3MiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUIzOEM1NzI4NjEyMTFFMUEzMkNDMUE3NjZERDE2QjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUIzOEM1NzM4NjEyMTFFMUEzMkNDMUE3NjZERDE2QjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QjM4QzU3MDg2MTIxMUUxQTMyQ0MxQTc2NkREMTZCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QjM4QzU3MTg2MTIxMUUxQTMyQ0MxQTc2NkREMTZCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAEAAAEALAAAAAANAAoAAAIXTGCJebD9jEOTqRlttXdrB32PJ2ncyRQAOw==';

/**
 * 
 */
Dialog.prototype.lockedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/locked.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzdDMDZCODExNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzdDMDZCODIxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozN0MwNkI3RjE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozN0MwNkI4MDE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvqMCFYAAAAVUExURZmZmb+/v7KysqysrMzMzLGxsf///4g8N1cAAAAHdFJOU////////wAaSwNGAAAAPElEQVR42lTMQQ4AIQgEwUa0//9kTQirOweYOgDqAMbZUr10AGlAwx4/BJ2QJ4U0L5brYjovvpv32xZgAHZaATFtMbu4AAAAAElFTkSuQmCC';

/**
 * 
 */
Dialog.prototype.unlockedImage = (!mxClient.IS_SVG) ? IMAGE_PATH + '/unlocked.png' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAMAAABhq6zVAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzdDMDZCN0QxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzdDMDZCN0UxNzIxMTFFNUI0RTk5NTg4OTcyMUUyODEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozN0MwNkI3QjE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozN0MwNkI3QzE3MjExMUU1QjRFOTk1ODg5NzIxRTI4MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkKMpVwAAAAYUExURZmZmbKysr+/v6ysrOXl5czMzLGxsf///zHN5lwAAAAIdFJOU/////////8A3oO9WQAAADxJREFUeNpUzFESACAEBNBVsfe/cZJU+8Mzs8CIABCidtfGOndnYsT40HDSiCcbPdoJo10o9aI677cpwACRoAF3dFNlswAAAABJRU5ErkJggg==';

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.bgOpacity = 80;

/**
 * Removes the dialog from the DOM.
 */
Dialog.prototype.close = function(cancel)
{
	if (this.onDialogClose != null)
	{
		this.onDialogClose(cancel);
		this.onDialogClose = null;
	}
	
	if (this.dialogImg != null)
	{
		this.dialogImg.parentNode.removeChild(this.dialogImg);
		this.dialogImg = null;
	}
	
	if (this.bg != null && this.bg.parentNode != null)
	{
		this.bg.parentNode.removeChild(this.bg);
	}
	
	this.container.parentNode.removeChild(this.container);
};



