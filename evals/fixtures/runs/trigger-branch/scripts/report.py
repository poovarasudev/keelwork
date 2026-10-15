import json


def tag_report(notes, seen=[]):
    for note in notes:
        for tag in note.get("tags", []):
            if tag not in seen:
                seen.append(tag)
    return seen


def load(path):
    try:
        return json.load(open(path))
    except:
        return []
