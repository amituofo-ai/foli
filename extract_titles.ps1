$p1File = "playlist1.html"
$p2File = "playlist2.html"
$videoFile = "video_data.js"
$audioFile = "audio_data.js"

# 1. Generate Audio Data
$audioJson = @"
const audioData = [
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656764/20181105%E5%B8%88%E7%88%B6%E7%A0%B4%E6%96%A5%E9%82%AA%E9%81%93%E5%83%A7_hcbo0k.wav",
        title: "20181105师父破斥邪道僧"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656755/20190518%E5%BC%9F%E5%AD%90%E6%80%8E%E4%B9%88%E4%BF%AE_o94a1m.wav",
        title: "20190518弟子怎么修"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656736/20190827%E5%B8%88%E7%88%B6%E5%BC%80%E7%A4%BA%EF%BC%9A%E4%BB%80%E4%B9%88%E6%98%AF%E6%88%92%E5%BE%8B_n2d9ws.wav",
        title: "20190827师父开示：什么是戒律"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656708/20201017%E4%B8%8D%E6%B7%AB%E6%88%92%E7%9A%84%E6%88%92%E6%A0%B9%E6%88%92%E4%BD%93_x7yqau.wav",
        title: "20201017不淫戒的戒根戒体"
    },
    {
        url: "https://res.cloudinary.com/dpfa5zhse/video/upload/v1770656678/20210710%E5%B8%88%E7%88%B6%E5%BC%80%E7%A4%BA%EF%BC%9A%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%8D%E8%83%BD%E5%90%83%E8%9B%8B_z5mn6d.wav",
        title: "20210710师父开示：为什么不能吃蛋"
    }
];
"@
$audioJson | Out-File -FilePath $audioFile -Encoding UTF8

# 2. Extract Titles Function
function Get-Titles {
    param ($file, $pattern)
    if (Test-Path $file) {
        # Force UTF8 reading to fix mojibake
        $content = Get-Content $file -Raw -Encoding UTF8
        
        # Use regex to find all matches for "text":"TITLE"
        # We assume the titles we want start with the date pattern
        $matches = [regex]::Matches($content, "`"text`":`"($pattern[^`"]+)`"")
        
        $titles = @()
        foreach ($m in $matches) {
            $t = $m.Groups[1].Value
            # Filter duplicates (keeping order of first appearance)
            if ($titles -notcontains $t) {
                $titles += $t
            }
        }
        return $titles
    }
    return @()
}

# 3. Process Playlist 1 (32 videos)
$p1Titles = Get-Titles -file $p1File -pattern "20\d{2}\.\d{2}\.\d{2}"
$p1Id = 'PL1Ic3ZIKnbkVz4HlaiafZM_0k5Mr7pWdq'
$videoEntries = @()

Write-Host "Found $($p1Titles.Count) titles in Playlist 1"

for ($i = 0; $i -lt 32; $i++) {
    $t = if ($i -lt $p1Titles.Count) { $p1Titles[$i] } else { "佛陀讲堂 Video $($i+1)" }
    # Escape single quotes and backslashes for JS string
    $t = $t -replace "\\", "\\" -replace "'", "\'"
    $videoEntries += "    { playlistId: '$p1Id', index: $($i+1), title: '$t' }"
}

# 4. Process Playlist 2 (56 videos)
$p2Titles = Get-Titles -file $p2File -pattern "20\d{6}"
$p2Id = 'PLwpcy7rhx5LHaH2f8yf9me8HRyUjWvP-S'

Write-Host "Found $($p2Titles.Count) titles in Playlist 2"

for ($i = 0; $i -lt 56; $i++) {
    $t = if ($i -lt $p2Titles.Count) { $p2Titles[$i] } else { "谛深大师直播 Episode $($i+1)" }
    $t = $t -replace "\\", "\\" -replace "'", "\'"
    $videoEntries += "    { playlistId: '$p2Id', index: $($i+1), title: '$t' }"
}

# 5. Write Video Data
$jsContent = "const videoData = [`r`n" + ($videoEntries -join ",`r`n") + "`r`n];"
$jsContent | Out-File -FilePath $videoFile -Encoding UTF8

Write-Host "Done."
