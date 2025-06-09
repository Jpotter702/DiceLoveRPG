import { useCharacter } from '../../context/CharacterContext'
import { useChat } from '../../context/ChatContext'
import { TraitCard } from '../character/TraitCard'
import { RelationshipCard } from '../character/RelationshipCard'

export function CharacterSheet() {
  const { character } = useCharacter()
  const { npcState } = useChat()

  if (!character) {
    return (
      <div className="text-center p-8 text-secondary-foreground/60">
        <p className="text-lg mb-2">No Character Created</p>
        <p className="text-sm">Create a character to begin your journey...</p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* Character Name */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">{character.name}</h1>
      </div>

      {/* Relationships */}
      {npcState && (
        <div>
          <h2 className="text-xl font-semibold mb-3 text-foreground/80">Relationships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RelationshipCard npc={npcState} />
          </div>
        </div>
      )}

      {/* Primary Traits */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-foreground/80">Primary Traits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TraitCard
            name="Charm"
            value={character.primaryTraits.charm}
            description="Natural charisma and appeal"
          />
          <TraitCard
            name="Wit"
            value={character.primaryTraits.wit}
            description="Quick thinking and humor"
          />
          <TraitCard
            name="Empathy"
            value={character.primaryTraits.empathy}
            description="Understanding others' emotions"
          />
          <TraitCard
            name="Style"
            value={character.primaryTraits.style}
            description="Personal presentation and aesthetic"
          />
          <TraitCard
            name="Confidence"
            value={character.primaryTraits.confidence}
            description="Self-assurance and poise"
          />
          <TraitCard
            name="Luck"
            value={character.primaryTraits.luck}
            description="Fortune and serendipity"
          />
        </div>
      </div>

      {/* Secondary Traits */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-foreground/80">Secondary Traits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TraitCard
            name="Impression"
            value={character.secondaryTraits.impression}
            description="Overall impact on others"
            isSecondary
          />
          <TraitCard
            name="Flirtation"
            value={character.secondaryTraits.flirtation}
            description="Romantic interaction skill"
            isSecondary
          />
          <TraitCard
            name="Chemistry"
            value={character.secondaryTraits.chemistry}
            description="Natural compatibility"
            isSecondary
          />
        </div>
      </div>

      {/* Tertiary Traits */}
      <div>
        <h2 className="text-xl font-semibold mb-3 text-foreground/80">Tertiary Traits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TraitCard
            name="Romance"
            value={character.tertiaryTraits.romance}
            description="Overall romantic potential"
            isTertiary
          />
          <TraitCard
            name="Connection"
            value={character.tertiaryTraits.connection}
            description="Emotional bonding"
            isTertiary
          />
          <TraitCard
            name="Destiny"
            value={character.tertiaryTraits.destiny}
            description="Fateful encounters"
            isTertiary
          />
        </div>
      </div>
    </div>
  )
} 