var weapons = [];

function addWeapon() {
  var weapon_name = document.getElementById('weapon_name');
  var cost = document.getElementById('cost');
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
    success: function(data, status){
      result = data["body"];
      var output = document.getElementById('output');
      result_json = JSON.parse(result);
      output.textContent = "Total Stats: " + result_json["total_stats"] + "\r\n" + "Weapons: " + result_json["weapons"].join(", ");
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