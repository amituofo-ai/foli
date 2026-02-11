
$titles = Get-Content "titles_clean.txt" -Encoding UTF8
$validTitles = @()
$seen = @{}

foreach ($t in $titles) {
    if ($t.Length -gt 10 -and $t -notmatch "Description" -and $t -notmatch "Keyboard shortcuts" -and $t -notmatch "Playback" -and $t -notmatch "General" -and $t -notmatch "Subtitles" -and $t -notmatch "Spherical Videos" -and $t -notmatch "Subscribe") {
        if (-not $seen.ContainsKey($t)) {
            $validTitles += $t
            $seen[$t] = $true
        }
    }
}

$startIdx = 32
$playlistId = "PLwpcy7rhx5LHaH2f8yf9me8HRyUjWvP-S"
$output = @()

for ($i = 0; $i -lt $validTitles.Count; $i++) {
    $idx = $startIdx + $i
    # Escape single quotes and backslashes if needed
    $title = $validTitles[$i] -replace "\\", "\\" -replace "'", "\'"
    $output += "    { playlistId: '$playlistId', index: $($i+1), title: '$title' },"
}

$output | Out-File "video_snippet.js" -Encoding utf8
