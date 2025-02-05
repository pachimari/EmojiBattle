try:
    from .prompt_gen_node import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
    WEB_DIRECTORY = None
    __all__ = ["NODE_CLASS_MAPPINGS",
               "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
    print("Prompt Generator Node loaded successfully!")
except ImportError as e:
    print(f"Failed to load Prompt Generator Node: {str(e)}")
    NODE_CLASS_MAPPINGS = {}
    NODE_DISPLAY_NAME_MAPPINGS = {}
    WEB_DIRECTORY = None
    __all__ = []
