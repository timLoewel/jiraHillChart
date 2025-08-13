import re
from playwright.sync_api import Page, expect, sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for all console events and print them
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

    username = "testuser"
    password = "password123" # The hash is for 'password123'

    try:
        # Mock the Jira API search endpoint
        page.route('**/api/jira/search?term=foo', lambda route: route.fulfill(
            status=200,
            contentType='application/json',
            body='[{"id": "PROJ-123", "title": "Fix the search bar"}]'
        ))

        page.goto("http://localhost:5173/")
        page.wait_for_load_state("networkidle")

        page.get_by_label("Username").click()
        page.get_by_label("Username").fill(username)
        page.get_by_label("Password").click()
        page.get_by_label("Password").fill(password)
        page.get_by_role("button", name="Login").click()

        expect(page).to_have_url("http://localhost:5173/welcome")

        page.get_by_label("Jira API Key").click()
        page.get_by_label("Jira API Key").fill("fake-key")
        page.get_by_role("button", name="Save").click()

        page.get_by_placeholder("Search Jira...").click()
        page.get_by_placeholder("Search Jira...").fill("foo")
        page.get_by_placeholder("Search Jira...").press("Enter")

        expect(page.get_by_text("PROJ-123")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/search_results.png")

        page.get_by_role("button", name="PROJ-123 Fix the search bar").click()

        expect(page.get_by_role("heading", name="Fix the search bar")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/ticket_details.png")

    except Exception as e:
        page.screenshot(path="jules-scratch/verification/error.png")
        print(e)


    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
