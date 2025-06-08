import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from models.npc import NPC, AffectionLevel
from models.geist import RollResult

# Constants
AP_STORE_PATH = Path(__file__).parent.parent / "data" / "affection_points.json"
AP_STORE_PATH.parent.mkdir(parents=True, exist_ok=True)

# AP changes based on roll results
AP_CHANGES = {
    RollResult.CRITICAL_SUCCESS: 10,
    RollResult.SUCCESS: 5,
    RollResult.FAILURE: -2,
    RollResult.CRITICAL_FAILURE: -5
}

class AffectionService:
    def __init__(self):
        """Initialize the affection service with in-memory store."""
        self._npc_store: Dict[str, NPC] = {}
        self._load_from_disk()
    
    def _load_from_disk(self) -> None:
        """Load NPC data from JSON file if it exists."""
        if AP_STORE_PATH.exists():
            with open(AP_STORE_PATH) as f:
                data = json.load(f)
                self._npc_store = {
                    npc_id: NPC(**npc_data)
                    for npc_id, npc_data in data.items()
                }
    
    def _save_to_disk(self) -> None:
        """Save current NPC data to JSON file."""
        data = {
            npc_id: npc.dict()
            for npc_id, npc in self._npc_store.items()
        }
        with open(AP_STORE_PATH, 'w') as f:
            json.dump(data, f, indent=2)
    
    def get_npc(self, npc_id: str) -> Optional[NPC]:
        """Get NPC by ID."""
        return self._npc_store.get(npc_id)
    
    def list_npcs(self) -> List[NPC]:
        """Get all NPCs."""
        return list(self._npc_store.values())
    
    def create_npc(self, name: str) -> NPC:
        """Create a new NPC."""
        npc_id = f"npc_{len(self._npc_store) + 1}"
        npc = NPC(id=npc_id, name=name)
        self._npc_store[npc_id] = npc
        self._save_to_disk()
        return npc
    
    def update_ap(
        self,
        npc_id: str,
        roll_result: RollResult,
        action_type: str
    ) -> Tuple[NPC, int, Optional[AffectionLevel]]:
        """
        Update NPC's affection points based on a roll result.
        
        Args:
            npc_id: The ID of the NPC
            roll_result: The result of the Geist roll
            action_type: The type of action performed
            
        Returns:
            Tuple of (updated_npc, ap_change, level_up)
            - updated_npc: The NPC with updated AP
            - ap_change: The amount AP changed
            - level_up: New affection level if leveled up, None otherwise
        """
        npc = self.get_npc(npc_id)
        if not npc:
            raise ValueError(f"NPC with ID {npc_id} not found")
        
        # Get base AP change from roll result
        ap_change = AP_CHANGES[roll_result]
        
        # Store old level for comparison
        old_level = npc.level
        
        # Update AP ensuring it stays within bounds
        new_ap = max(0, min(100, npc.affection_points + ap_change))
        npc.affection_points = new_ap
        
        # Check for level up
        level_up = npc.level if npc.level != old_level else None
        
        # Save changes
        self._npc_store[npc_id] = npc
        self._save_to_disk()
        
        return npc, ap_change, level_up
    
    def reset_ap(self, npc_id: str) -> NPC:
        """Reset an NPC's affection points to 0."""
        npc = self.get_npc(npc_id)
        if not npc:
            raise ValueError(f"NPC with ID {npc_id} not found")
        
        npc.affection_points = 0
        self._npc_store[npc_id] = npc
        self._save_to_disk()
        return npc

# Global instance
affection_service = AffectionService() 