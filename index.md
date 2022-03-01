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
  //
  //
  //Default event type (0=siege, 1=blitz)
  var curEventType = 1;
  var iframe;
  //
  //
  //
  
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
	<option value="2">Power Ponies</option>
  </select></p>

<iframe id="eventframe" src="" height="1000px" width="600px" style="border-style:none"></iframe>

  
<p id="footer">Send any questions and suggestions <a href="https://www.reddit.com/user/Nice_Coconut">here</a></p>
</div>