function getQuerystring(key, default_)
{
  if (default_==null) default_="";
  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
  var qs = regex.exec(window.location.href);
  if(qs == null)
    return default_;
  else
    return qs[1];
}

var mediaURL = getQuerystring('mediasrc');
if (mediaURL == "" || mediaURL == "nomedia") {
 alert("no audio file for chapter, using test sample");
 mediaURL = "media-141677.flv";

}


var xmlInputStrArray = new Array('<Chapter id=\"R66248\" status=\"Published\" variety=\"Standard\" pagination=\"true\" continuation=\"false\" autoplay=\"true\" minimumTimeSec=\"0\"><Heading>heading</Heading><Illustration id=\"R307\" status=\"Published\" src=\"media-190.gif\" variety=\"image/gif\" height=\"176\" width=\"220\"></Illustration><Audio id=\"R66149\" status=\"Published\" src=\"' + mediaURL + '\" variety=\"audio/x-flv\"></Audio></Chapter>');





