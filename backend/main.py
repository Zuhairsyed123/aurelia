import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List

app = FastAPI(title="AURELIA API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Models ---
class CartItem(BaseModel):
    id: int
    quantity: int

class PaymentRequest(BaseModel):
    cart: List[CartItem]
    totalAmount: float
    # Other potential fields: paymentMethodId, billingAddress, etc.

class ChatMessage(BaseModel):
    message: str

class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# --- Endpoints ---

@app.get("/products")
async def get_products():
    return [
        {
            "id": 1,
            "name": "Obsidian Wool Overcoat",
            "price": 1250.00,
            "imageURL": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        
        {
            "id": 3,
            "name": "Cashmere Turtleneck",
            "price": 950.00,
            "imageURL": "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        },
        {
            "id": 4,
            "name": "Structured Leather Tote",
            "price": 2100.00,
            "imageURL": "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
        }
    ]

@app.post("/process-payment")
async def process_payment(request: PaymentRequest):
    # Simulate a 2-second payment processing delay
    await asyncio.sleep(2)
    return {"status": "success", "message": "Payment Successful. Thank you for your purchase."}

@app.post("/chat")
async def chat_interaction(request: ChatMessage):
    user_message = request.message.lower()
    
    # Simple keyword matching logic for AI Concierge
    if "material" in user_message or "fabric" in user_message:
        response = "Our garments are crafted from the finest Italian silk and hand-sourced cashmere, ensuring unparalleled luxury and comfort."
    elif "shipping" in user_message or "delivery" in user_message:
        response = "We offer complimentary express shipping worldwide on all orders. Your Aurelia pieces will arrive in pristine condition."
    elif "return" in user_message or "exchange" in user_message:
        response = "We gladly accept returns and exchanges within 30 days of purchase. Please ensure the items are unworn and retain their original tags."
    else:
        response = "Welcome to Aurelia. How may I assist you with your wardrobe selections today?"
        
    return {"response": response}

@app.post("/contact-submit")
async def contact_submit(form_data: ContactForm):
    # In a real application, this would send an email or save to a database.
    return {"status": "success", "message": "Thank you for reaching out. An Aurelia representative will contact you shortly."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
