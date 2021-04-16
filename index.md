<html>
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-191706851-1"></script>
<link rel="stylesheet" href="style.css">
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-191706851-1');
</script>

<script>
  var curEventType = 0;
  var iframe;
  
  /*function receiveMessage(event){
    if (event.origin !== "https://mlpcalc.github.io/")
      return;
	iframe.style.height = event.data+"px";
  }
  window.addEventListener("message", receiveMessage, false);*/
  window.addEventListener("message", function(e){
    iframe.style.height = "500px";
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
	} else {
	  iframe.src = "blitz.html";
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
  </select></p>

<iframe id="eventframe" src="" height="1000px" width="600px" style="border-style:none"></iframe>

  
<p id="footer">Send any questions and suggestions <a href="https://www.reddit.com/user/Nice_Coconut">here</a></p>
</div>