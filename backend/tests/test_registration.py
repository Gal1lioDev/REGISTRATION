def test_registration_blocked_when_challenges_incomplete(client):
    client.get("/api/session")

    payload = {
        "team_name": "ZeroDay Warriors",
        "institution": "NIT Warangal",
        "leader_name": "Alice Cyber",
        "leader_email": "alice@nitw.ac.in",
        "leader_phone": "9876543210",
        "team_size": 2,
        "members": ["Bob Sec"],
        "agreed_to_rules": True,
    }

    # Attempt to bypass challenge requirement
    res = client.post("/api/registrations", json=payload)
    assert res.status_code == 403
    assert "ACCESS DENIED" in res.json()["detail"]


def test_registration_blocked_when_only_one_challenge_solved(client):
    client.get("/api/session")
    client.post("/api/challenges/1/submit", json={"answer": "RECON"})

    payload = {
        "team_name": "ZeroDay Warriors",
        "institution": "NIT Warangal",
        "leader_name": "Alice Cyber",
        "leader_email": "alice@nitw.ac.in",
        "leader_phone": "9876543210",
        "team_size": 1,
        "members": [],
        "agreed_to_rules": True,
    }

    res = client.post("/api/registrations", json=payload)
    assert res.status_code == 403


def test_registration_success_after_both_challenges(client):
    client.get("/api/session")
    client.post("/api/challenges/1/submit", json={"answer": "RECON"})
    client.post("/api/challenges/2/submit", json={"answer": "BREACH"})

    payload = {
        "team_name": "CyberKnights",
        "institution": "National Institute of Technology Warangal",
        "leader_name": "Rohit Kumar",
        "leader_email": "rohit@student.nitw.ac.in",
        "leader_phone": "9876543210",
        "team_size": 3,
        "members": ["Siddharth Rao", "Pooja Reddy"],
        "agreed_to_rules": True,
    }

    res = client.post("/api/registrations", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["registration_code"].startswith("DEFCON-2026-")
    assert data["team_name"] == "CyberKnights"
    assert len(data["members"]) == 2

    # Check progress endpoint now shows registered
    prog = client.get("/api/progress")
    assert prog.json()["registered"] is True
    assert prog.json()["registration_code"] == data["registration_code"]


def test_registration_duplicate_leader_email_rejected(client):
    # Session 1 registers
    client.get("/api/session")
    client.post("/api/challenges/1/submit", json={"answer": "RECON"})
    client.post("/api/challenges/2/submit", json={"answer": "BREACH"})

    payload1 = {
        "team_name": "Team Alpha",
        "institution": "NIT Warangal",
        "leader_name": "Leader One",
        "leader_email": "duplicate@test.com",
        "leader_phone": "9876543210",
        "team_size": 1,
        "members": [],
        "agreed_to_rules": True,
    }
    res1 = client.post("/api/registrations", json=payload1)
    assert res1.status_code == 200

    # Clear cookies to simulate fresh participant session 2
    client.cookies.clear()
    client.get("/api/session")
    client.post("/api/challenges/1/submit", json={"answer": "RECON"})
    client.post("/api/challenges/2/submit", json={"answer": "BREACH"})

    payload2 = {
        "team_name": "Team Beta",
        "institution": "NIT Warangal",
        "leader_name": "Leader Two",
        "leader_email": "duplicate@test.com",  # Duplicate email
        "leader_phone": "9998887776",
        "team_size": 1,
        "members": [],
        "agreed_to_rules": True,
    }
    res2 = client.post("/api/registrations", json=payload2)
    assert res2.status_code == 400
    assert "already been registered" in res2.json()["detail"]


def test_registration_member_count_mismatch(client):
    client.get("/api/session")
    client.post("/api/challenges/1/submit", json={"answer": "RECON"})
    client.post("/api/challenges/2/submit", json={"answer": "BREACH"})

    # Team size is 3 but only 0 members provided
    payload = {
        "team_name": "Mismatch Team",
        "institution": "NIT Warangal",
        "leader_name": "Leader One",
        "leader_email": "mismatch@test.com",
        "leader_phone": "9876543210",
        "team_size": 3,
        "members": [],
        "agreed_to_rules": True,
    }
    res = client.post("/api/registrations", json=payload)
    assert res.status_code == 422
