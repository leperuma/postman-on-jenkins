import pytest
from playwright.sync_api import sync_playwright

# --- AutomationTest.postman_collection.json ---
def test_automation_collection():
    proceed_to_bing = False
    with sync_playwright() as p:
        request_context = p.request.new_context()
        # Call Googly
        res = request_context.get('https://www.google.com/search?q=Cisco+Bangalore')
        body = res.text()
        if 'click' in body:
            proceed_to_bing = True
            print('click found in Google results.')
        else:
            print('click not found in Google results.')
        assert 'click' in body

        # Call Bingy
        if not proceed_to_bing:
            pytest.skip('Skipping Bing request because the condition was not met.')
        res = request_context.get('https://www.bing.com/search?q=Cisco+Bangalore')
        body = res.text()
        if 'bing' in body:
            print('bing found in Bing results.')
        else:
            print('bing not found in Bing results.')
        assert 'bing' in body
        request_context.dispose()

# --- IntegrationTestingBasics.postman_collection.json ---
def test_integration_testing_basics():
    base_url = 'https://postman-integration-testing.glitch.me'
    token = ''
    with sync_playwright() as p:
        request_context = p.request.new_context()
        # Register
        res = request_context.post(f'{base_url}/register')
        assert res.ok
        json_data = res.json()
        assert 'token' in json_data
        assert isinstance(json_data['token'], str)
        token = json_data['token']

        # Get name
        res = request_context.get(f'{base_url}/my-name?token={token}')
        assert res.ok
        json_data = res.json()
        assert 'name' in json_data
        assert isinstance(json_data['name'], str)

        # Unregister
        res = request_context.post(f'{base_url}/unregister', data={"token": token})
        assert res.status == 200
        request_context.dispose()
