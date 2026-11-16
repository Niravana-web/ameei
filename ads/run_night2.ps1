# Detached runner #2 (2026-11-16): re-edit the salvaged rounds, run the salvage repairs, then continue the loop.
# Launched with: Start-Process powershell -ArgumentList '-NoProfile','-ExecutionPolicy','Bypass','-File','run_night2.ps1' -WindowStyle Hidden
$ErrorActionPreference = "Continue"
Set-Location "C:\Users\SRI\Documents\Niravana\ameei\ads"
$py = "C:\Users\SRI\miniconda3\envs\wan2gp\python.exe"
$log = "night3_stdout.txt"
"runner2 started $(Get-Date)" | Out-File $log -Encoding utf8

function OtherWgp {
    Get-CimInstance Win32_Process -Filter "Name='python.exe'" | Where-Object { $_.CommandLine -like "*wgp.py*" -or $_.CommandLine -like "*pipeline.py*" }
}
while (OtherWgp) { Start-Sleep 60 }
"GPU free $(Get-Date)" | Out-File $log -Append -Encoding utf8

# 1. clips that passed review as-is: just edit + final gate
& $py pipeline.py reedit 8 glovebox *>> $log
& $py pipeline.py reedit 9 scrubs_pocket,stroller *>> $log
& $py pipeline.py reedit 5 tailgate *>> $log
# 2. shots that need a re-render / keyframe swap, then edit + final gate
if (Test-Path "salvage_1116.json") {
    & $py pipeline.py repairs salvage_1116.json *>> $log
    Rename-Item "salvage_1116.json" "salvage_1116.done.json" -ErrorAction SilentlyContinue
}
# 3. carry on with new rounds
& $py pipeline.py loop *>> $log
"runner2 finished $(Get-Date)" | Out-File $log -Append -Encoding utf8
