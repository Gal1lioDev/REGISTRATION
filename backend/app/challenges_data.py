from typing import Dict, Any, List

CHALLENGES: Dict[int, Dict[str, Any]] = {
    1: {
        "id": 1,
        "title": "Recon",
        "difficulty": "EASY",
        "description": "Some information is hidden in plain sight.\nFind the first keyword hidden in this website.",
        "hints": [
            "The clue is on this website, not inside the terminal.",
            "Inspect the page source and look for an HTML comment.",
        ],
        "answer": "RECON",
    },
    2: {
        "id": 2,
        "title": "Decode",
        "difficulty": "EASY",
        "description": "An intercepted message has been recovered.\nPayload: QlJFQUNI\nIdentify the encoding and recover the keyword.",
        "hints": [
            "The payload is encoded, not encrypted.",
            "Look for a common encoding that uses letters, numbers, plus signs, slashes, and sometimes equals signs.",
        ],
        "answer": "BREACH",
    },
}


def get_public_challenge_info(challenge_id: int, completed: bool = False) -> Dict[str, Any]:
    c = CHALLENGES[challenge_id]
    return {
        "id": c["id"],
        "title": c["title"],
        "difficulty": c["difficulty"],
        "description": c["description"],
        "hints": c["hints"],
        "completed": completed,
    }


def get_all_public_challenges(completed_1: bool, completed_2: bool) -> List[Dict[str, Any]]:
    return [
        get_public_challenge_info(1, completed=completed_1),
        get_public_challenge_info(2, completed=completed_2),
    ]


def verify_challenge_answer(challenge_id: int, submitted_answer: str) -> bool:
    if challenge_id not in CHALLENGES:
        return False
    expected = CHALLENGES[challenge_id]["answer"]
    return submitted_answer.strip().upper() == expected
