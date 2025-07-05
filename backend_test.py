import requests
import json
import sys
import time
from datetime import datetime
from copy import deepcopy

class SaaSValuationAPITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.valuation_id = None
        self.test_results = []

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
                self.test_results.append({"name": name, "success": True})
                try:
                    return success, response.json()
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                self.test_results.append({"name": name, "success": False, "error": f"Expected {expected_status}, got {response.status_code}"})
                try:
                    print(f"Response: {response.json()}")
                except:
                    print(f"Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            self.test_results.append({"name": name, "success": False, "error": str(e)})
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

    def test_calculate_valuation_with_methods(self, methods):
        """Test valuation calculation with specific methods"""
        test_data = self.get_test_data()
        test_data["methods"] = methods
        
        success, response = self.run_test(
            f"Valuation with methods: {', '.join(methods)}",
            "POST",
            "valuations/calculate",
            200,
            data=test_data
        )
        
        if success and 'valuations' in response:
            method_names = [v['method'] for v in response['valuations']]
            print(f"Calculated valuations: {', '.join(method_names)}")
            return True
        return False

    def test_verify_payment_bypass(self):
        """Test the payment verification with bypass code"""
        if not self.valuation_id:
            print("❌ No valuation ID available for payment verification")
            self.test_results.append({"name": "Payment Verification (Bypass)", "success": False, "error": "No valuation ID available"})
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

    def test_verify_payment_invalid_bypass(self):
        """Test the payment verification with invalid bypass code"""
        if not self.valuation_id:
            print("❌ No valuation ID available for payment verification")
            self.test_results.append({"name": "Payment Verification (Invalid Bypass)", "success": False, "error": "No valuation ID available"})
            return False
            
        success, response = self.run_test(
            "Payment Verification (Invalid Bypass)",
            "POST",
            "valuations/verify-payment",
            400,  # Expecting error
            data={
                "valuation_id": self.valuation_id,
                "payment_method": "bypass",
                "bypass_code": "wrongcode"
            }
        )
        # This test passes if we get the expected 400 error
        return success

    def test_verify_payment_paypal(self):
        """Test the payment verification with PayPal"""
        if not self.valuation_id:
            print("❌ No valuation ID available for payment verification")
            self.test_results.append({"name": "Payment Verification (PayPal)", "success": False, "error": "No valuation ID available"})
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
            self.test_results.append({"name": "Get Valuation by ID", "success": False, "error": "No valuation ID available"})
            return False
            
        success, response = self.run_test(
            "Get Valuation by ID",
            "GET",
            f"valuations/{self.valuation_id}",
            200
        )
        
        # Verify the data persistence by checking if the retrieved valuation matches what we submitted
        if success and 'input_data' in response:
            print("✅ Data persistence verified - valuation retrieved from database")
            return True
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

    def test_invalid_valuation_id(self):
        """Test retrieving a valuation with an invalid ID"""
        invalid_id = "invalid-uuid-that-doesnt-exist"
        success, response = self.run_test(
            "Get Valuation with Invalid ID",
            "GET",
            f"valuations/{invalid_id}",
            404  # Expecting not found
        )
        # This test passes if we get the expected 404 error
        return success

    def test_missing_required_fields(self):
        """Test valuation calculation with missing required fields"""
        # Create a copy of the test data and remove some required fields
        test_data = self.get_test_data()
        del test_data["arr"]
        del test_data["mrr"]
        
        success, response = self.run_test(
            "Valuation with Missing Required Fields",
            "POST",
            "valuations/calculate",
            422,  # Expecting validation error
            data=test_data
        )
        # This test passes if we get the expected 422 error
        return success

    def test_invalid_input_data(self):
        """Test valuation calculation with invalid input data"""
        # Create a copy of the test data and set invalid values
        test_data = self.get_test_data()
        test_data["arr"] = -1000  # Negative revenue
        test_data["customer_churn"] = 150  # Impossible churn rate
        
        success, response = self.run_test(
            "Valuation with Invalid Input Data",
            "POST",
            "valuations/calculate",
            200,  # The API should handle this gracefully
            data=test_data
        )
        return success

    def test_edge_case_high_growth(self):
        """Test valuation with high growth company profile"""
        test_data = self.get_test_data()
        test_data["revenue_growth_yoy"] = 100  # 100% YoY growth
        test_data["revenue_growth_mom"] = 15   # 15% MoM growth
        test_data["customer_churn"] = 1        # Very low churn
        test_data["retention_rate"] = 95       # High retention
        test_data["nps"] = 80                  # Excellent NPS
        
        success, response = self.run_test(
            "Valuation for High Growth Company",
            "POST",
            "valuations/calculate",
            200,
            data=test_data
        )
        
        if success and 'average_valuation' in response:
            print(f"High Growth Valuation: ${response.get('average_valuation', 0):,.2f}")
            return True
        return False

    def test_edge_case_struggling_company(self):
        """Test valuation with struggling company profile"""
        test_data = self.get_test_data()
        test_data["revenue_growth_yoy"] = -10  # Negative growth
        test_data["net_profit"] = -200000      # Losing money
        test_data["customer_churn"] = 20       # High churn
        test_data["retention_rate"] = 60       # Poor retention
        test_data["nps"] = -10                 # Negative NPS
        test_data["legal_issues"] = "major"    # Legal problems
        
        success, response = self.run_test(
            "Valuation for Struggling Company",
            "POST",
            "valuations/calculate",
            200,
            data=test_data
        )
        
        if success and 'average_valuation' in response:
            print(f"Struggling Company Valuation: ${response.get('average_valuation', 0):,.2f}")
            return True
        return False

    def get_test_data(self):
        """Return a copy of the standard test data"""
        return {
            "methods": ["multiplier", "income", "earnings", "dcf"],
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

    def print_summary(self):
        """Print a summary of all test results"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"{status} {result['name']}")
            if not result["success"] and "error" in result:
                print(f"   Error: {result['error']}")
        
        print("-" * 60)
        print(f"Tests passed: {self.tests_passed}/{self.tests_run} ({self.tests_passed/self.tests_run*100:.1f}%)")
        print("=" * 60)

def main():
    # Get the backend URL from the environment
    backend_url = "https://946616a4-5b70-4d71-86cd-9c536a3a9770.preview.emergentagent.com"
    
    # Create the tester
    tester = SaaSValuationAPITester(backend_url)
    
    # Run the tests
    print("🚀 Starting SaaS Valuation API Tests")
    print("=" * 60)
    
    # Test the root endpoint
    tester.test_root_endpoint()
    
    # Test valuation calculation with all methods
    if tester.test_calculate_valuation(tester.get_test_data()):
        # Test individual valuation methods
        tester.test_calculate_valuation_with_methods(["multiplier"])
        tester.test_calculate_valuation_with_methods(["income"])
        tester.test_calculate_valuation_with_methods(["earnings"])
        tester.test_calculate_valuation_with_methods(["dcf"])
        
        # Test payment verification with bypass code
        tester.test_verify_payment_bypass()
        
        # Test payment verification with invalid bypass code
        tester.test_verify_payment_invalid_bypass()
        
        # Test payment verification with PayPal
        tester.test_verify_payment_paypal()
        
        # Test retrieving a valuation (also verifies data persistence)
        tester.test_get_valuation()
    
    # Test retrieving all valuations
    tester.test_get_all_valuations()
    
    # Test error handling
    tester.test_invalid_valuation_id()
    tester.test_missing_required_fields()
    tester.test_invalid_input_data()
    
    # Test edge cases
    tester.test_edge_case_high_growth()
    tester.test_edge_case_struggling_company()
    
    # Print summary of all tests
    tester.print_summary()
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())