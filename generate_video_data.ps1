
$p1_titles = Get-Content "p1_clean.txt" -Encoding UTF8
$p2_titles = Get-Content "p2_clean.txt" -Encoding UTF8

$js = "const videoData = ["
$js += "`r`n    // 佛陀讲堂 (32 Videos)"

$i = 1
foreach ($t in $p1_titles) {
    $safe_t = $t.Replace("'", "\'")
    $js += "`r`n    { playlistId: 'PL1Ic3ZIKnbkVz4HlaiafZM_0k5Mr7pWdq', index: $i, title: '$safe_t' },"
    $i++
}

$js += "`r`n`r`n    // 谛深大师直播 (56 Videos)"
$i = 1
foreach ($t in $p2_titles) {
    $safe_t = $t.Replace("'", "\'")
    $js += "`r`n    { playlistId: 'PLwpcy7rhx5LHaH2f8yf9me8HRyUjWvP-S', index: $i, title: '$safe_t' },"
    $i++
}

# Fill remaining if any (User said 56)
if ($p2_titles.Count -lt 56) {
    for ($j = $p2_titles.Count + 1; $j -le 56; $j++) {
        $js += "`r`n    { playlistId: 'PLwpcy7rhx5LHaH2f8yf9me8HRyUjWvP-S', index: $j, title: '谛深大师直播 Episode $j' },"
    }
}

$js += "`r`n];"

[System.IO.File]::WriteAllText("$PWD\video_data.js", $js, [System.Text.Encoding]::UTF8)
