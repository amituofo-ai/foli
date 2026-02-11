﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿
Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-DocxText {
    param ($path)
    try {
        $tempPath = [System.IO.Path]::GetTempFileName()
        [System.IO.File]::Copy($path, $tempPath, $true)
        $zipPath = $tempPath + ".zip"
        Rename-Item $tempPath $zipPath
        
        $zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
        $entry = $zip.GetEntry("word/document.xml")
        if ($entry) {
            $reader = new-object System.IO.StreamReader($entry.Open())
            $xml = $reader.ReadToEnd()
            $reader.Close()
            $text = $xml -replace '<[^>]+>', ''
            $zip.Dispose()
            Remove-Item $zipPath
            return $text
        }
        $zip.Dispose()
        Remove-Item $zipPath
    } catch {
        Write-Host "Error reading $path"
    }
    return ""
}

$data = @()

# Discover directories safely to avoid encoding issues in script
$dirs = Get-ChildItem -Directory
$sutraDir = $dirs | Where-Object { $_.Name -match "经" } | Select-Object -First 1
$mastersDir = $dirs | Where-Object { $_.Name -match "祖师" } | Select-Object -First 1
$searchDir = $dirs | Where-Object { $_.Name -match "搜索" } | Select-Object -First 1

# 1. Sutras
if ($sutraDir) {
    $files = Get-ChildItem "$($sutraDir.FullName)\*.txt"
    foreach ($file in $files) {
        Write-Host "Sutra: $($file.Name)"
        $c = Get-Content $file.FullName -Raw -Encoding UTF8
        # Use English keys, map in frontend
        $data += @{ id=$file.Name; title=$file.BaseName; category="sutra"; content=$c; type="txt" }
    }
}

# 1.5 Masters
if ($mastersDir) {
    $files = Get-ChildItem "$($mastersDir.FullName)\*.txt"
    foreach ($file in $files) {
        Write-Host "Master: $($file.Name)"
        $c = Get-Content $file.FullName -Raw -Encoding UTF8
        $data += @{ id=$file.Name; title=$file.BaseName; category="master"; content=$c; type="txt" }
    }
}

# 2. Teachings (Root)
$files = Get-ChildItem "*.txt" | Where-Object { $_.Name -match "文字" }
foreach ($file in $files) {
    Write-Host "Teaching: $($file.Name)"
    $c = Get-Content $file.FullName -Raw -Encoding UTF8
    $data += @{ id=$file.Name; title=$file.BaseName; category="teaching"; content=$c; type="txt" }
}

# 3. Search Results
if ($searchDir) {
    $allFiles = Get-ChildItem "$($searchDir.FullName)\*" -Include *.txt, *.docx
    $grouped = $allFiles | Group-Object BaseName
    
    foreach ($group in $grouped) {
        # Prefer .txt over .docx
        $file = $group.Group | Where-Object { $_.Extension -eq ".txt" } | Select-Object -First 1
        if (-not $file) {
            $file = $group.Group | Where-Object { $_.Extension -eq ".docx" } | Select-Object -First 1
        }

        if ($file) {
            Write-Host "SearchFile: $($file.Name)"
            $c = ""
            $t = "txt"
            if ($file.Extension -eq ".docx") {
                $c = Get-DocxText -path $file.FullName
                $t = "docx"
            } else {
                $c = Get-Content $file.FullName -Raw -Encoding UTF8
            }
            $data += @{ id=$file.Name; title=$file.BaseName; category="search_result"; content=$c; type=$t }
        }
    }
}

$json = $data | ConvertTo-Json -Depth 2 -Compress
$js = "const SEARCH_DATA = $json;"
Set-Content "search_data.js" -Value $js -Encoding UTF8
Write-Host "Done"
