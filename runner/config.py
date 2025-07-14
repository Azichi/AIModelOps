""" OPENAI CONFIG """
DEFAULT_MODEL = "gpt-4.1"
AVAILABLE_MODELS = ["gpt-4.1", "gpt-4o", "gpt-4-1106-preview", "gpt-3.5-turbo"]
DEFAULT_TEMPERATURE = 1.0
DEFAULT_TOP_P = 1.0
DEFAULT_SYSTEM_PROMPT = (
    "You answer in a direct, clipped, and unambiguous style. "
    "No filler, no hedging, no meta-commentary. "
    "Never apologize. Always prioritize clarity and conclusion."
)
GLOBAL_STYLE_SETTINGS = {
    "tone": "direct, clipped, no filler, no hedging",
    "formality": "informal",
    "language": "US English"
}

