# Detached runner #3 (2026-11-16 10:xx): resume the salvage repairs that died in the 05:11 reboot, then continue the loop.
# Launched with: Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','run_night3.ps1' -WindowStyle Hidden
$ErrorActionPreference = "Continue"
Set-Location "C:\Users\SRI\Documents\Niravana\ameei\ads"
$py = "C:\Users\SRI\miniconda3\envs\wan2gp\python.exe"
$log = "night4_stdout.txt"
"runner3 started $(Get-Date)" | Out-File $log -Encoding utf8

function OtherWgp {
    Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object { $_.CommandLine -like "*wgp.py*" -or $_.CommandLine -like "*pipeline.py*" }
}
while (OtherWgp) { Start-Sleep 60 }
"GPU free $(Get-Date)" | Out-File $log -Append -Encoding utf8

if (Test-Path "salvage_1116.json") {
    $env:AMEEI_RESUME = "1"
    & $py pipeline.py repairs salvage_1116.json fix_1116_0031 940000 *>> $log
    Remove-Item Env:AMEEI_RESUME
    Rename-Item "salvage_1116.json" "salvage_1116.done.json" -ErrorAction SilentlyContinue
}
& $py pipeline.py loop *>> $log
"runner3 finished $(Get-Date)" | Out-File $log -Append -Encoding utf8
