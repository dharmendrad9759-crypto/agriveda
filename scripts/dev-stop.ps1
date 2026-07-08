# Stop Next.js dev server on port 3000 (Windows)
$conns = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if (-not $conns) {
  Write-Host "No process listening on port 3000." -ForegroundColor Yellow
  exit 0
}

$pids = $conns.OwningProcess | Sort-Object -Unique
foreach ($procId in $pids) {
  try {
    Stop-Process -Id $procId -Force -ErrorAction Stop
    Write-Host "Stopped PID $procId (port 3000)" -ForegroundColor Green
  } catch {
    Write-Host "Could not stop PID $procId - try Task Manager" -ForegroundColor Red
  }
}
