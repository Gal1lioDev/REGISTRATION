def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "DEFCON" in data["service"]


def test_session_initialization_and_cookie(client):
    response = client.get("/api/session")
    assert response.status_code == 200
    data = response.json()
    assert "session_token" in data
    assert data["challenge_1_completed"] is False
    assert data["challenge_2_completed"] is False
    assert data["completed_count"] == 0
    assert data["is_eligible"] is False
    assert data["event_info"]["venue"] == "NIT Warangal"

    # Verify cookie was set
    assert "defcon_session" in response.cookies


def test_session_persistence_with_cookie(client):
    # First call sets cookie
    res1 = client.get("/api/session")
    token1 = res1.json()["session_token"]
    cookie_val = res1.cookies["defcon_session"]

    # Second call passes cookie
    res2 = client.get("/api/session", cookies={"defcon_session": cookie_val})
    token2 = res2.json()["session_token"]

    assert token1 == token2
