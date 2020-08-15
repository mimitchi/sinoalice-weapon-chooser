from typing import NamedTuple

class Weapon(NamedTuple):
    name: str
    cost: int
    stats: int

def knapSack(max_cost, weapon_list):
    max_weapons = 20
    weapons = []
    for weapon in weapon_list:
        weapons.append(Weapon(weapon[0], weapon[1], weapon[2]))
    length = len(weapons)
    K = [[[0 for c in range(max_cost + 1)] 
            for l in range(length + 1)]
            for n in range(max_weapons + 1)] 

    out = {}

    for n in range(max_weapons + 1):
        for i in range(length + 1): 
            for cost in range(max_cost + 1): 
                if n == 0 or i == 0 or cost == 0: 
                    K[n][i][cost] = 0
                elif weapons[i - 1].cost <= cost: 
                    K[n][i][cost] = max(weapons[i - 1].stats  
                      + K[n - 1][i - 1][cost - weapons[i - 1].cost], 
                                   K[n][i - 1][cost]) 
                else: 
                    K[n][i][cost] = K[n][i - 1][cost] 
  
    # stores the result of Knapsack 
    res = K[max_weapons][length][max_cost] 
    out["total_stats"] = res
    out_weapons = []
      
    cost = max_cost 
    for i in range(length, 0, -1): 
        if res <= 0: 
            break
        # either the result comes from the 
        # top (K[n][i-1][w]) or from (val[i-1] 
        # + K[n-1][i-1] [w-wt[i-1]]) as in Knapsack 
        # table. If it comes from the latter 
        # one/ it means the item is included. 
        if res == K[max_weapons][i - 1][cost]: 
            continue
        else: 
            out_weapons.append(weapons[i - 1]) 

            res -= weapons[i - 1].stats 
            cost -= weapons[i - 1].cost

    out["weapons"] = [weapon.name for weapon in out_weapons]

    return out
  
# Driver program to test above function 
weapons = [["w1", 10, 60], ["w2", 20, 100], ["w3", 30, 120]]
max_cost = 50
print(knapSack(max_cost, weapons))