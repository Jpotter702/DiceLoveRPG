// API Types for Love & Dice RPG

import type { PrimaryTraits, SecondaryTraits, TertiaryTraits, ActionComplexity } from './character'

// Common Enums
export enum DialogueTone {
  FRIENDLY = 'friendly',    // +1 AP mod
  FLIRTY = 'flirty',       // +2 AP mod
  SERIOUS = 'serious',     // +0 AP mod
  PLAYFUL = 'playful',     // +1 AP mod
  ROMANTIC = 'romantic',   // +3 AP mod
  NERVOUS = 'nervous'      // -1 AP mod
}

export enum NPCMood {
  HAPPY = 'happy',         // +1 mod
  NEUTRAL = 'neutral',     // +0 mod
  SAD = 'sad',            // -1 mod
  EXCITED = 'excited',    // +2 mod
  ANNOYED = 'annoyed',    // -2 mod
  SMITTEN = 'smitten',    // +3 mod
  CONFUSED = 'confused'   // +0 mod
}

export enum RollResult {
  CRITICAL_SUCCESS = 'critical_success',   // Roll <= 10% of target
  SUCCESS = 'success',                     // Roll <= target
  FAILURE = 'failure',                     // Roll > target
  CRITICAL_FAILURE = 'critical_failure'    // Roll > 190% of target
}

// Request Types
export interface CreateCharacterRequest {
  name: string
  primary_traits: PrimaryTraits
}

export interface GeistRollRequest {
  action_type: string
  complexity?: ActionComplexity
  primary_traits: PrimaryTraits
  secondary_traits: SecondaryTraits
  tertiary_traits: TertiaryTraits
}

export interface NPCState {
  name: string
  affection: number
  mood: NPCMood
  context: string[]
  relationship_status: string
}

export interface StoryContext {
  location: string
  time_of_day: string
  current_event: string
  previous_interactions?: string[]
}

export interface StoryInteractRequest {
  npc_id: string
  player_name: string
  player_dialogue: string
  dialogue_tone: DialogueTone
  npc_state: NPCState
  story_context: StoryContext
}

// Response Types
export interface CreateCharacterResponse {
  name: string
  primary_traits: PrimaryTraits
  secondary_traits: SecondaryTraits
  tertiary_traits: TertiaryTraits
}

export interface GeistRollResponse {
  action_type: string
  is_new_action: boolean
  complexity: ActionComplexity
  base_probability: number
  trait_modifier: number
  final_probability: number
  roll_value: number
  result: RollResult
}

export interface StoryInteractResponse {
  npc_id: string
  npc_name: string
  response_text: string
  new_mood: NPCMood
  mood_change_reason: string
  affection_change: number
}

export interface ErrorResponse {
  detail: string
} 