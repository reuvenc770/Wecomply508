var popupHandle;
var version4 = (navigator.appVersion.charAt(0) == "4");

function closePopup()
{
  if (popupHandle != null)
  {
    if (!popupHandle.closed)
      popupHandle.close();
  }
}

function popUp(url,name,height,width)
{
  closePopup();
  var properties = "toolbar=0,location=0,menubar=0,height="+height;
  properties = properties+",width="+width;
  properties = properties+",left="+30;
  properties = properties+",top="+30;
  properties = properties+",scrollbars=1";
  popupHandle = window.open(url,name,properties);
}
