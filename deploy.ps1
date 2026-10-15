# CANİKOĞLU & TOPÇU MİMARLIK — Tek Tık Otomatik Dağıtım Scripti
# Değişiklikleri GitHub'a push eder ve Vercel otomatik canlıya alır.

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " CANİKOĞLU & TOPÇU MİMARLIK — Otomatik Yayınlama Sistemi  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$commitMsg = "feat: Ekşioğlu Life birebir lüks mimari tasarımı, B3 kentsel dönüşüm hesaplayıcı ve projeler yayında"
if ($args.Count -gt 0) {
    $commitMsg = $args[0]
}

Write-Host "`n[1/3] Git değişiklikleri taranıyor ve ekleniyor..." -ForegroundColor Yellow
git add -A

Write-Host "`n[2/3] Commit oluşturuluyor: '$commitMsg'..." -ForegroundColor Yellow
git commit -m "$commitMsg"

Write-Host "`n[3/3] GitHub'a gönderiliyor (Vercel otomatik derleme tetiklenecek)..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBAŞARILI! Kodlar GitHub'a gönderildi." -ForegroundColor Green
    Write-Host "Vercel otomatik olarak canlı yayını güncelledi." -ForegroundColor Green
    Write-Host "Canlı Site URL: https://kentsel-theta.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "`nHata oluştu! Lütfen internet veya git bağlantınızı kontrol edin." -ForegroundColor Red
}
