var weapons = [];
var all_weapons = {}
var weapons_by_id = {}

const rarity = {
  1: "C",
  2: "B",
  3: "A",
  4: "S",
  5: "SR",
  6: "L"
}

function addWeapon() {
  var weapon_name = document.getElementById('weapon_name');
  var cost = document.getElementById('cost');
  var level = document.getElementById('level');
  var stats = document.getElementById('stats');
  var weapon_list = document.getElementById('weapons');

  weapons.push([weapon_name.value, parseInt(cost.value), parseInt(stats.value)]);
  var new_weapon = document.createElement('li');
  new_weapon.setAttribute("id", weapon_name.value);
  new_weapon.innerHTML = weapon_name.value + " &nbsp;&nbsp;&nbsp;&nbsp; cost: " + cost.value + " &nbsp;&nbsp;&nbsp;&nbsp; stats: " + stats.value;
  var close_symbol = document.createElement('SPAN');
  close_symbol.innerHTML = "<span class=\"close\">x</span>";
  new_weapon.appendChild(close_symbol);
  function compareID(id) {
    return function(value) {
      return value[0] !== id;
    }
  }
  close_symbol.addEventListener("click", function() {
    weapons = weapons.filter(compareID(this.parentElement.id));
    this.parentElement.remove();
  });
  weapon_list.appendChild(new_weapon);

  weapon_name.value = "";
  cost.value = "";
  stats.value = "";
  level.value = "";
}

function returnWeapons() {
  var max_cost = document.getElementById('max_cost');

  data = {
      "max_cost": parseInt(max_cost.value),
      "weapons": weapons
  };

  const url = "https://j3jdr5p36a.execute-api.us-east-1.amazonaws.com/prod/sinoalice-weapon-chooser";
  $.ajax({
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: JSON.stringify(data),
    type: "POST",
    success: function(data, status) {
      result = data["body"];
      var output = document.getElementById('output');
      result_json = JSON.parse(result);
      output.textContent = "Total Stats: " + result_json["total_stats"] + "\r\n" + "Total Cost: " + result_json["total_cost"] + "\r\n" + "Weapons: " + result_json["weapons"].join(", ");
    }
  });
}

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              var cost = document.getElementById('cost');
              var level = document.getElementById('level');
              var stats = document.getElementById('stats');

              cost.value = all_weapons[inp.value][0]
              stats.value = all_weapons[inp.value][1]
              level.value = all_weapons[inp.value][2]
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
        if (arr[i].toUpperCase().includes(val.toUpperCase(), 1)) {
          substr_idx = arr[i].toUpperCase().indexOf(val.toUpperCase())
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = arr[i].substring(0, substr_idx)
          b.innerHTML += "<strong>" + arr[i].substring(substr_idx, substr_idx + val.length) + "</strong>";
          b.innerHTML += arr[i].substr(substr_idx + val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              var cost = document.getElementById('cost');
              var level = document.getElementById('level');
              var stats = document.getElementById('stats');

              cost.value = all_weapons[inp.value][0]
              stats.value = all_weapons[inp.value][1]
              level.value = all_weapons[inp.value][2]
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

/*execute a function when someone clicks in the document:*/
document.addEventListener("click", function (e) {
    closeAllLists(e.target);
});
}

function setLevel(inp) {
  inp.addEventListener("change", function(e) {
    var a, b, i, val = this.value;

    level = parseInt(val)
    var weapon_name = document.getElementById('weapon_name');
    var stats = document.getElementById('stats');
    max_stats = all_weapons[weapon_name.value][1]
    max_level = all_weapons[weapon_name.value][2]
    add_stats = all_weapons[weapon_name.value][3]

    if (max_level >= level) {
      subtract_stats = (max_level - level) * add_stats;
      stats.value = max_stats - subtract_stats;
    }
  });
}

var calculate = document.getElementById('calculateButton');
calculate.addEventListener('click', function() {
  returnWeapons();
});
var add_weapon = document.getElementById('addWeapon');
add_weapon.addEventListener('click', function() {
  addWeapon();
});

var diff_weapons = {}

$.ajax({
  url: "https://cors-anywhere.herokuapp.com/https://sinoalice.game-db.tw/package/alice_weapons-en_diff.js",
  type: "GET",
  async: false,
  success: function(data, status) {
    data_json = JSON.parse(data)
    rows = data_json["Rows"]
    cols_str = data_json["Cols"]
    cols = cols_str.toUpperCase().split("|")
    id_idx = cols.indexOf('ID')
    cost_idx = cols.indexOf('COST')
    mdef_idx = cols.indexOf('MAXMDEF')
    pdef_idx = cols.indexOf('MAXPDEF')
    patk_idx = cols.indexOf('MAXMATK')
    matk_idx = cols.indexOf('MAXPATK')
    addmdef_idx = cols.indexOf('ADDMDEF')
    addpdef_idx = cols.indexOf('ADDPDEF')
    addmatk_idx = cols.indexOf('ADDMATK')
    addpatk_idx = cols.indexOf('ADDPATK')
    maxlvl_idx = cols.indexOf('MAXLV')
    for (i in rows) {
      weapon = rows[i].split("|")
      total_stats = parseInt(weapon[mdef_idx]) + parseInt(weapon[pdef_idx]) + parseInt(weapon[matk_idx]) + parseInt(weapon[patk_idx])
      add_stats = parseInt(weapon[addmdef_idx]) + parseInt(weapon[addpdef_idx]) + parseInt(weapon[addmatk_idx]) + parseInt(weapon[addpatk_idx])
      weapon_info = [parseInt(weapon[cost_idx]), total_stats, parseInt(weapon[maxlvl_idx]), add_stats]
      diff_weapons[weapon[id_idx]] = weapon_info
    }
  }
})

$.ajax({
  url: "https://cors-anywhere.herokuapp.com/https://sinoalice.game-db.tw/package/alice_weapons-en.js",
  type: "GET",
  async: false,
  success: function(data, status) {
    data_json = JSON.parse(data)
    rows = data_json["Rows"]
    cols_str = data_json["Cols"]
    cols = cols_str.toUpperCase().split("|")
    id_idx = cols.indexOf('ID')
    unique_id_idx = cols.indexOf('UNIQUEID')
    rarity_idx = cols.indexOf('RARITY')
    cost_idx = cols.indexOf('COST')
    mdef_idx = cols.indexOf('MAXMDEF')
    pdef_idx = cols.indexOf('MAXPDEF')
    patk_idx = cols.indexOf('MAXMATK')
    matk_idx = cols.indexOf('MAXPATK')
    addmdef_idx = cols.indexOf('ADDMDEF')
    addpdef_idx = cols.indexOf('ADDPDEF')
    addmatk_idx = cols.indexOf('ADDMATK')
    addpatk_idx = cols.indexOf('ADDPATK')
    maxlvl_idx = cols.indexOf('MAXLV')
    for (i in rows) {
      weapon = rows[i].split("|")
      if (weapon[id_idx] in diff_weapons) {
        weapon_info = [rarity[weapon[rarity_idx]], diff_weapons[weapon[id_idx]][0], diff_weapons[weapon[id_idx]][1], diff_weapons[weapon[id_idx]][2], diff_weapons[weapon[id_idx]][3]]
      }
      else {
        total_stats = parseInt(weapon[mdef_idx]) + parseInt(weapon[pdef_idx]) + parseInt(weapon[matk_idx]) + parseInt(weapon[patk_idx])
        add_stats = parseInt(weapon[addmdef_idx]) + parseInt(weapon[addpdef_idx]) + parseInt(weapon[addmatk_idx]) + parseInt(weapon[addpatk_idx])
        weapon_info = [rarity[weapon[rarity_idx]], weapon[cost_idx], total_stats, weapon[maxlvl_idx], add_stats]
      }
      if (weapon[unique_id_idx] in weapons_by_id) {
        weapons_by_id[weapon[unique_id_idx]].push(weapon_info)
      }
      else {
        weapons_by_id[weapon[unique_id_idx]] = [weapon_info]
      }
    }
  }
})

$.ajax({
  url: "https://cors-anywhere.herokuapp.com/https://sinoalice.game-db.tw/package/alice_weaponsglobal.js",
  type: "GET",
  async: false,
  success: function(data, status) {
    data_json = JSON.parse(data)
    names = data_json["Name"].split("|")
    ids = data_json["ID"].split("|")
    for (i in ids) {
      weapon = weapons_by_id[ids[i]]
      for (j in weapon) {
        weapon_name = names[i] + " (" + weapon[j][0] + ")"
        all_weapons[weapon_name] = [weapon[j][1], weapon[j][2], weapon[j][3], weapon[j][4]]
      }
    }
  }
})

autocomplete(document.getElementById("weapon_name"), Object.keys(all_weapons));
setLevel(document.getElementById("level"));

