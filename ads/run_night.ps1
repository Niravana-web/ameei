# Detached runner: waits for any other Wan2GP job to finish, then runs the queued repair and the gated loop.
# Launched with: Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','run_night.ps1' -WindowStyle Hidden
$ErrorActionPreference = "Continue"
Set-Location "C:\Users\SRI\Documents\Niravana\ameei\ads"
$py = "C:\Users\SRI\miniconda3\envs\wan2gp\python.exe"
$log = "night2_stdout.txt"
"runner started $(Get-Date)" | Out-File $log -Encoding utf8

function OtherWgp {
    Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object { $_.CommandLine -like "*wgp.py*" }
}
while (OtherWgp) { Start-Sleep 60 }
"GPU free $(Get-Date)" | Out-File $log -Append -Encoding utf8

if (Test-Path "repairs_tailgate.json") {
    & $py pipeline.py repairs repairs_tailgate.json *>> $log
    Rename-Item "repairs_tailgate.json" "repairs_tailgate.done.json" -ErrorAction SilentlyContinue
}
& $py pipeline.py loop *>> $log
"runner finished $(Get-Date)" | Out-File $log -Append -Encoding utf8
