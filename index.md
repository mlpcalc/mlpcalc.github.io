<html>
<head>
<link rel="stylesheet" href="style.css">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XZC0JCSGZS"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XZC0JCSGZS');
</script>
<script src="defaultEvent.js"></script>

<script>
  var curEventType = eventsSelector["eventType"];
  var iframe;
  
  window.addEventListener("message", function(e){
    if (e.origin != "https://mlpcalc.github.io")
      return;
	iframe.style.height = e.data+"px";
  })
  
  function loadpage(){
	iframe = document.getElementById('eventframe');
	document.getElementById("eventtype").options[curEventType].selected = true;
	updateEventType();
  }
  
  function updateEventType(){
	curEventType = document.getElementById('eventtype').value;
    if (curEventType == 0){
	  iframe.src = "siege.html";
	} else if (curEventType == 1){
	  iframe.src = "blitz.html";
	} else if (curEventType == 2){
	  iframe.src = "blitz2.html";
	} else {
	  iframe.src = "powerponies.html"
	}
  }

</script>
</head>
<body onload="loadpage()">  
<div class="container-lg markdown-body">
<h1 style="margin-bottom: 1px;">Event calculator</h1>
<p style="margin-top: 1px;margin-bottom: 1px;">Select event type: <select id="eventtype" onchange="updateEventType()">
	<option value="0" selected>Siege</option>
    <option value="1">Blitz</option>
	<option value="2">Blitz2</option>
	<option value="3">Power Ponies</option>
  </select></p>

<iframe id="eventframe" src="" height="1000px" width="600px" style="border-style:none"></iframe>

  
<p id="footer">Send me <a href="https://www.reddit.com/user/Nice_Coconut">PM on Reddit</a> for any questions and suggestions</p>
</div>