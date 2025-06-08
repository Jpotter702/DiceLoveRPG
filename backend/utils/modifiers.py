# Functions to calculate dice modifiers or adjust probability based on traits

def apply_trait_bonus(base_chance: int, trait_score: int) -> int:
    return min(100, base_chance + (trait_score // 10))
