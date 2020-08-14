from typing import NamedTuple

class Weapon(NamedTuple):
    name: str
    cost: int
    stats: int

def knapSack(max_cost, weapon_list, max_weapons):
    weapons = []
    for weapon in weapon_list:
        weapons.append(Weapon(weapon[0], weapon[1], weapon[2]))
    length = len(weapons)
    K = [[0 for c in range(max_cost + 1)] 
            for l in range(length + 1)] 

    out = {}
              
    # Build table K[][] in bottom 
    # up manner 
    for i in range(length + 1): 
        for cost in range(max_cost + 1): 
            if i == 0 or cost == 0: 
                K[i][cost] = 0
            elif weapons[i - 1].cost <= cost: 
                K[i][cost] = max(weapons[i - 1].stats  
                  + K[i - 1][cost - weapons[i - 1].cost], 
                               K[i - 1][cost]) 
            else: 
                K[i][cost] = K[i - 1][cost] 
  
    # stores the result of Knapsack 
    res = K[length][max_cost] 
    out["total_stats"] = res
    out_weapons = []
      
    cost = max_cost 
    for i in range(length, 0, -1): 
        if res <= 0: 
            break
        # either the result comes from the 
        # top (K[i-1][w]) or from (val[i-1] 
        # + K[i-1] [w-wt[i-1]]) as in Knapsack 
        # table. If it comes from the latter 
        # one/ it means the item is included. 
        if res == K[i - 1][cost]: 
            continue
        else: 
  
            # This item is included. 
            out_weapons.append(weapons[i - 1]) 
              
            # Since this weight is included 
            # its value is deducted 
            res -= weapons[i - 1].stats 
            cost -= weapons[i - 1].cost

    out_weapons.sort(key=lambda w: w.stats, reverse=True)

    while len(out_weapons) > max_weapons:
        remove = out_weapons.pop()
        out["total_stats"] -= remove.stats

    out["weapons"] = [weapon.name for weapon in out_weapons]

    return out
  
# Driver program to test above function 
weapons = [["w1", 10, 60], ["w2", 20, 100], ["w3", 30, 120]]
max_cost = 50
print(knapSack(max_cost, weapons, 1))