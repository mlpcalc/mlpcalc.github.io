<html>
<head>
<script src="data2.js"></script> 
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-191706851-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-191706851-1');
</script>

<script>

  var selectedEvent;
  var maindata;
  const images = ["pouchpic","coinpic"];
  var vals;
  var curarmor;
  var curhelmet;
  //var minionhp = maindata["bosses"][0]["MinionHP"];
  //var minionreward = maindata["bosses"][0]["MinionCurrencyReward"];
  var inittime = document.getElementById("inittime");
  var coins = 0;
  var curstage, curdamage;
  var stages = [];
  var upgradelevels = [0];
  var egems = [];
  var siegeevent;
  var timeUpgrades = [];
  var totaltime;
  const defaultSiegeEvent = "Rarity's Retro Revolution"
  //var curdaytime;
  
  function loadpage(){
    curstage = document.getElementById("curstage");
	setimages('coinpic');
	siegeevent = document.getElementById("siegeevent");
    generateEventList();
	for (i=0; i<siegeevent.options.length; i++){
	  if (siegeevent.options[i].value == defaultSiegeEvent){
	    siegeevent.options[i].selected = true;
		break;
	  }
	}
	updatepage();
  }
  
  function updatepage(){
	document.getElementById("results").innerHTML = "";
    selectedEvent = siegeevent[siegeevent.selectedIndex].value;
	maindata = gamedata[selectedEvent]
	let i;
    for (i=0;i<maindata["bosses"].length; i++){
	  stages[i]={};
	  stages[i]['bosshp'] = maindata["bosses"][i]["BossHP"];
	  stages[i]['bosshits'] = maindata["bosses"][i]["BossHits"];
	  stages[i]['bosstime'] = maindata["bosses"][i]["TimeMinutes"];
	  stages[i]['minionhp'] = maindata["bosses"][i]["MinionHP"];
	  stages[i]['minioncoins'] = maindata["bosses"][i]["MinionCurrencyReward"];
	  stages[i]['maxcoins'] = maindata["bosses"][i]["CurrencyCappings"][0];
	}
	vals = maindata["upgrades"];
	curarmor = [vals[0][0],0]; //[current value, index in vals]
    curhelmet = [vals[0][0],0];
	for (i=0;i<vals.length;i++){
	  upgradelevels.push(vals[i][0]+upgradelevels[i])	
	}
	egems = maindata['convgems'];
    generateHelpers();
	document.getElementById("curarmor").max = vals.length-1;
	document.getElementById("curhelmet").max = vals.length-1;
	curstage = document.getElementById("curstage");
	removeOptions(curstage);
	addOptions(generateStages(), curstage);
	curstage.selectedIndex = 1;
	if (stages[0]['bosshits']>0){
	  document.getElementById("bosstip1").style.display = "inline";
	  document.getElementById("bosstip2").style.display = "inline";
	} else {
	  document.getElementById("skiprec").checked = false;
	  document.getElementById("bosstip1").style.display = "none";
	  document.getElementById("bosstip2").style.display = "none";
	}
	updatedmg("curarmor")
	updatedmg("curhelmet")
	skiprecendis();
  }
  
  function updatedmg(gear){
    let lvl = document.getElementById(gear).value;
    document.getElementById(gear+"dmg").value = upgradelevels[lvl];
  }
  
  function generateEventList(){
    removeOptions(siegeevent);
	let eventlist=[], tmp;
    for (i in gamedata){
	  tmp = [i,i]
	  eventlist.push(tmp);
	}
	addOptions(eventlist, siegeevent);
  }
  
  function generateStages(){
    var stagesarr = [];
	var tmp;
	for (i=0;i<maindata["bosses"].length-1; i++){
	  tmp = (i+1) + '. ';
	  tmp += maindata["bosses"][i]["ID"] + ' (';
	  tmp += maindata["bosses"][i]["MinionHP"] + ', ';
	  tmp += maindata["bosses"][i]["MinionCurrencyReward"] + ')';
	  stagesarr.push([tmp,i])
	}
	return stagesarr;
  }
  
  function removeOptions(selBox) {
    while (selBox.options.length > 0) {
      selBox.remove(0);
    }
  }
  
  function addOptions(arr, selBox) {
    let newOption
    for (let i = 0; i <arr.length; i++){
	  newOption = new Option(arr[i][0],arr[i][1]);
	  selBox.add(newOption, undefined);
	}
  }
  
  function generateHelpers(){
    let p = document.getElementById("helpers");
	p.innerHTML = '<b>Helpers:</b><br>'
    let helpnames = maindata['helpnames'];
	let helpstage = maindata['helpstage'];
	let stagenums = [];
	let i, j;
	var table, td, tr, input, span;
	for (i=0;i<helpnames.length;i++){
	  stagenums.push([]);
	}
	for (i=0;i<helpstage.length;i++){
	  for (j=0;j<helpstage[i].length;j++){
	    stagenums[helpstage[i][j]].push(i+1);
	  }
	}
	
	table = document.createElement('table');
	j=0;
	for (i=0;i<helpnames.length;i++){
	  if (j==0){
 	    tr = document.createElement('tr');
	  }
	  j+=1;
	  td = document.createElement('td');
	  input = document.createElement('input');
	  input.id = 'help'+i;
	  input.type = 'checkbox';
	  td.append(input);
	  tr.append(td);
	  td = document.createElement('td');
	  span = document.createElement('span');
	  let hstages = ''
	  if (stagenums[i].length == 8){
	    hstages = "all stages";
	  } else if (stagenums[i].length == 1){
	    hstages = "stage "+(stagenums[i]).toString();
	  } else {
	    hstages = "stages "+(stagenums[i]).toString();
	  }
	  span.innerHTML = ' '+helpnames[i]+'<br>('+hstages+')';
	  td.append(span);
	  tr.append(td);
	  if (j==3){
		table.append(tr);
		j=0
	  }
	}
	if (j>0){
	  table.append(tr);
	}
	document.getElementById("helpers").append(table)
  }
  
  function setHelpers(){
	let i,j;
	let helpers = []
	for (i=0;i<maindata['helpnames'].length;i++){
	  if(document.getElementById('help'+i).checked){
	    helpers.push(1);
	  } else {
	    helpers.push(0);
	  }
	}
	for (i=0;i<stages.length;i++){
	  stages[i]['helpnum'] = 0;
	  stages[i]['helpersdmg'] = 0;
	  for (j=0;j<maindata['helpstage'][i].length;j++){
	    stages[i]['helpnum'] += helpers[maindata['helpstage'][i][j]];
		stages[i]['helpersdmg'] += (maindata['helpdmg'][i][j] * helpers[maindata['helpstage'][i][j]]);
	  }
	  stages[i]['maxcoins'] = maindata['bosses'][i]['CurrencyCappings'][stages[i]['helpnum']];
	}
  }
  
  
  function calcstage(num){
    var nextupgrade;
	var stagetime = 0;
	var totalpower = curarmor[0]+curhelmet[0]+stages[num]['helpersdmg'];
	if (document.getElementById("skiprec").checked){
	  skip = Number(document.getElementById("skiprechits").value)
	  bosshits = stages[num]['bosshits']+skip;
	}
	else {
	  bosshits = stages[num]['bosshits'];
	}
	if (bosshits == 0){
	  bosshits = stages[num]['bosstime'] * 60
	}
	var tmptime = Math.ceil(stages[num]['minionhp'] / totalpower);
	while (totalpower * bosshits < stages[num]['bosshp']){
	  if (curarmor[1] > curhelmet[1]){
	    nextupgrade = [true,vals[curhelmet[1]][1]];
	  }
	  else {
 	    nextupgrade = [false,vals[curarmor[1]][1]];
	  }
	  while (coins < nextupgrade[1]){
	    curhp = stages[num]['minionhp'];
  	    while (curhp > 0){
	      stagetime += 1;
	      curhp -= totalpower;
	    }
 	    coins += stages[num]['minioncoins'];
	  }
	  coins -= nextupgrade[1];
	  if (!nextupgrade[0]){
	    curarmor[0] = upgradelevels[curarmor[1]+1];
	    curarmor[1] += 1;
	  } else {
	    curhelmet[0] = upgradelevels[curhelmet[1]+1];
	    curhelmet[1] += 1;
  	  }
	  totalpower = curarmor[0]+curhelmet[0]+stages[num]['helpersdmg'];
	  if (Math.ceil(stages[num]['minionhp'] / totalpower)<tmptime){
	    timeUpgrades.push([totaltime + stagetime,curarmor[1],curhelmet[1]]);
		tmptime = Math.ceil(stages[num]['minionhp'] / totalpower);
	  }
	}
	if (bosshits == 0){
	  return stagetime + stages[num]['bosstime'] * 60
	} else {
	  return stagetime
	}
  }
  
  function formattime(time){
    var out = "";
	var count = [0,0];
    if (Math.trunc(time / 86400) > 0){
	  out += Math.trunc(time / 86400) + 'd ';
	  time -= 86400 * Math.trunc(time / 86400);
	  count[0] = 1;
	}
	if (Math.trunc(time / 3600) > 0){
	  out += Math.trunc(time / 3600) + 'h ';
	  time -= 3600 * Math.trunc(time / 3600);
	  count[1] = 1;
	}
	if (Math.trunc(time / 60) > 0){
	  if (count == [1,0]){
	    out += '0h '+Math.trunc(time / 60) + 'm ';
	  }
	  else {
	  out += Math.trunc(time / 60) + 'm ';
	  }
	  time -= 60 * Math.ceil(time / 60);
	}
	if (out == ""){
	  out += time + 's ';
	}
	return out;
  }
  
  function setimages(imgitem){
    let item = document.getElementById(imgitem+"data").innerText;
	let imgs = document.getElementsByName(imgitem);
	for (let i = 0; i < imgs.length; i++){
	  imgs[i].src=item;
    }
  }
  
  function calcgems(instage, inpower, incoins){
    var maxgems = maindata["convrate"][maindata["convrate"].length-1];
	var cointime = Math.ceil(stages[instage]['minionhp'] / inpower);
	var gemtimes = [0];
	var count = 1;
	var gtime = 0;
    while (incoins <= maxgems){
	  if (incoins >= maindata["convrate"][count]){
	    gemtimes.push(gtime);
		count += 1;
	  }
	  gtime += cointime;
	  incoins += stages[instage]['minioncoins']
	}
	gemtimes.push(gtime);
    return gemtimes;
  }
  
  function getdelta(){
    startsleep = Number(document.getElementById("startsleep").value)
	endsleep = Number(document.getElementById("endsleep").value)
	if (startsleep>endsleep){
	  delta = endsleep+24-startsleep;
	  crossdays = true;
	} else {
	  delta = startsleep-endsleep;
	  crossdays = false
	}
	var curdaytime = new Date();
	var zeroday = new Date();
	zeroday.setHours(0,0,0,0);
	if ((zeroday+(startsleep*3600)) > Date.parse(curdaytime)){
	  secondsleft = zeroday+(startsleep*3600) - Date.parse(curdaytime);
	  secondsto = 0;
	} else {
	  secondsleft = 0;
	  secondsto = zeroday+(endsleep*3600) - Date.parse(curdaytime)
	}
  }
  
  function skiprecendis(){
    if (document.getElementById("skiprec").checked){
	  document.getElementById("skiprechits").disabled = false;
	} else {
	  document.getElementById("skiprechits").disabled = true;
	}
  }
  
  function calctime(){
    results = document.getElementById("results");
	results.innerHTML = "";
	timeUpgrades = [];
	curstage = Number(document.getElementById("curstage").value);
	setHelpers();
	tmp1 = Number(document.getElementById("curarmor").value);
	tmp2 = Number(document.getElementById("curhelmet").value);
	coins = Number(document.getElementById("curcoins").value);
	curarmor = [upgradelevels[tmp1],tmp1];
    curhelmet = [upgradelevels[tmp2],tmp2];
	totaltime = 0;
	let curtime = 0;
	let gemtimes = []
	//var curdaytime = new Date();
	//var hrs = "0" + curdaytime.getHours();
	//var mnts = "0" + curdaytime.getMinutes();
	//var formattedTime = hrs.substr(-2) + ':' + mnts.substr(-2);
	//document.getElementById("curdaytime").value = formattedTime
	curdmg = curarmor[0]+curhelmet[0]+stages[curstage]['helpersdmg'];
	curminion = stages[curstage]['minionhp'];
	ttb = Math.ceil(curminion/curdmg);
	pouchtime = Math.ceil(stages[curstage]['maxcoins'] / stages[curstage]['minioncoins']) * ttb;
	span = document.createElement('span');
	span.innerHTML = '<img name="pouchpic" src="" alt="maxpouch" /><b> (current max '+ stages[curstage]['maxcoins'] +') will fill in: '+formattime(pouchtime)+'</b>';
	results.appendChild(span);
	mainresults = document.createElement('div');
	setimages('pouchpic');
	for (let i=curstage; i < stages.length-1; i++){
	  curtime = calcstage(i);
	  curdmg = curarmor[0]+curhelmet[0]+stages[curstage]['helpersdmg'];
	  gemtimes = calcgems(i+1,curdmg,coins)
	  totaltime += curtime;
	  h2 = document.createElement('h2');
	  h2.innerHTML += 'Stage ' + (i+1) + ' will require ' + formattime(curtime) + ' and gear levels ' + curarmor[1] + '/' + curhelmet [1] + '<br>';
	  table = document.createElement('table');
	  tbdy = document.createElement('tbody');
	  tr = document.createElement('tr');
	  tr.innerHTML += '<td>Extra<br>gems</td>'
	  for (let j=1; j<egems.length;j++){
	    tr.innerHTML += '<td align="center" width="120"><img name="gempic" src="" alt="Gems" />'+egems[j] + ': <br>+' + formattime(gemtimes[j]) + '</td>';
	  }
	  tbdy.appendChild(tr);
	  table.appendChild(tbdy);
	  mainresults.appendChild(h2);
	  mainresults.appendChild(table);
	}
	
	var p = document.createElement('p');
	p.innerHTML += '<br><b>Closest valuable upgrades<br>(reduced time to beat minion -> increased coins income):</b><br>';
	for (let i=0; i < timeUpgrades.length; i++){
	  p.innerHTML += timeUpgrades[i][1] + '/' + timeUpgrades[i][2] + ' in ' + formattime(timeUpgrades[i][0]) + '<br>'
	  if (i == 2) break;
	}
	results.appendChild(p);
	results.appendChild(mainresults);
	setimages('gempic')
	h1 = document.createElement('h1');
	h1.innerHTML += 'Total time: ' + formattime(totaltime);
	results.appendChild(h1);
	
  }


  
  
</script>
</head>
<body onload="loadpage()">
<span id="pouchpicdata" style="display:none">  data:image/png;base64,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</span>

<span id="coinpicdata" style="display:none">   data:image/png;base64,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</span>

<span id="gempicdata" style="display:none"> data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAQCAYAAAAiYZ4HAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAmZJREFUeNpskjtok2EYhZ/v+7/8Sf4m6SU2oBXEIkWwoiUoKJSC4KCDg5OKIDh0LDgJDoJDC53EyUkHFaQOFtGq9BIpakMvNt5io9HY1GqrzaXk0pjr51DaxR442zmcl5dH/B5aYytpg22iXLsoDXGyWuMcgl8A8r9gjR1IcdX5U4QaP6X6m+rMLmnIm7oMlEAiYNNG7YrVYLxtctmveRQ7bT4vMquot5mniItLvJNI8kAedMXY73qc6HWbxWblF3DEATYNaTBNSb3H0Sc+iKOKiAQJMlftdkwquOyECrAEFBTLr8bI5QvYy6ZjJla4rAiDNo1mZyh9Vh4qQkZBDEjD2vclPt+JoLWXFqOV+9btqBLzNYTQZ5wLMS/nd0EY+AMYsDz9HkM3YsoGMu7qWiA7OqpEqmqzr650a+8CtbIfGQFyUPmbIRWO47C30Gg1MGRMhZLV5LQSOX1cpUfbi3vcuBbsUF5/b3I+hCrWML1g1dczuDT0HEgqKWM9VG5RWPLjauoELKrVPJnEFD6fD4fL4osrmQhGX44AKN1Y9cjfFYxfk6Q9j1gprRJafIJNCU4c7sHZ0sqT+ECwWCl8AJCl9o6+YmsndZUErz/183TuOonsD36mvzETe0DxoIfB+OBTYG0djQ6GSqcvvCxamlQ5CRSAVXzN25F72xhYfDYXmf84voGOEm0Fra2Dvak3x54XRu6yu70Lt/9YKWq5wvfmJgIjN26M1Srl2EZB5F5oDBti9fu3wMSrhweC2dT44+nh4c/R2dfA141TNhfGZwOYptbBcKi7/37/vnwmOQksA3or7P8NALPjBl6AcegAAAAAAElFTkSuQmCC</span>


<h1>Siege calculator</h1>
<p>Select event: <select id="siegeevent" onchange="updatepage()">
  </select></p>

<img name="coinpic" src="" alt="Current coins" /> <input id="curcoins" type="number" value="0" min="0" max="950000" style="width:80px"/>
<br>
<br>
<table>
<td style="width:200px">
Current gear levels: <br>
<input id="curarmor" type="number" value="9" min="1" max="88" style="width:60px" onchange="updatedmg('curarmor')"/><br>
<input id="curhelmet" type="number" value="9" min="1" max="88" style="width:60px" onchange="updatedmg('curhelmet')"/>
</td><td>
Current gear power: <br>
<input id="curarmordmg" type="text" value="9" style="width:60px" disabled="true" /><br>
<input id="curhelmetdmg" type="text" value="9" style="width:60px" disabled="true" />
</td>
</table>

   <p id="helpers">
   </p>

<br>   
 Current stage: <select id="curstage">

  </select>
  <br>
  
  <!--
  <span>Current time: </span><input id="curdaytime" type="text" disabled="true" size="1" onchange=""> 
  <span>  Sleeping hours: </span><input id="startsleep" type="Number" value="0" min="0", max="23">-<input id="endsleep" type="Number" value="8" min="0", max="23">
  -->
     
  <div id="results"></div>

  <p id="bosstip1" style="display:none">
  <br>
  <input id="skiprec" type="checkbox" onchange="skiprecendis()"> <span id="">Calc with chance of extra hit <span id="" style="color:red; font-size:18pt display:inline"><b>*   </b></span> </span>
  <select id="skiprechits" disabled="true">
    <option value="1">1 hit</option>
	<option value="2">2 hits (rare)</option>
  </select>
  </p>
  
  <p><input style="width:450px" type="button" value="Calculate" onclick="calctime()"></p>
  
  <p id="bosstip2" style="display:none"><span style="color:red; font-size:18pt">*</span> It's possible to defeat the bosses with power less than<br>
  recommended, if there will be more target icons than usual during<br>
  the battle with them. It requires several retries for it to happen.</p>
  <br>
  <br>
  
  <p id="" style="display:inline">Times for extra gems (by the end of event) are actual if you stop upgrading<br>
  your gear after reaching the end of stage (if you decide to stop on particular<br>
  stage or simply have not enough time to finish it by the event ending)
  </p>
  
  <br>
  <br>
  <i><p>This calculator <b>does not</b> account for extra coins made by tapping<br>
  character while it is glowing (happens every hour)</p>
  <p>All calculations are approximate, actual times depend on<br>
  how often you can check your pouch and upgrade gear.</p>
<br>
Send any questions and suggestions <a href="https://www.reddit.com/user/Nice_Coconut">here</a>