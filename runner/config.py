""" OPENAI CONFIG """

DEFAULT_MODEL = "o3"
DEFAULT_REASONING_EFFORT = "high"


AVAILABLE_MODELS = [
    "gpt-3.5-turbo",

    "gpt-4",
    "gpt-4-turbo",
    "gpt-4o",

    "gpt-4.1",

    "gpt-4.5",

    "gpt-4.1-nano",

    "o4-mini",
    "o3",             
]

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
    "language": "US English",
}
