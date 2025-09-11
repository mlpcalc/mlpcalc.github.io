function isLocalhost() {
  return window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    RegExp(
      '^([a-z0-9\\.\\-_%]+:([a-z0-9\\.\\-_%])+?@)?' +
      '((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\\.){3}(25[0-5]|2[0-4' +
      '][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])?' +
      '(:[0-9]+)?(\/[^\\s]*)?$',
    'i').test(window.location.hostname)
}


function resizeIframe() {
  let iframeSize = document.body.scrollHeight
  parent.postMessage(iframeSize, "*");
  //debugger
  Promise.all(document.images.length ? Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; })) : [true]).then(() => {
    //debugger
    let iframeSize = document.body.parentElement.scrollHeight + 1
    parent.postMessage(iframeSize, "*");
  });
}


async function getJson(file) {
  const response = await fetch(file);
  const json = await response.json();
  return json;
}

function formattime(time) {
  if (Math.trunc(time) == 0) return "0s";
  var out = "";
  var d_h_m_s = [0, 0, 0, 0];
  var letters = ["d", "h", "m", "s"];
  [time, d_h_m_s[0]] = trunctime(time, 86400);
  [time, d_h_m_s[1]] = trunctime(time, 3600);
  [time, d_h_m_s[2]] = trunctime(time, 60);
  if (d_h_m_s[0] > 0 || d_h_m_s[1] > 0) d_h_m_s[3] = 0;
  else d_h_m_s[3] = Math.trunc(time);
  for (var i = 0; i < d_h_m_s.length; i++) {
    if (d_h_m_s[i] > 0) {
      out += " " + d_h_m_s[i] + letters[i];
    }
  }
  return out.trim();
}

function trunctime(time, value) {
  var num = Math.trunc(time / value);
  time -= value * num;
  return [time, num];
}

function addToDropDownList(selBox, arr) {
  let newOption;
  for (let i = 0; i < arr.length; i++) {
    newOption = new Option(arr[i][0], arr[i][1]);
    selBox.add(newOption, undefined);
  }
}

function clearDropDownList(selBox) {
  while (selBox.options.length > 0) {
    selBox.remove(0);
  }
}

function generateEventList() {
  clearDropDownList(eventList);
  let htmlEventList = [],
    tmp;
  for (i in gamedata) {
    tmp = [i, i];
    htmlEventList.push(tmp);
  }
  htmlEventList.sort();
  addToDropDownList(eventList, htmlEventList);
}

function checkUncheck(checkboxId) {
  chbox = document.getElementById(checkboxId);
  chbox.checked = !chbox.checked;
}

function swapImages() {
  let tmp = "";
  let helpers = document.getElementsByClassName("helperimage");
  if (portraits == "helpers_portraits") {
    tmp = "helpers";
  } else {
    tmp = "helpers_portraits";
  }
  for (let i = 0; i < helpers.length; i++) {
    let name = helpers[i].src.split("/");
    name = name[name.length - 1];
    helpers[i].src = "assets/" + tmp + "/" + name;
  }
  portraits = tmp;
}

function getSavedHelpers() {
    if (localStorage.hasOwnProperty('helpers')) {
      helpers = ['Twilight Sparkle']
        try {
          helpers = JSON.parse(localStorage.getItem('helpers'))
        } catch {
          saveHelper('Twilight Sparkle')
        }
        return helpers
    }
    return ['Twilight Sparkle']
}

function saveHelper(helper) {
  helper = helper.trim()
  
  if (!localStorage.hasOwnProperty('helpers')) {
    localStorage.setItem('helpers', '["Twilight Sparkle"]')
  }
  let helpers = []
  try {
    helpers = JSON.parse(localStorage.getItem('helpers'))
  } catch {
    helpers = ['Twilight Sparkle']
  }

  if (helpers.includes(helper)) {
    return
  }

  helpers.push(helper)
  helpers = [...new Set(helpers)]
  localStorage.setItem('helpers', JSON.stringify(helpers))
}

function removeSavedHelper(helper) {
  helper = helper.trim()

  if (!localStorage.hasOwnProperty('helpers')) {
    localStorage.setItem('helpers', '["Twilight Sparkle"]')
  }
  let helpers = []
  try {
    helpers = JSON.parse(localStorage.getItem('helpers'))
  } catch {
    helpers = ['Twilight Sparkle']
  }

  if (!helpers.includes(helper)) {
    return
  }

  helpers.splice(helpers.indexOf(helper), 1)
  helpers = [...new Set(helpers)]
  localStorage.setItem('helpers', JSON.stringify(helpers))
}

function generateHelpers() {
  let p = document.getElementById("helpers");
  p.innerHTML =
    '<label for="switchHelperView"><b>Helpers:</b></label> <input id="switchHelperView" style="width:100px" type="button" value="switch view" onclick="swapImages()"><br>';
  //let helpdmgs = maindata['helpdmg'];
  let i, j;
  var table, td, tr, input, span, img;

  let stagenums = [];
  for (i = 0; i < helpnames.length; i++) {
    stagenums.push([]);
  }
  for (i = 0; i < helpstage.length; i++) {
    for (j = 0; j < helpstage[i].length; j++) {
      stagenums[helpstage[i][j]].push(i + 1);
    }
  }

  table = document.createElement("table");
  table.style.textAlign = "center";
  j = 0;
  for (i = 0; i < helpnames.length; i++) {
    if (j == 0) {
      tr = document.createElement("tr");
    }
    j += 1;
    td = document.createElement("td");
    td.classList.add('helper')
    input = document.createElement("input");
    input.id = "help" + i;
    input.type = "checkbox";
    td.append(input);
    // tr.append(td);
    // td = document.createElement("td");

    span = document.createElement("label");
    span.setAttribute('for', input.id)
    let hstages = "";
    if (stagenums[i].length == 1) {
      hstages = "stage " + stagenums[i].toString();
    } else if (
      stagenums[i].length > 1 &&
      stagenums[i].length < helpstage.length
    ) {
      hstages = "stages " + stagenums[i].toString();
    }
    img = document.createElement("img");
    img.id = "helperimg" + i;
    img.src = "assets/" + portraits + "/" + helpnames[i] + ".png";
    img.className = "helperimage";
    img.alt = helpnames[i];
    img.title = helpnames[i];
    //exception for blitz with 4 helpers available on all stages
    //so their portraits wouldn't be too small
    if (helpstage[0].length == 4) {
      helpLen = 2;
    } else {
      helpLen = helpstage[0].length;
    }
    //set portrait size according to number of helpers in each stage
    //(with exception of blitz with 4 helpers available on all stages)
    img.height = Math.trunc(180 / helpLen);
    img.onerror = function () {
      let imgerr = document.getElementById(this.id);
      imgerr.outerHTML = imgerr.alt;
    };
    span.append(img);
    if (hstages != "") {
      span.innerHTML += `<br>(${hstages})`;
    }
    td.append(span);
    tr.append(td);
    if (j == helpLen) {
      table.append(tr);
      j = 0;
    }
  }
  if (j > 0) {
    table.append(tr);
  }
  document.getElementById("helpers").append(table);

  let savedHelpers = getSavedHelpers()
  for (i = 0; i < maindata["helpnames"].length; i++) {
    //https://developer.mozilla.org/en-US/docs/Glossary/IIFE
    //to prevent setting setHelpers always with LAST item
    //https://stackoverflow.com/questions/30476721/passing-parameter-onclick-in-a-loop
    document.getElementById("help" + i).onchange = (function (i) {
      return function () {
        setHelpers(i);
      };
    })(i);

    if (savedHelpers.includes(maindata["helpnames"][i].trim())) {
      document.getElementById("help" + i).checked = true
      setHelpers(i)
    }

    //assigning onclick to every image (not just to checkboxes)
    //same as above
    // document.getElementById("helperimg" + i).onclick = (function (i) {
    //   return function () {
    //     checkUncheck("help" + i);
    //     setHelpers(i);
    //   };
    // })(i);
  }
}
