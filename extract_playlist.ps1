
$p1 = Get-Content -Path "playlist1.html" -Raw
$p2 = Get-Content -Path "playlist2.html" -Raw

function Extract-Videos ($html) {
    # Regex to find playlist items
    # We look for playlistVideoRenderer block
    # It contains videoId and title
    
    # Using [regex]::Matches
    # We use a pattern that captures ID and Title
    # Note: escaped quotes in JSON are \" but in HTML usually not escaped inside the string unless it's inside a string.
    # In ytInitialData, it is a JSON object literal.
    
    $pattern = '"playlistVideoRenderer":\{"videoId":"([^"]+)".*?"title":\{"runs":\[\{"text":"([^"]+)"\}\]\}'
    $matches = [regex]::Matches($html, $pattern)
    
    foreach ($m in $matches) {
        $id = $m.Groups[1].Value
        $title = $m.Groups[2].Value
        # Decode unicode escapes if any (PowerShell might not handle \uXXXX automatically in strings?)
        # Actually standard .NET regex on string returns the string as is.
        # If the file has \uXXXX, we need to unescape.
        # But usually raw HTML has UTF-8 chars.
        
        Write-Output "$id|$title"
    }
}

Write-Host "--- Playlist 1 ---"
Extract-Videos $p1
Write-Host "--- Playlist 2 ---"
Extract-Videos $p2
