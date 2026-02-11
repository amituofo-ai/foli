
$p1 = Get-Content "playlist1.html" -Raw
$pattern = '"text":"(20\d\d\.\d\d\.\d\d[^"]+)"'
$matches = [regex]::Matches($p1, $pattern)
$matches | ForEach-Object { $_.Groups[1].Value } | Out-File "p1_dates.txt" -Encoding UTF8

$p2 = Get-Content "playlist2.html" -Raw
$pattern2 = '"text":"(20\d{6}[^"]+)"'
$matches2 = [regex]::Matches($p2, $pattern2)
$matches2 | ForEach-Object { $_.Groups[1].Value } | Out-File "p2_dates.txt" -Encoding UTF8
