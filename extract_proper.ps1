
$enc = [System.Text.Encoding]::UTF8
$p1 = [System.IO.File]::ReadAllText("$PWD\playlist1.html", $enc)
$pattern = '"text":"(20\d\d\.\d\d\.\d\d[^"]+)"'
$matches = [regex]::Matches($p1, $pattern)
$matches | ForEach-Object { $_.Groups[1].Value } | Out-File "p1_clean.txt" -Encoding UTF8

$p2 = [System.IO.File]::ReadAllText("$PWD\playlist2.html", $enc)
$pattern2 = '"text":"(20\d{6}[^"]+)"'
$matches2 = [regex]::Matches($p2, $pattern2)
$matches2 | ForEach-Object { $_.Groups[1].Value } | Out-File "p2_clean.txt" -Encoding UTF8
