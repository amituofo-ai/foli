$files = Get-ChildItem "佛经\*.txt"
$data = @{}

foreach ($file in $files) {
    # Read raw content, force UTF8
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $data[$file.Name] = $content
}

# Convert to JSON
$json = $data | ConvertTo-Json -Depth 1 -Compress

# Wrap in JS variable
$jsContent = "const SUTRAS_DATA = $json;"

# Write to file
Set-Content "sutras_data.js" -Value $jsContent -Encoding UTF8
