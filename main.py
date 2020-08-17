from typing import NamedTuple

class Weapon(NamedTuple):
    name: str
    cost: int
    stats: int

def dp_knapsack(max_cost, weapon_list):
    max_weapons = 20
    weapons = []
    for weapon in weapon_list:
        weapons.append(Weapon(weapon[0], weapon[1], weapon[2]))
    length = len(weapons)
    knapsack = [[[0 for c in range(max_cost + 1)]
            for l in range(length + 1)]
            for n in range(max_weapons + 1)]

    out = {}

    for n in range(1, max_weapons + 1):
        for i in range(1, length + 1):
            for cost in range(max_cost + 1):
                if weapons[i - 1].cost <= cost:
                    knapsack[n][i][cost] = max(weapons[i - 1].stats
                      + knapsack[n - 1][i - 1][cost - weapons[i - 1].cost], knapsack[n][i - 1][cost])
                else:
                    knapsack[n][i][cost] = knapsack[n][i - 1][cost]

    total_stats = knapsack[max_weapons][length][max_cost]
    out["total_stats"] = total_stats
    out["total_cost"] = 0
    out_weapons = []

    total_cost = max_cost
    num_weapons = max_weapons
    for i in range(length, 0, -1):
        if total_stats <= 0:
            break
        if total_stats == knapsack[num_weapons][i - 1][total_cost]:
            continue
        else:
            out_weapons.append(weapons[i - 1])
            out["total_cost"] += weapons[i - 1].cost

            total_stats -= weapons[i - 1].stats
            total_cost -= weapons[i - 1].cost
            num_weapons -= 1

    out_weapons.sort(key=lambda w: w.stats, reverse=True)
    out["weapons"] = [weapon.name for weapon in out_weapons]

    return out

weapons = [["w1", 10, 60], ["w2", 20, 100], ["w3", 30, 120]]
max_cost = 50
print(dp_knapsack(max_cost, weapons))