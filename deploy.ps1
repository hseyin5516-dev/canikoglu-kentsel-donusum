# CANİKOĞLU & TOPÇU MİMARLIK — Tek Tık Otomatik Dağıtım Scripti
# Değişiklikleri hem GitHub'a hem de Vercel Production'a anında aktarır.

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " CANİKOĞLU & TOPÇU MİMARLIK — Otomatik Yayınlama Sistemi  " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$commitMsg = "feat: Web sitesi güncellemesi"
if ($args.Count -gt 0) {
    $commitMsg = $args[0]
}

Write-Host "`n[1/4] Git değişiklikleri ekleniyor..." -ForegroundColor Yellow
git add -A

Write-Host "`n[2/4] Commit oluşturuluyor: '$commitMsg'..." -ForegroundColor Yellow
git commit -m "$commitMsg"

Write-Host "`n[3/4] GitHub reposuna push ediliyor..." -ForegroundColor Yellow
git push origin main

Write-Host "`n[4/4] Vercel Production canlı yayını güncelleniyor..." -ForegroundColor Yellow
vercel --prod --yes

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nBAŞARILI! Tüm sayfalar ve içerikler canlıya alındı." -ForegroundColor Green
    Write-Host "Canlı URL: https://kentsel-theta.vercel.app" -ForegroundColor Cyan
} else {
    Write-Host "`nDağıtım sırasında bir uyarı oluştu. Lütfen bağlantınızı kontrol edin." -ForegroundColor Red
}
