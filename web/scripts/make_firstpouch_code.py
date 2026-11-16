"""Create the FIRSTPOUCH launch offer in Stripe (run once per mode).

Usage (PowerShell or Git Bash, from web/):
    python scripts/make_firstpouch_code.py
It uses $STRIPE_SECRET_KEY if set, otherwise asks for the key without echoing it; nothing is written to disk.
Creates coupon `firstpouch15` (15% off, once) and promotion code FIRSTPOUCH
(first-time customers only). Safe to re-run: existing objects are reported, not duplicated.
"""
import getpass, json, os, sys, urllib.parse, urllib.request, base64

key = os.environ.get("STRIPE_SECRET_KEY") or getpass.getpass("Stripe secret key (sk_live_... or sk_test_...): ")
key = key.strip()
if not key.startswith("sk_"):
    sys.exit("That does not look like a Stripe secret key.")
mode = "LIVE" if key.startswith("sk_live_") else "TEST"
auth = base64.b64encode(f"{key}:".encode()).decode()

def call(method, path, data=None):
    body = urllib.parse.urlencode(data).encode() if data else None
    req = urllib.request.Request("https://api.stripe.com/v1" + path, data=body, method=method,
                                 headers={"Authorization": "Basic " + auth})
    try:
        with urllib.request.urlopen(req) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        return json.load(e)

print(f"Mode: {mode}")
c = call("GET", "/coupons/firstpouch15")
if c.get("object") == "coupon":
    print("coupon firstpouch15 already exists:", c["percent_off"], "% off,", c["duration"])
else:
    c = call("POST", "/coupons", {"id": "firstpouch15", "name": "First pouch 15 off",
                                  "percent_off": "15", "duration": "once",
                                  "metadata[campaign]": "launch_2026_11"})
    print("coupon:", c.get("id") or c)

p = call("GET", "/promotion_codes?code=FIRSTPOUCH&limit=1")
if p.get("data"):
    print("promotion code FIRSTPOUCH already exists, active =", p["data"][0]["active"])
else:
    p = call("POST", "/promotion_codes", {"promotion[type]": "coupon", "promotion[coupon]": "firstpouch15",
                                          "code": "FIRSTPOUCH", "restrictions[first_time_transaction]": "true"})
    print("promotion code:", p.get("code") or p)
print("Done.")
