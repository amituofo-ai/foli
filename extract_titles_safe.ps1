
$p1 = Get-Content "playlist1.html" -Raw -Encoding UTF8
$pattern = '"title":\{"runs":\[\{"text":"(?<title>[^"]+)"\}\]\}'
$matches = [regex]::Matches($p1, $pattern)
$lines = @()
foreach ($m in $matches) {
    $lines += $m.Groups['title'].Value
}
$lines | Set-Content "p1_titles.txt" -Encoding UTF8

$p2 = Get-Content "playlist2.html" -Raw -Encoding UTF8
$matches2 = [regex]::Matches($p2, $pattern)
$lines2 = @()
foreach ($m in $matches2) {
    $lines2 += $m.Groups['title'].Value
}
$lines2 | Set-Content "p2_titles.txt" -Encoding UTF8
