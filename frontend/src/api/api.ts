import axios from 'axios'
import type {
  CreateCharacterRequest,
  CreateCharacterResponse,
  GeistRollRequest,
  GeistRollResponse,
  StoryInteractRequest,
  StoryInteractResponse,
  ErrorResponse
} from '../types/api'

/**
 * API Configuration
 * 
 * The API client uses axios for HTTP requests with a base configuration:
 * - Base URL from environment or localhost fallback
 * - JSON content type header
 * - Standardized error handling
 */
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000'
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Standardized error handling for API requests
 * 
 * Processes axios errors into a consistent format:
 * - Extracts error details from response if available
 * - Provides fallback for unknown errors
 * 
 * @param error - The error caught from an API request
 * @throws Error with formatted message
 */
const handleError = (error: any): never => {
  if (axios.isAxiosError(error) && error.response) {
    const errorResponse = error.response.data as ErrorResponse
    throw new Error(errorResponse.detail || 'An unknown error occurred')
  }
  throw error
}

/**
 * Love & Dice RPG API Client
 * 
 * Provides typed methods for interacting with the game's backend services:
 * - Character creation and management
 * - Geist roll system for action resolution
 * - Story interaction with NPCs
 * - Action probability queries
 */
export const apiClient = {
  /**
   * Create a new character with primary traits
   * 
   * The server will:
   * 1. Validate trait values (1-100)
   * 2. Calculate secondary traits
   * 3. Calculate tertiary traits
   * 4. Return complete character profile
   * 
   * @param request - Character creation parameters
   * @returns Promise with complete character data
   */
  async createCharacter(request: CreateCharacterRequest): Promise<CreateCharacterResponse> {
    try {
      const response = await api.post<CreateCharacterResponse>('/api/character/create', request)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  /**
   * Execute a Geist roll for an action
   * 
   * The Geist system:
   * 1. Gets base probability for the action
   * 2. Applies trait modifiers
   * 3. Performs the roll
   * 4. Determines success/failure
   * 
   * For new actions:
   * - Automatically adds to probability table
   * - Uses complexity-based default probability
   * - Returns is_new_action flag
   * 
   * @param request - Roll parameters including action and traits
   * @returns Promise with detailed roll results
   */
  async performRoll(request: GeistRollRequest): Promise<GeistRollResponse> {
    try {
      const response = await api.post<GeistRollResponse>('/api/geist/roll', request)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  },

  /**
   * Get available actions and their complexities
   * 
   * Returns a mapping of:
   * - Common actions (compliment, flirt, etc.)
   * - Their complexity levels
   * - Default success probabilities
   * 
   * This helps the UI:
   * - Show available actions
   * - Display difficulty levels
   * - Calculate success chances
   * 
   * @returns Promise with action-complexity mapping
   */
  async getAvailableActions(): Promise<Record<string, string>> {
    try {
      const response = await api.get<{
        common_actions: Record<string, string>
      }>('/api/geist/actions')
      return response.data.common_actions
    } catch (error) {
      return handleError(error)
    }
  },

  /**
   * Process a dialogue interaction with an NPC
   * 
   * The interaction system:
   * 1. Processes player dialogue
   * 2. Considers NPC state (mood, affection, etc.)
   * 3. Applies dialogue tone effects
   * 4. Generates contextual response
   * 5. Updates relationship status
   * 
   * @param request - Interaction parameters including dialogue and context
   * @returns Promise with NPC response and state changes
   */
  async interact(request: StoryInteractRequest): Promise<StoryInteractResponse> {
    try {
      const response = await api.post<StoryInteractResponse>('/api/story/interact', request)
      return response.data
    } catch (error) {
      return handleError(error)
    }
  }
}

export default apiClient 