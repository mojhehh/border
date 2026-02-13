# yt-to-webm.ps1 — Download YouTube video and convert to WebM VP9
# Usage: .\yt-to-webm.ps1 "https://youtube.com/watch?v=..." "output-name"
# Optional: .\yt-to-webm.ps1 "URL" "name" -Start "0:30" -End "0:35"

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$Url,
    
    [Parameter(Mandatory=$true, Position=1)]
    [string]$OutputName,
    
    [string]$Start = "",   # Trim start time, e.g. "1:23" or "0:05.5"
    [string]$End = "",     # Trim end time
    [int]$Quality = 30     # VP9 CRF (lower = better, 20-35 good range)
)

$ErrorActionPreference = "Stop"
$outDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$tempFile = Join-Path $outDir "_temp_download.mp4"
$outFile = Join-Path $outDir "$OutputName.webm"

Write-Host "=== YouTube to WebM (VP9) Converter ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Download best quality
Write-Host "[1/2] Downloading video..." -ForegroundColor Yellow
$ytArgs = @($Url, "-f", "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best", "-o", $tempFile, "--no-playlist", "--force-overwrites")
& yt-dlp @ytArgs
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Download failed!" -ForegroundColor Red; exit 1 }

# Step 2: Convert to WebM VP9
Write-Host "[2/2] Converting to WebM VP9..." -ForegroundColor Yellow
$ffArgs = @("-i", $tempFile, "-y")

# Trim if specified
if ($Start) { $ffArgs += @("-ss", $Start) }
if ($End)   { $ffArgs += @("-to", $End) }

# VP9 encoding settings - good quality, reasonable size
$ffArgs += @(
    "-c:v", "libvpx-vp9",
    "-crf", "$Quality",
    "-b:v", "0",           # Let CRF control quality
    "-deadline", "good",
    "-cpu-used", "2",
    "-row-mt", "1",        # Multi-threaded
    "-c:a", "libopus",     # Opus audio (best for WebM)
    "-b:a", "128k",
    "-an",                 # No audio (for game boss attacks, usually no audio needed)
    $outFile
)

& ffmpeg @ffArgs
if ($LASTEXITCODE -ne 0) { Write-Host "ERROR: Conversion failed!" -ForegroundColor Red; exit 1 }

# Cleanup temp
Remove-Item $tempFile -ErrorAction SilentlyContinue

$size = (Get-Item $outFile).Length / 1MB
Write-Host ""
Write-Host "Done! Output: $outFile ($([math]::Round($size, 2)) MB)" -ForegroundColor Green
Write-Host ""
Write-Host "Usage examples:" -ForegroundColor Cyan
Write-Host "  Full video:   .\yt-to-webm.ps1 'URL' 'flowey-idle'"
Write-Host "  Clip 5s-10s:  .\yt-to-webm.ps1 'URL' 'flowey-laser' -Start '0:05' -End '0:10'"
Write-Host "  Better qual:  .\yt-to-webm.ps1 'URL' 'flowey-attack1' -Quality 22"
