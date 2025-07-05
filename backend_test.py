import requests
import json
import sys
from datetime import datetime

class SaaSValuationAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.valuation_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "",
            200
        )
        return success

    def test_calculate_valuation(self, test_data):
        """Test the valuation calculation endpoint"""
        success, response = self.run_test(
            "Calculate Valuation",
            "POST",
            "valuations/calculate",
            200,
            data=test_data
        )
        if success and 'id' in response:
            self.valuation_id = response['id']
            print(f"Valuation ID: {self.valuation_id}")
            print(f"Average Valuation: ${response.get('average_valuation', 0):,.2f}")
            print(f"Confidence Score: {response.get('confidence_score', 0):.2f}%")
            
            # Print individual method valuations
            if 'valuations' in response:
                print("\nValuation Methods:")
                for method in response['valuations']:
                    print(f"- {method['method']}: ${method['value']:,.2f}")
            
            return True
        return False

    def test_verify_payment_bypass(self):
        """Test the payment verification with bypass code"""
        if not self.valuation_id:
            print("❌ No valuation ID available for payment verification")
            return False
            
        success, response = self.run_test(
            "Payment Verification (Bypass)",
            "POST",
            "valuations/verify-payment",
            200,
            data={
                "valuation_id": self.valuation_id,
                "payment_method": "bypass",
                "bypass_code": "fuckpete"
            }
        )
        return success

    def test_verify_payment_paypal(self):
        """Test the payment verification with PayPal"""
        if not self.valuation_id:
            print("❌ No valuation ID available for payment verification")
            return False
            
        success, response = self.run_test(
            "Payment Verification (PayPal)",
            "POST",
            "valuations/verify-payment",
            200,
            data={
                "valuation_id": self.valuation_id,
                "payment_method": "paypal",
                "payment_data": {"transaction_id": f"test_{datetime.now().timestamp()}"}
            }
        )
        return success

    def test_get_valuation(self):
        """Test retrieving a valuation by ID"""
        if not self.valuation_id:
            print("❌ No valuation ID available to retrieve")
            return False
            
        success, response = self.run_test(
            "Get Valuation by ID",
            "GET",
            f"valuations/{self.valuation_id}",
            200
        )
        return success

    def test_get_all_valuations(self):
        """Test retrieving all valuations"""
        success, response = self.run_test(
            "Get All Valuations",
            "GET",
            "valuations",
            200
        )
        if success:
            print(f"Found {len(response)} valuations in the database")
        return success

def main():
    # Get the backend URL from the environment
    backend_url = "https://fed0faea-829b-4363-8e67-f3b524b183d8.preview.emergentagent.com"
    
    # Create the tester
    tester = SaaSValuationAPITester(backend_url)
    
    # Test data from the requirements
    test_data = {
        "methods": ["multiplier", "income"],
        "arr": 1000000,
        "mrr": 83333,
        "ltv": 5000,
        "cac": 1000,
        "gross_margin": 80,
        "net_profit": 200000,
        "burn_rate": 50000,
        "runway": 18,
        "revenue_growth_yoy": 25,
        "revenue_growth_mom": 5,
        "customer_churn": 3,
        "revenue_churn": 2,
        "active_customers": 2000,
        "monthly_active_users": 3000,
        "retention_rate": 90,
        "nps": 65,
        "customer_segment": "mid-market",
        "buyer_type": "investors",
        "product_market_fit": "strong",
        "proprietary_tech": "patents",
        "code_quality": "external-review",
        "scalable_infrastructure": "yes",
        "feature_release_frequency": "weekly",
        "security_compliance": "gdpr",
        "fte": 25,
        "key_staff": 5,
        "turnover_rate": 8,
        "eng_sales_ratio": 3,
        "support_tickets": 150,
        "support_rating": 8,
        "headcount_growth": 20,
        "legal_entity": "c-corp",
        "ip_ownership": "fully-owned",
        "contract_length": 12,
        "contract_value": 15000,
        "vendor_lockin": "moderate",
        "legal_issues": "none",
        "data_privacy": "full",
        "cyber_insurance": "yes",
        "debt_level": 100000
    }
    
    # Run the tests
    print("🚀 Starting SaaS Valuation API Tests")
    print("=" * 60)
    
    # Test the root endpoint
    tester.test_root_endpoint()
    
    # Test valuation calculation
    if tester.test_calculate_valuation(test_data):
        # Test payment verification with bypass code
        tester.test_verify_payment_bypass()
        
        # Test payment verification with PayPal
        # tester.test_verify_payment_paypal()
        
        # Test retrieving a valuation
        tester.test_get_valuation()
    
    # Test retrieving all valuations
    tester.test_get_all_valuations()
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())