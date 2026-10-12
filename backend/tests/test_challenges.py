def test_list_challenges(client):
    response = client.get("/api/challenges")
    assert response.status_code == 200
    data = response.json()
    assert data["total_challenges"] == 2
    assert len(data["challenges"]) == 2

    c1 = data["challenges"][0]
    assert c1["id"] == 1
    assert c1["title"] == "Recon"
    # Verify answers are never leaked in challenge info
    assert "answer" not in c1
    assert "RECON" not in c1["description"]

    c2 = data["challenges"][1]
    assert c2["id"] == 2
    assert c2["title"] == "Decode"
    assert "BREACH" not in c2["description"]


def test_challenge_1_submission(client):
    # Initialize session
    client.get("/api/session")

    # Incorrect answer
    res_wrong = client.post("/api/challenges/1/submit", json={"answer": "WRONG_ANSWER"})
    assert res_wrong.status_code == 200
    data_wrong = res_wrong.json()
    assert data_wrong["success"] is False
    assert data_wrong["completed_count"] == 0

    # Correct answer with lowercase and spaces
    res_right = client.post("/api/challenges/1/submit", json={"answer": "  recon  "})
    assert res_right.status_code == 200
    data_right = res_right.json()
    assert data_right["success"] is True
    assert data_right["completed_count"] == 1
    assert data_right["is_unlocked"] is False


def test_challenge_2_submission(client):
    client.get("/api/session")

    # Incorrect answer
    res_wrong = client.post("/api/challenges/2/submit", json={"answer": "WRONG"})
    assert res_wrong.status_code == 200
    assert res_wrong.json()["success"] is False

    # Correct answer
    res_right = client.post("/api/challenges/2/submit", json={"answer": "BREACH"})
    assert res_right.status_code == 200
    assert res_right.json()["success"] is True
    assert res_right.json()["completed_count"] == 1


def test_both_challenges_unlock_registration(client):
    client.get("/api/session")

    res1 = client.post("/api/challenges/1/submit", json={"answer": "RECON"})
    assert res1.json()["is_unlocked"] is False

    res2 = client.post("/api/challenges/2/submit", json={"answer": "BREACH"})
    assert res2.json()["is_unlocked"] is True
    assert res2.json()["completed_count"] == 2

    # Check progress endpoint
    prog = client.get("/api/progress")
    assert prog.json()["is_unlocked"] is True
    assert prog.json()["completed_count"] == 2


def test_rate_limiting_failed_attempts(client):
    client.get("/api/session")

    # 5 wrong answers
    for i in range(5):
        res = client.post("/api/challenges/1/submit", json={"answer": f"wrong_{i}"})
        assert res.status_code == 200
        assert res.json()["success"] is False

    # 6th attempt should be rate limited (HTTP 429)
    res_limited = client.post("/api/challenges/1/submit", json={"answer": "another_wrong"})
    assert res_limited.status_code == 429
    assert "Rate limit exceeded" in res_limited.json()["detail"]
