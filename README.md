# JMeter E-commerce Performance Testing Portfolio

Welcome to my **JMeter Performance Testing Portfolio**, a hands-on showcase of my performance testing skills using JMeter targeting the [Automation Exercise](https://automationexercise.com/) website. This project covers:

* **✅ Functional Flow Validation (Simulated real-user interactions)**
* **📈 Performance Testing (Baseline, Medium & Heavy load scenarios)**
* **🧩 Data-Driven Testing (CSV-based login using CSV Data Set Config)**
* **🔍 Debugging & Analysis (Using Debug Sampler & Chrome DevTools)**
* **⚙️ CI/CD Integration with GitHub Actions (Fully automated performance pipeline)**
---

## 🔢 Tech Stack

* **Apache JMeter 5.6.3**
* **GitHub Actions** (CI/CD)
* **CSV Data Set Config** (Data-Driven Testing)
* **Command Line Execution** (`.bat` file)
* **Chrome DevTools** (for debugging request payloads and inspecting CSRF tokens)
* **Assertions & Timers**: Response Assertion, Duration Assertion, Constant Timer
* **Components**: HTTP Request Defaults, HTTP Cookie Manager, HTTP Header Manager, Debug Sampler, RegEx Extractor

---
🔧 Project Structure

```
.
├── .github/workflows          # CI pipeline
├── assets                     # Debugging PDF
├── data                       # CSV for user login
├── screenshots                # HTML report snapshots of test results
├── test-plans                 # JMX test plan
├── .gitignore                 # Git ignore rules for build/temp files
├── run-all-tests.bat          # Local CLI execution
└── README.md                  # Documentation and usage instructions

```
---
## 📄 Test Plan Overview

The test plan is modular and simulates real-world e-commerce user behavior with increasing load levels:

### 🌎 Scenario Flow

1. Open Homepage — checks homepage load
2. Open Login Page — prepares for login
3. Login User — uses CSV credentials + CSRF token extraction via RegEx Extractor
4. View Products — loads product listing
5. Search Product — simulates product search
6. View Product — views product detail
7. Add to Cart — includes header management (Referer)
8. View Cart — verifies cart contents

### 📌 Tools & Logic Used

* **Response Assertion**: To validate HTTP responses
* **Duration Assertion**: Used to enforce SLA — ensures each request responds within of 3000 ms.
* **Constant Timer**: Adds realistic think-time between requests
* **CSV Data Set Config**: Reads test data from `users.csv`
* **RegEx Extractor**: Captures CSRF token from login page
* **HTTP Header Manager**: Used to set static headers like Referer
* **HTTP Request Defaults**: Sets base URL
* **HTTP Cookie Manager**: Maintains session across requests
* **Debug Sampler**: Verifies variables during debugging

### 🔹 Performance Loads

* **Baseline Test**: 1 user (ramp-up: 1 seconds)
* **Medium Load Test**: 10 users (ramp-up: 5 seconds)
* **Heavy Load Test**: 50 users (ramp-up: 10 seconds)

Each test uses a `Duration Assertion` to enforce SLA with a 3000 ms threshold as a practice. If any sampler exceeds this threshold, the test is marked as failed. This was key in detecting performance degradation under heavy load.

---

## 🎓 Learning and Debugging Journey

Captured in [debugging\_journey.pdf](assets/debugging_journey.pdf):

* Fixed login failures (403 errors) by identifying CSRF token in browser DevTools and extracting it dynamically
* Resolved 404s by inspecting actual endpoint formats (e.g. `/add_to_cart?quantity=1`)
* Used Debug Sampler to inspect variable values and troubleshoot sampler data
* **Inspected network activity via Developer Tools** to locate CSRF token and endpoint query structure
* **Used Chrome DevTools (Network tab → Payload)** to examine login parameters

---

## 📊 Results and Analysis

Screenshots of HTML reports of the three level tests are available in `/screenshots`:

| Load     | Pass % | Error Rate | Error Cause                        | APDEX Trend                    | Recommendation                                      |
|----------|--------|------------|------------------------------------|--------------------------------|-----------------------------------------------------|
| Baseline | 100%   | 0%         | None                               | Excellent                      | ✅ No issues, system is responsive under low load   |
| Medium   | 100%   | 0%         | None                               | Very Good                      | ✅ Sustains moderate traffic without degradation    |
| Heavy    | 99.08% | 0.92%      | Response time > 3000ms (SLA fail)  | Dropped in login/product views | ⚠️ Optimize backend performance or enable caching   |


*NOTE:-  Errors in heavy test were due to SLA violations, not functional errors
  
---


## 🚀 CI/CD Integration

Implemented via `.github/workflows/jmeter-ci-cd.yml`:

* configured a GitHub Actions workflow to automatically run JMeter performance tests at 3 levels( baseline, medium and heavy) in the cloud on every code push.
* It installs JMeter, runs different user loads, and generates performance reports as downloadable artifacts."

---

## ✅ How to Run Locally

🛠️ Prerequisites

  * Apache JMeter must be installed locally
  * JMeter bin path should be added to system environment variables (PATH)
  * clone the github repository to local

**Option 1: Run via BAT File (Windows)**

 * Double click or run this in CMD:
 * run-all-tests.bat
 * This will run all 3 tests (baseline, medium, heavy) and generate HTML reports in respective folders.

**Option 2: Run via Command Line (Windows)**

* **Baseline Test**
* jmeter -n -t test-plans/Ecommerce_TestPlan.jmx -Jusers=1 -Jrampup=1 -Jloops=1 -l results/baseline.jtl -e -o results/html-baseline

* **Medium Test**
* jmeter -n -t test-plans/Ecommerce_TestPlan.jmx -Jusers=10 -Jrampup=5 -Jloops=1 -l results/medium.jtl -e -o results/html-medium

* **Heavy Test**
* jmeter -n -t test-plans/Ecommerce_TestPlan.jmx -Jusers=50 -Jrampup=10 -Jloops=1 -l results/heavy.jtl -e -o results/html-heavy

---

## 🚀 Future Enhancements

* Add backend API performance tests
* Integrate with BlazeMeter
* Add threshold-based Slack alerting
* I used 2 login credentials in my CSV, and JMeter reuses them across threads to simulate load. For login performance simulation, uniqueness was not necessary. But I can easily scale it with unique test data if required in future

---

## 📅 Author

Reshma Sajeev| ISTQB Certified Tester| Manual & Automation | 🔗 https://www.linkedin.com/in/reshma-sajeev-889b7215b/
* ⭐ This repository is part of my personal QA portfolio to demonstrate hands-on experience on Jmeter in performance testing, CI/CD integration, API/data-driven testing, and debugging techniques.

---

> Star this repo if it helped you learn something new! ⭐
