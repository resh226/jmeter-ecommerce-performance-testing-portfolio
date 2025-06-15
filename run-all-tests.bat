@echo off
REM ===============================
REM JMeter CLI Performance Tests
REM Project: Ecommerce Performance Test
REM Author: Reshma
REM ===============================

echo Cleaning old results...
rmdir /s /q results\html-baseline
rmdir /s /q results\html-medium
rmdir /s /q results\html-heavy
del results\*.jtl

REM --- Baseline Load Test ---
echo Running Baseline Load Test (1 user)...
call jmeter -n -t "test-plans\Ecommerce_TestPlan.jmx" -Jusers=1 -Jrampup=1 -Jloops=1 -l "results\baseline.jtl" -e -o "results\html-baseline"
echo Baseline Test Completed.

REM --- Medium Load Test ---
echo Running Medium Load Test (10 users)...
call jmeter -n -t "test-plans\Ecommerce_TestPlan.jmx" -Jusers=10 -Jrampup=5 -Jloops=1 -l "results\medium.jtl" -e -o "results\html-medium"
echo Medium Test Completed.

REM --- Heavy Load Test ---
echo Running Heavy Load Test (50 users)...
call jmeter -n -t "test-plans\Ecommerce_TestPlan.jmx" -Jusers=50 -Jrampup=10 -Jloops=1 -l "results\heavy.jtl" -e -o "results\html-heavy"
echo Heavy Test Completed.

echo All tests completed successfully.
pause
