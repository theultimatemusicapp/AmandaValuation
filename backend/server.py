from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import math
import json
from bson import ObjectId

# Custom JSON encoder to handle MongoDB ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return json.JSONEncoder.default(self, o)

# Helper function to convert MongoDB documents to JSON-serializable format
def convert_mongo_doc(doc):
    if doc is None:
        return None
    
    # Convert ObjectId to string
    if '_id' in doc:
        doc['_id'] = str(doc['_id'])
    
    # Process nested documents
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif isinstance(value, datetime):
            doc[key] = value.isoformat()
        elif isinstance(value, dict):
            doc[key] = convert_mongo_doc(value)
        elif isinstance(value, list):
            doc[key] = [convert_mongo_doc(item) if isinstance(item, dict) else 
                        str(item) if isinstance(item, ObjectId) else item 
                        for item in value]
    
    return doc

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Valuation Models
class ValuationInput(BaseModel):
    # Step 1: Methods
    methods: List[str] = Field(description="Selected valuation methods")
    
    # Step 2: Financial Metrics
    arr: float = Field(description="Annual Recurring Revenue")
    mrr: float = Field(description="Monthly Recurring Revenue")
    ltv: float = Field(description="Customer Lifetime Value")
    cac: float = Field(description="Customer Acquisition Cost")
    gross_margin: float = Field(description="Gross Margin percentage")
    net_profit: float = Field(description="Net Profit / EBITDA")
    burn_rate: float = Field(description="Monthly Burn Rate")
    runway: float = Field(description="Runway in months")
    
    # Step 3: Growth & Churn
    revenue_growth_yoy: float = Field(description="Year over Year revenue growth")
    revenue_growth_mom: float = Field(description="Month over Month revenue growth")
    customer_churn: float = Field(description="Customer churn rate")
    revenue_churn: float = Field(description="Revenue churn rate")
    
    # Step 4: Customer & Market
    active_customers: int = Field(description="Number of active customers")
    monthly_active_users: int = Field(description="Monthly active users")
    retention_rate: float = Field(description="Customer retention rate")
    nps: float = Field(description="Net Promoter Score")
    customer_segment: str = Field(description="Customer segment")
    buyer_type: str = Field(description="Buyer type")
    
    # Step 5: Product & Technology
    product_market_fit: str = Field(description="Product-market fit level")
    proprietary_tech: str = Field(description="Proprietary technology status")
    code_quality: str = Field(description="Code quality review status")
    scalable_infrastructure: str = Field(description="Scalable infrastructure")
    feature_release_frequency: str = Field(description="Feature release frequency")
    security_compliance: str = Field(description="Security compliance")
    
    # Step 6: Team & Operations
    fte: int = Field(description="Full-time employees")
    key_staff: int = Field(description="Key staff count")
    turnover_rate: float = Field(description="Staff turnover rate")
    eng_sales_ratio: float = Field(description="Engineering to sales ratio")
    support_tickets: int = Field(description="Support tickets per month")
    support_rating: float = Field(description="Customer support rating")
    headcount_growth: float = Field(description="Headcount growth rate")
    
    # Step 7: Legal & Risk
    legal_entity: str = Field(description="Legal entity type")
    ip_ownership: str = Field(description="IP ownership status")
    contract_length: float = Field(description="Average contract length")
    contract_value: float = Field(description="Average contract value")
    vendor_lockin: str = Field(description="Vendor lock-in level")
    legal_issues: str = Field(description="Legal issues status")
    data_privacy: str = Field(description="Data privacy compliance")
    cyber_insurance: str = Field(description="Cybersecurity insurance")
    debt_level: float = Field(description="Debt level")

class ValuationResult(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    input_data: ValuationInput
    
    # Calculated Results
    valuations: List[Dict[str, Any]] = Field(description="Individual method valuations")
    average_valuation: float = Field(description="Average valuation")
    valuation_range: Dict[str, float] = Field(description="Low and high range")
    confidence_score: float = Field(description="Confidence score")
    
    # Charts Data
    charts_data: Dict[str, Any] = Field(description="Data for charts")
    
    # Insights
    insights: Dict[str, Any] = Field(description="Actionable insights")

class PaymentVerification(BaseModel):
    valuation_id: str
    payment_method: str  # "paypal" or "bypass"
    payment_data: Optional[Dict[str, Any]] = None
    bypass_code: Optional[str] = None

# Valuation calculation logic
def calculate_valuation(data: ValuationInput) -> ValuationResult:
    """Calculate comprehensive valuation using multiple methods"""
    
    # Base multiplier calculations
    base_multiplier = 5.0
    
    # Growth adjustments
    if data.revenue_growth_yoy > 30:
        base_multiplier += 2.0
    elif data.revenue_growth_yoy > 20:
        base_multiplier += 1.5
    elif data.revenue_growth_yoy > 10:
        base_multiplier += 1.0
    
    # Churn adjustments
    if data.customer_churn < 3:
        base_multiplier += 1.5
    elif data.customer_churn < 5:
        base_multiplier += 1.0
    elif data.customer_churn > 10:
        base_multiplier -= 1.0
    
    # Retention adjustments
    if data.retention_rate > 90:
        base_multiplier += 1.0
    elif data.retention_rate > 80:
        base_multiplier += 0.5
    elif data.retention_rate < 70:
        base_multiplier -= 0.5
    
    # NPS adjustments
    if data.nps > 70:
        base_multiplier += 1.0
    elif data.nps > 50:
        base_multiplier += 0.5
    elif data.nps < 0:
        base_multiplier -= 1.0
    
    # Risk adjustments
    if data.legal_issues != 'none':
        base_multiplier -= 0.5 if data.legal_issues == 'minor' else 1.5
    
    if data.ip_ownership == 'fully-owned':
        base_multiplier += 0.5
    elif data.ip_ownership == 'third-party':
        base_multiplier -= 0.5
    
    if data.debt_level > 200000:
        base_multiplier -= 0.5
    
    # Calculate individual method valuations
    valuations = []
    
    # Revenue Multiplier Method
    if 'multiplier' in data.methods:
        revenue_multiplier = base_multiplier
        # Adjust for revenue quality
        if data.gross_margin > 80:
            revenue_multiplier += 0.5
        elif data.gross_margin < 60:
            revenue_multiplier -= 0.5
        
        valuation = data.arr * revenue_multiplier
        valuations.append({
            'method': 'Revenue Multiplier',
            'value': valuation,
            'multiplier': revenue_multiplier,
            'explanation': f"ARR (${data.arr:,.0f}) × {revenue_multiplier:.1f}x multiplier"
        })
    
    # Income-Based Method
    if 'income' in data.methods:
        income_multiplier = base_multiplier - 1.0
        # Adjust for profitability
        if data.net_profit > data.arr * 0.2:  # 20% profit margin
            income_multiplier += 1.0
        elif data.net_profit < 0:
            income_multiplier -= 1.0
        
        valuation = max(0, data.net_profit * income_multiplier)
        valuations.append({
            'method': 'Income-Based',
            'value': valuation,
            'multiplier': income_multiplier,
            'explanation': f"Net Profit (${data.net_profit:,.0f}) × {income_multiplier:.1f}x multiplier"
        })
    
    # Earnings-Based Method
    if 'earnings' in data.methods:
        # Weighted combination of revenue and profit
        revenue_weight = 0.6
        profit_weight = 0.4
        
        weighted_value = (data.arr * revenue_weight) + (data.net_profit * profit_weight)
        valuation = weighted_value * base_multiplier
        
        valuations.append({
            'method': 'Earnings-Based',
            'value': valuation,
            'multiplier': base_multiplier,
            'explanation': f"Weighted ARR & Profit (${weighted_value:,.0f}) × {base_multiplier:.1f}x"
        })
    
    # DCF Method
    if 'dcf' in data.methods:
        # Simplified DCF calculation
        growth_rate = min(data.revenue_growth_yoy / 100, 0.5)  # Cap at 50%
        discount_rate = 0.12  # 12% discount rate
        
        # Project 5 years of cash flows
        cash_flows = []
        current_cf = data.net_profit
        
        for year in range(1, 6):
            projected_cf = current_cf * (1 + growth_rate) ** year
            discounted_cf = projected_cf / (1 + discount_rate) ** year
            cash_flows.append(discounted_cf)
        
        # Terminal value (10x final year cash flow)
        terminal_value = cash_flows[-1] * 10 / (1 + discount_rate) ** 5
        
        valuation = sum(cash_flows) + terminal_value
        valuations.append({
            'method': 'DCF',
            'value': max(0, valuation),
            'growth_rate': growth_rate,
            'explanation': f"5-year DCF with {growth_rate:.1%} growth and {discount_rate:.1%} discount"
        })
    
    # Calculate average and range
    if valuations:
        values = [v['value'] for v in valuations]
        average_valuation = sum(values) / len(values)
        
        # Calculate range (±10% for confidence)
        range_low = average_valuation * 0.9
        range_high = average_valuation * 1.1
        
        # Calculate confidence score
        confidence = calculate_confidence_score(data, valuations)
        
        # Generate charts data
        charts_data = generate_charts_data(data, valuations)
        
        # Generate insights
        insights = generate_insights(data, valuations, average_valuation)
        
        return ValuationResult(
            input_data=data,
            valuations=valuations,
            average_valuation=average_valuation,
            valuation_range={'low': range_low, 'high': range_high},
            confidence_score=confidence,
            charts_data=charts_data,
            insights=insights
        )
    
    raise HTTPException(status_code=400, detail="No valid valuation methods selected")

def calculate_confidence_score(data: ValuationInput, valuations: List[Dict]) -> float:
    """Calculate confidence score based on data quality and consistency"""
    score = 60  # Base confidence
    
    # Method diversity bonus
    score += len(data.methods) * 5
    
    # Data quality bonuses
    if data.revenue_growth_yoy > 0:
        score += 10
    if data.customer_churn < 10:
        score += 10
    if data.retention_rate > 70:
        score += 10
    if data.nps > 0:
        score += 5
    if data.legal_issues == 'none':
        score += 5
    
    # Consistency check
    if len(valuations) > 1:
        values = [v['value'] for v in valuations]
        avg_val = sum(values) / len(values)
        variance = sum((v - avg_val) ** 2 for v in values) / len(values)
        cv = math.sqrt(variance) / avg_val if avg_val > 0 else 1
        
        if cv < 0.3:  # Low coefficient of variation
            score += 10
        elif cv > 0.7:  # High variance
            score -= 10
    
    return min(95, max(30, score))

def generate_charts_data(data: ValuationInput, valuations: List[Dict]) -> Dict[str, Any]:
    """Generate data for charts"""
    
    return {
        'valuation_chart': {
            'labels': [v['method'] for v in valuations],
            'values': [v['value'] for v in valuations],
            'colors': ['#38b2ac', '#f6ad55', '#4299e1', '#9f7aea']
        },
        'financial_chart': {
            'labels': ['ARR', 'Net Profit', 'LTV', 'CAC'],
            'values': [data.arr, data.net_profit, data.ltv, data.cac],
            'colors': ['#38b2ac', '#f6ad55', '#4299e1', '#e53e3e']
        },
        'growth_chart': {
            'labels': ['YoY Growth', 'MoM Growth', 'Customer Churn', 'Revenue Churn'],
            'values': [data.revenue_growth_yoy, data.revenue_growth_mom, data.customer_churn, data.revenue_churn],
            'colors': ['#38b2ac', '#f6ad55', '#e53e3e', '#9f7aea']
        },
        'risk_chart': {
            'labels': ['Legal Risk', 'IP Risk', 'Financial Risk', 'Operational Risk'],
            'values': [
                3 if data.legal_issues == 'none' else 7 if data.legal_issues == 'minor' else 9,
                3 if data.ip_ownership == 'fully-owned' else 6 if data.ip_ownership == 'partial' else 9,
                3 if data.debt_level < 100000 else 6 if data.debt_level < 500000 else 9,
                3 if data.turnover_rate < 10 else 6 if data.turnover_rate < 20 else 9
            ],
            'colors': ['#e53e3e', '#f6ad55', '#38b2ac', '#9f7aea']
        }
    }

def generate_insights(data: ValuationInput, valuations: List[Dict], avg_valuation: float) -> Dict[str, Any]:
    """Generate actionable insights"""
    
    strengths = []
    improvements = []
    recommendations = []
    
    # Analyze strengths
    if data.revenue_growth_yoy > 20:
        strengths.append("Strong revenue growth indicates market demand")
    if data.customer_churn < 5:
        strengths.append("Low churn rate shows product-market fit")
    if data.retention_rate > 80:
        strengths.append("High retention rate demonstrates customer satisfaction")
    if data.nps > 50:
        strengths.append("Excellent NPS indicates strong brand advocacy")
    if data.gross_margin > 75:
        strengths.append("High gross margins show operational efficiency")
    
    # Identify improvements
    if data.customer_churn > 10:
        improvements.append("Reduce customer churn to improve valuation")
    if data.cac > data.ltv / 3:
        improvements.append("Optimize customer acquisition costs")
    if data.runway < 12:
        improvements.append("Extend runway through funding or profitability")
    if data.turnover_rate > 15:
        improvements.append("Improve team retention to reduce risks")
    
    # Generate recommendations
    if data.revenue_growth_yoy < 10:
        recommendations.append("Focus on growth initiatives to increase valuation multiple")
    if data.net_profit < 0:
        recommendations.append("Work towards profitability to improve investor appeal")
    if data.legal_issues != 'none':
        recommendations.append("Resolve legal issues to reduce risk discount")
    if data.ip_ownership != 'fully-owned':
        recommendations.append("Secure full IP ownership to eliminate risks")
    
    return {
        'strengths': strengths,
        'improvements': improvements,
        'recommendations': recommendations,
        'valuation_grade': 'A' if avg_valuation > 5000000 else 'B' if avg_valuation > 1000000 else 'C'
    }

# API Routes
@api_router.get("/")
async def root():
    return {"message": "SaaS Valuation API v1.0"}

@api_router.post("/valuations/calculate", response_model=ValuationResult)
async def calculate_valuation_endpoint(data: ValuationInput):
    """Calculate valuation and save to database"""
    try:
        result = calculate_valuation(data)
        
        # Save to database
        await db.valuations.insert_one(result.dict())
        
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.post("/valuations/verify-payment")
async def verify_payment(payment: PaymentVerification):
    """Verify payment or bypass code"""
    try:
        # Get the valuation
        valuation = await db.valuations.find_one({"id": payment.valuation_id})
        if not valuation:
            raise HTTPException(status_code=404, detail="Valuation not found")
        
        # Check bypass code
        if payment.payment_method == "bypass":
            if payment.bypass_code == "fuckpete":
                # Mark as paid
                await db.valuations.update_one(
                    {"id": payment.valuation_id},
                    {"$set": {"paid": True, "payment_method": "bypass"}}
                )
                return {"success": True, "message": "Bypass code accepted"}
            else:
                raise HTTPException(status_code=400, detail="Invalid bypass code")
        
        # For PayPal payment, we'll trust the frontend verification for now
        elif payment.payment_method == "paypal":
            await db.valuations.update_one(
                {"id": payment.valuation_id},
                {"$set": {"paid": True, "payment_method": "paypal", "payment_data": payment.payment_data}}
            )
            return {"success": True, "message": "Payment verified"}
        
        else:
            raise HTTPException(status_code=400, detail="Invalid payment method")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/valuations/{valuation_id}")
async def get_valuation(valuation_id: str):
    """Get valuation by ID"""
    valuation = await db.valuations.find_one({"id": valuation_id})
    if not valuation:
        raise HTTPException(status_code=404, detail="Valuation not found")
    
    # Convert MongoDB document to JSON-serializable format
    return convert_mongo_doc(valuation)

@api_router.get("/valuations")
async def get_valuations():
    """Get all valuations (for admin/debugging)"""
    valuations = await db.valuations.find().to_list(1000)
    # Convert MongoDB documents to JSON-serializable format
    return [convert_mongo_doc(v) for v in valuations]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()