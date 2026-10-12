def test_admin_endpoints_require_authentication(client):
    res = client.get("/api/admin/registrations")
    assert res.status_code == 401

    res_export = client.get("/api/admin/registrations/export")
    assert res_export.status_code == 401


def test_admin_login_and_access(client):
    # Bad credentials
    bad_login = client.post("/api/admin/login", json={"username": "wrong", "password": "wrong"})
    assert bad_login.status_code == 401

    # Good credentials
    good_login = client.post(
        "/api/admin/login",
        json={"username": "testadmin", "password": "testpassword123"},
    )
    assert good_login.status_code == 200
    assert "token" in good_login.json()
    assert "defcon_admin_token" in good_login.cookies

    # Now registrations endpoint succeeds
    res = client.get("/api/admin/registrations")
    assert res.status_code == 200
    data = res.json()
    assert "items" in data
    assert "stats" in data


def test_admin_search_and_export_csv(client):
    # 1. Create a registration first
    client.get("/api/session")
    client.post("/api/challenges/1/submit", json={"answer": "RECON"})
    client.post("/api/challenges/2/submit", json={"answer": "BREACH"})

    reg_payload = {
        "team_name": "AdminSearchTeam",
        "institution": "NIT Warangal",
        "leader_name": "Sec Leader",
        "leader_email": "adminsearch@test.com",
        "leader_phone": "9876543210",
        "team_size": 2,
        "members": ["Sec Member"],
        "agreed_to_rules": True,
    }
    client.post("/api/registrations", json=reg_payload)

    # 2. Login as admin
    client.post(
        "/api/admin/login",
        json={"username": "testadmin", "password": "testpassword123"},
    )

    # 3. Test search query
    res_search = client.get("/api/admin/registrations?q=AdminSearchTeam")
    assert res_search.status_code == 200
    items = res_search.json()["items"]
    assert len(items) == 1
    assert items[0]["team_name"] == "AdminSearchTeam"

    # Search non-existent
    res_empty = client.get("/api/admin/registrations?q=NonExistentTeamName123")
    assert len(res_empty.json()["items"]) == 0

    # 4. Test CSV export
    res_csv = client.get("/api/admin/registrations/export")
    assert res_csv.status_code == 200
    assert res_csv.headers["content-type"].startswith("text/csv")
    csv_text = res_csv.text
    assert "Registration Code" in csv_text
    assert "AdminSearchTeam" in csv_text
    assert "adminsearch@test.com" in csv_text
