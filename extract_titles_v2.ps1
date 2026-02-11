
$path = Resolve-Path "playlist_dump.html"
$bytes = [System.IO.File]::ReadAllBytes($path)
$content = [System.Text.Encoding]::UTF8.GetString($bytes)
$pattern = '"title":\{"runs":\[\{"text":"(.*?)"\}\]'
$matches = [regex]::Matches($content, $pattern)

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$titles = @()
foreach ($match in $matches) {
    $titles += $match.Groups[1].Value
}
$titles | Out-File -FilePath "titles_clean.txt" -Encoding utf8
