
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

Write-Output "Count: $($validTitles.Count)"
