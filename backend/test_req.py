import urllib.request
import json

base_url = "http://127.0.0.1:8000"

def make_request(url, method="GET", data=None):
    req = urllib.request.Request(url, method=method)
    if data:
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(data).encode('utf-8')
    try:
        with urllib.request.urlopen(req, data=data) as response:
            print(response.status, response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"HTTPError: {e.code} {e.read().decode('utf-8')}")
    except Exception as e:
        print(f"Error: {e}")

def test_endpoints():
    print("Testing /products")
    make_request(f"{base_url}/products")

    print("\nTesting /chat")
    make_request(f"{base_url}/chat", method="POST", data={"message": "material"})

    print("\nTesting /contact-submit")
    make_request(f"{base_url}/contact-submit", method="POST", data={
        "name": "Test", "email": "test@test.com", "subject": "Test", "message": "Test"
    })

    print("\nTesting /process-payment")
    make_request(f"{base_url}/process-payment", method="POST", data={
        "cart": [{"id": 1, "quantity": 1}], "totalAmount": 1250.00
    })

if __name__ == "__main__":
    test_endpoints()
