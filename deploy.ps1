param(
    [string]$Message = "Web sitesi guncellemesi: $(Get-Date -Format 'dd.MM.yyyy HH:mm')"
)

Write-Host "==========================================" -ForegroundColor Green
Write-Host "   CANIKOGLU INSAAT - OTOMATIK DEPLOY" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

Write-Host "`n[1/3] Git degisiklikleri hazirlaniyor..." -ForegroundColor Cyan
git add .
$status = git status --porcelain
if ($status) {
    git commit -m $Message
    Write-Host "Commit olusturuldu: $Message" -ForegroundColor Green
} else {
    Write-Host "Yeni degisiklik yok, mevcut surum push ediliyor." -ForegroundColor Yellow
}

Write-Host "`n[2/3] GitHub reposuna push ediliyor..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "GitHub push islemi basarili!" -ForegroundColor Green
} else {
    Write-Host "GitHub push sirasinda bir uyari olustu." -ForegroundColor Yellow
}

Write-Host "`n[3/3] Vercel Production Deploy tetikleniyor..." -ForegroundColor Cyan
vercel --prod --yes

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "   TUM ISLEMLER BASARIYLA TAMAMLANDI!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
