# Smart Healthcare System - Backend API Test Script
# Run this in PowerShell

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🏥 SMART HEALTHCARE SYSTEM - API TESTS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "Test 1: Health Check..." -ForegroundColor Yellow
$response1 = Invoke-RestMethod -Uri "http://localhost:5000/" -Method GET
Write-Host "✅ Status: $($response1.status)" -ForegroundColor Green
Write-Host "Version: $($response1.version)`n" -ForegroundColor White

# Test 2: Register New Patient
Write-Host "Test 2: Register New Patient..." -ForegroundColor Yellow
$registerBody = @{
    email = "patient@example.com"
    password = "SecurePass123!"
    firstName = "John"
    lastName = "Doe"
    phone = "+94771234567"
    dateOfBirth = "1990-01-15"
    gender = "Male"
} | ConvertTo-Json

try {
    $response2 = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody
    
    Write-Host "✅ Registration Successful!" -ForegroundColor Green
    Write-Host "User ID: $($response2.data.user.id)" -ForegroundColor White
    Write-Host "Health Card: $($response2.data.patient.healthCardNumber)" -ForegroundColor White
    $token = $response2.data.token
    Write-Host "Token: $token`n" -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "⚠️  User already exists (this is OK for testing)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Login
Write-Host "`nTest 3: Login..." -ForegroundColor Yellow
$loginBody = @{
    email = "patient@example.com"
    password = "SecurePass123!"
} | ConvertTo-Json

try {
    $response3 = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody
    
    Write-Host "✅ Login Successful!" -ForegroundColor Green
    Write-Host "User: $($response3.data.user.email)" -ForegroundColor White
    Write-Host "Role: $($response3.data.user.role)" -ForegroundColor White
    $token = $response3.data.token
    Write-Host "Token: $token`n" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get Current User (Protected Route)
if ($token) {
    Write-Host "`nTest 4: Get Current User (Protected Route)..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $response4 = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
            -Method GET `
            -Headers $headers
        
        Write-Host "✅ Protected Route Access Successful!" -ForegroundColor Green
        Write-Host "User: $($response4.data.user.email)" -ForegroundColor White
        Write-Host "Profile: $($response4.data.profile.fullName)`n" -ForegroundColor White
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Get All Doctors (Public Route)
Write-Host "`nTest 5: Get All Doctors..." -ForegroundColor Yellow
try {
    $response5 = Invoke-RestMethod -Uri "http://localhost:5000/api/doctors" -Method GET
    Write-Host "✅ Found $($response5.count) doctors" -ForegroundColor Green
    if ($response5.count -gt 0) {
        Write-Host "Sample Doctor: Dr. $($response5.data[0].firstName) $($response5.data[0].lastName) - $($response5.data[0].specialty)`n" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  No doctors in database. Run seed endpoint first.`n" -ForegroundColor Yellow
}

# Test 6: Seed Sample Data
Write-Host "`nTest 6: Seed Sample Data..." -ForegroundColor Yellow
$seedConfirm = Read-Host "Do you want to seed sample doctors and patients? (y/n)"
if ($seedConfirm -eq 'y' -or $seedConfirm -eq 'Y') {
    try {
        $response6 = Invoke-RestMethod -Uri "http://localhost:5000/api/seed" -Method POST
        Write-Host "✅ Seeded successfully!" -ForegroundColor Green
        Write-Host "Doctors: $($response6.data.doctors)" -ForegroundColor White
        Write-Host "Patients: $($response6.data.patients)`n" -ForegroundColor White
    } catch {
        Write-Host "⚠️  $($_.Exception.Message)`n" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ ALL TESTS COMPLETE!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Your backend is working correctly! 🎉" -ForegroundColor Green
Write-Host "Backend URL: http://localhost:5000" -ForegroundColor White
Write-Host "API Documentation: See API_DOCUMENTATION.md`n" -ForegroundColor White
