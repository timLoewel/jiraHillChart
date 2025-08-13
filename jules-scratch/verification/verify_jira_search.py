import re
from playwright.sync_api import Page, expect, sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Listen for all console events and print them
    page.on("console", lambda msg: print(f"Browser console: {msg.text}"))

    username = "testuser_verif"
    password = "password123"

    try:
        page.goto("http://localhost:5173/")
        page.wait_for_load_state("networkidle")

        page.get_by_label("Username").click()
        page.get_by_label("Username").fill(username)
        page.get_by_label("Password").click()
        page.get_by_label("Password").fill(password)
        page.get_by_role("button", name="Register").click()

        time.sleep(2) # wait for the action to complete

        # I will check the database manually after this script runs

    except Exception as e:
        page.screenshot(path="jules-scratch/verification/error.png")
        print(e)


    context.close()
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
